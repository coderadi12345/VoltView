import { DataTable } from '../components/DataTable';
import { useResource } from '../hooks/useResource';

export const AuditLogs = () => {
  const { rows } = useResource('/audit-logs');

  return (
    <DataTable
      title="Audit Logs"
      rows={rows}
      columns={[
        { key: 'action', label: 'Action' },
        { key: 'entityType', label: 'Entity' },
        { key: 'actor', label: 'Actor', render: (row) => row.actor?.name || 'System' },
        { key: 'ipAddress', label: 'IP Address' },
        { key: 'createdAt', label: 'Timestamp', render: (row) => new Date(row.createdAt).toLocaleString() }
      ]}
    />
  );
};
