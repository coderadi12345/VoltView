import { useState } from 'react';
import { IndianRupee, ReceiptText } from 'lucide-react';
import { DataTable, StatusBadge } from '../components/DataTable';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { api, unwrap } from '../services/api';
import { useResource } from '../hooks/useResource';
import { useAuth } from '../context/AuthContext';

export const Billing = () => {
  const { user } = useAuth();
  const { rows, loading, setRows } = useResource('/bills');
  const [generating, setGenerating] = useState(false);

  const total = rows.reduce((sum, bill) => sum + (bill.amount || 0), 0);

  const generate = async () => {
    setGenerating(true);
    try {
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const periodEnd = now.toISOString();
      const bill = await unwrap(api.post('/billing/generate', {
        periodStart,
        periodEnd,
        organization: user?.organization?._id || user?.organization
      }));
      setRows((current) => [bill, ...current]);
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2">
        <StatCard label="Generated Bills" value={rows.length} helper="Draft and generated bills" icon={ReceiptText} />
        <StatCard label="Total Billed" value={`₹${total.toFixed(2)}`} helper="All generated bills" icon={IndianRupee} tone="text-accent" />
      </section>
      <Card className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Billing Engine</h2>
          <p className="text-sm text-slate-400">Supports flat, slab, and custom tariff rules.</p>
        </div>
        <Button onClick={generate} disabled={loading || generating}>
          {generating ? 'Generating...' : 'Generate Current Month Bill'}
        </Button>
      </Card>
      <DataTable
        title="Bills"
        rows={rows}
        columns={[
          { key: 'periodStart', label: 'Period Start', render: (row) => new Date(row.periodStart).toLocaleDateString() },
          { key: 'periodEnd', label: 'Period End', render: (row) => new Date(row.periodEnd).toLocaleDateString() },
          { key: 'billingType', label: 'Type' },
          { key: 'units', label: 'Units', render: (row) => `${row.units?.toFixed?.(2) || row.units} kWh` },
          { key: 'amount', label: 'Amount', render: (row) => `₹${row.amount?.toFixed?.(2) || row.amount}` },
          { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
        ]}
      />
    </div>
  );
};
