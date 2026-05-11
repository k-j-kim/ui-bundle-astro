import { useEffect, useMemo, useState } from 'react';
import { runQuery } from '@lib/sdk';

export interface RecordListColumn {
  label: string;
  field: string;
  align?: 'left' | 'right';
  currency?: boolean;
  muted?: boolean;
}

export interface RecordListProps {
  sobject: string;
  columns: RecordListColumn[];
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
  first?: number;
  emptyLabel?: string;
}

function formatValue(v: any, col: RecordListColumn): string {
  if (v == null || v === '') return '—';
  if (col.currency) {
    const n = typeof v === 'number' ? v : Number(v);
    if (Number.isFinite(n)) {
      return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    }
  }
  return String(v);
}

// React island: fetches SObject rows via UI API GraphQL. Accepts a column spec so
// the same component powers Accounts, Contacts, Opportunities, etc.
export default function RecordList({ sobject, columns, orderBy = 'Name', orderDir = 'ASC', first = 25, emptyLabel }: RecordListProps) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const gql = useMemo(() => {
    const fieldSelection = columns
      .map(c => `${c.field} { value }`)
      .join(' ');
    return /* GraphQL */ `
      query ${sobject}List {
        uiapi {
          query {
            ${sobject}(first: ${first}, orderBy: { ${orderBy}: { order: ${orderDir} } }) {
              edges { node { Id ${fieldSelection} } }
            }
          }
        }
      }
    `;
  }, [sobject, columns, orderBy, orderDir, first]);

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    setError(null);
    (async () => {
      try {
        const res = await runQuery(gql);
        if (cancelled) return;
        const edges = res?.data?.uiapi?.query?.[sobject]?.edges ?? [];
        setRows(
          edges.map((e: any) => {
            const node = e.node;
            const out: any = { Id: node.Id };
            for (const c of columns) out[c.field] = node?.[c.field]?.value ?? null;
            return out;
          }),
        );
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      }
    })();
    return () => { cancelled = true; };
  }, [gql]);

  const filtered = useMemo(() => {
    if (!rows) return rows;
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      columns.some(c => String(r[c.field] ?? '').toLowerCase().includes(q)),
    );
  }, [rows, query, columns]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${sobject.toLowerCase()}…`}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg ring-1 ring-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <span className="text-xs text-slate-500">
          {rows == null ? 'Loading…' : `${filtered?.length ?? 0} of ${rows.length}`}
        </span>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 ring-1 ring-rose-200 text-rose-700 text-sm px-4 py-3">
          <strong className="font-semibold">Query failed.</strong> {error}
        </div>
      )}

      {!error && rows == null && (
        <div className="divide-y divide-slate-100 rounded-xl ring-1 ring-slate-200 bg-white overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex gap-3 animate-pulse">
              <div className="h-4 flex-1 rounded bg-slate-100" />
              <div className="h-4 w-24 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {!error && rows && filtered && filtered.length === 0 && (
        <p className="text-sm text-slate-500 italic">
          {emptyLabel ?? `No ${sobject.toLowerCase()} match “${query}”.`}
        </p>
      )}

      {!error && filtered && filtered.length > 0 && (
        <div className="overflow-hidden rounded-xl ring-1 ring-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                {columns.map(c => (
                  <th key={c.field} className={`px-4 py-2.5 font-semibold ${c.align === 'right' ? 'text-right' : 'text-left'}`}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(r => (
                <tr key={r.Id} className="hover:bg-slate-50/70 transition">
                  {columns.map((c, i) => (
                    <td
                      key={c.field}
                      className={[
                        'px-4 py-2.5',
                        c.align === 'right' ? 'text-right tabular-nums' : '',
                        c.muted ? 'text-slate-500' : 'text-slate-900',
                        i === 0 ? 'font-medium' : '',
                      ].join(' ')}
                    >
                      {formatValue(r[c.field], c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
