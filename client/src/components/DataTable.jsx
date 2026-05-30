import { Badge } from './ui/Badge';
import { Card, CardHeader, CardTitle } from './ui/Card';

export const DataTable = ({ title, action, columns, rows, empty = 'No records found' }) => (
  <Card className="overflow-hidden p-0">
    <CardHeader className="mb-0 border-b border-white/10 px-5 py-4">
      <CardTitle>{title}</CardTitle>
      {action && <div>{action}</div>}
    </CardHeader>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-3 font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.length === 0 ? (
            <tr>
              <td className="px-5 py-8 text-center text-slate-500" colSpan={columns.length}>
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row._id || row.name} className="hover:bg-white/[0.02]">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 text-slate-300">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </Card>
);

export const StatusBadge = ({ status }) => {
  const tone = status === 'online' || status === 'generated' ? 'success' : status === 'disabled' ? 'danger' : 'warning';
  return <Badge tone={tone}>{status}</Badge>;
};
