import EmptyState from "../common/EmptyState";

export default function AdminTable({ columns, rows, emptyTitle = "Nothing here yet", emptyDescription }) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl2 border border-brand-100 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-100 bg-sand-50">
            {columns.map((col) => (
              <th key={col.key} className={`px-5 py-3.5 font-semibold text-brand-700 ${col.className || ""}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-brand-50 last:border-0 hover:bg-sand-50/60">
              {columns.map((col) => (
                <td key={col.key} className={`px-5 py-4 align-middle text-brand-800 ${col.className || ""}`}>
                  {row.cells[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
