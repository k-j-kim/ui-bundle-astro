// Post-build fixups for the UI Bundle runtime.
//
//  1. The bundle is served from a dynamic mount path (e.g.
//     `/lwr/application/ai/c-BaseAstroApp/`). Astro emits absolute URLs like
//     `/assets/foo.css` which would resolve to the Experience Cloud root, so
//     we rewrite every in-HTML URL (`/assets/...`, `/contacts`, etc.) to a
//     depth-correct relative URL — same net effect as Vite `base: './'` in
//     the React template, but applied post-build because Astro's MPA build
//     does not honor `base: './'` for emitted HTML.
//  2. Verify `dist/index.html` exists (required by `ui-bundle.json`'s
//     `fallback: index.html` SPA routing).
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const dist = resolve(process.cwd(), 'dist');
const rootIndex = resolve(dist, 'index.html');

if (!existsSync(rootIndex)) {
  console.error('[postbuild] dist/index.html is missing — fallback routing requires it.');
  process.exit(1);
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// For an HTML file at `dist/a/b/index.html`, depth = 2 → prefix = "../../".
// For `dist/index.html`, depth = 0 → prefix = "./".
function relPrefixFor(htmlFile) {
  const rel = relative(dist, htmlFile);
  const depth = rel.split(/[\\/]/).length - 1;
  return depth === 0 ? './' : '../'.repeat(depth);
}

// Rewrite any attribute that points to a root-relative path (`/foo`) so it
// resolves under the dynamic mount. Covers `src`, `href`, and also
// astro-island's `component-url`, `renderer-url`, `before-hydration-url`, etc.
// Skips protocol-relative URLs (`//host`) and bare `/`.
function rewriteHtml(html, prefix) {
  return html.replace(
    /\b([a-zA-Z][\w-]*)=(["'])\/(?!\/)([^"']*?)\2/g,
    (_m, attr, q, path) => `${attr}=${q}${prefix}${path}${q}`,
  );
}

// Extract inline <script>…</script> bodies to external files. Salesforce's
// strict CSP (`script-src 'self' …`) blocks inline scripts without a nonce we
// don't control, so Astro's bootstrap + astro-island hydration JS never runs.
// Writing each distinct inline body to `dist/assets/inline-<hash>.js` and
// swapping the tag for `<script type="module" src="…">` keeps hydration working.
// Write inline bootstrap scripts at the dist root (NOT under /assets/).
// The astro-island custom element has `component-url="./assets/RecordList.js"`
// in the HTML, but the dynamic `import()` that consumes it runs from *inside*
// the inline-bootstrap script and resolves paths relative to that script's
// URL. If the script sits at `/assets/inline-xxx.js`, those imports become
// `/assets/assets/RecordList.js` (404). Placing the script at the dist root
// (same level as the HTML pages) makes the base URLs match again.
const extractedInline = new Map(); // hash -> filename (deduped across pages)

function externalizeInlineScripts(html, prefix) {
  return html.replace(
    /<script(\b[^>]*)?>([\s\S]*?)<\/script>/g,
    (full, attrs = '', body) => {
      if (/\bsrc\s*=/.test(attrs ?? '')) return full;
      const code = body.trim();
      if (!code) return full;
      const hash = createHash('sha256').update(code).digest('hex').slice(0, 12);
      const filename = `inline-${hash}.js`;
      if (!extractedInline.has(hash)) {
        writeFileSync(resolve(dist, filename), code);
        extractedInline.set(hash, filename);
      }
      const cleaned = (attrs ?? '').replace(/\s*type\s*=\s*(["'])[^"']*\1/g, '');
      return `<script${cleaned} src="${prefix}${filename}"></script>`;
    },
  );
}

let rewritten = 0;
for (const file of walk(dist)) {
  if (!file.endsWith('.html')) continue;
  const prefix = relPrefixFor(file);
  const before = readFileSync(file, 'utf8');
  const extracted = externalizeInlineScripts(before, prefix);
  const after = rewriteHtml(extracted, prefix);
  if (after !== before) {
    writeFileSync(file, after);
    rewritten++;
  }
}

// Also rewrite absolute `/assets/...` URLs inside emitted CSS (e.g. url(/assets/…))
// and JS chunks so hydration + lazy-loaded chunks resolve under the mount.
// Astro's code-split islands reference chunks via `/assets/xxx.js` in the entry
// JS, which breaks under a non-root mount the same way CSS does.
function rewriteAssetRefs(src) {
  // Chunks live in `dist/assets/` and import each other by absolute path
  // (`"/assets/foo.js"`). Since every chunk is a sibling, rewrite to a
  // bare relative path (`"./foo.js"`) so imports resolve regardless of the
  // bundle's runtime mount.
  return src.replace(/(["'(=])\/assets\//g, '$1./');
}

let chunksRewritten = 0;
for (const file of walk(dist)) {
  if (!/\.(css|js|mjs)$/.test(file)) continue;
  const before = readFileSync(file, 'utf8');
  const after = rewriteAssetRefs(before);
  if (after !== before) {
    writeFileSync(file, after);
    chunksRewritten++;
  }
}

const size = statSync(rootIndex).size;
console.log(
  `[postbuild] rewrote ${rewritten} HTML file(s), ${chunksRewritten} asset chunk(s), ` +
    `externalized ${extractedInline.size} inline script(s); dist/index.html OK (${size} bytes)`,
);
