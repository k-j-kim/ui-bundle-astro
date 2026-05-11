/// <reference types="astro/client" />

declare global {
  // Injected by the Salesforce UI Bundle runtime. `basePath` is the mount path
  // where this bundle is served (e.g. `/lwr/application/ai/c-app`). Strip the
  // trailing slash before using it as a router basename.
  interface SfdcEnv {
    basePath?: string;
  }
  // eslint-disable-next-line no-var
  var SFDC_ENV: SfdcEnv | undefined;
}

export {};
