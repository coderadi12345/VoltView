import { AlertTriangle, Bell } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/ui/Badge';
import { useResource } from '../hooks/useResource';

const severityTone = {
  low: 'default',
  medium: 'warning',
  high: 'danger',
  critical: 'danger'
};

export const Alerts = () => {
  const alerts = useResource('/alerts');
  const notifications = useResource('/notifications');

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2">
        <StatCard label="Open Alerts" value={alerts.rows.filter((alert) => !alert.isResolved).length} helper="Needs attention" icon={AlertTriangle} tone="text-warning" />
        <StatCard label="Notifications" value={notifications.rows.length} helper="In-app and email events" icon={Bell} />
      </section>
      <DataTable
        title="Alerts"
        rows={alerts.rows}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'type', label: 'Type' },
          { key: 'severity', label: 'Severity', render: (row) => <Badge tone={severityTone[row.severity]}>{row.severity}</Badge> },
          { key: 'message', label: 'Message' },
          { key: 'isResolved', label: 'Status', render: (row) => (row.isResolved ? 'Resolved' : 'Open') }
        ]}
      />
      <DataTable
        title="Notifications"
        rows={notifications.rows}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'channel', label: 'Channel' },
          { key: 'message', label: 'Message' },
          { key: 'createdAt', label: 'Created', render: (row) => new Date(row.createdAt).toLocaleString() }
        ]}
      />
    </div>
  );
};
