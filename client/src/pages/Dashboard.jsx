import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Building2, Gauge, IndianRupee, Leaf, PlugZap, Zap } from 'lucide-react';
import { DeviceDistributionChart, DailyConsumptionChart, PeakUsageChart } from '../charts/EnergyCharts';
import { SkeletonGrid } from '../components/Skeleton';
import { StatCard } from '../components/StatCard';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { api, unwrap } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);

  const handlers = useMemo(
    () => ({
      'energy:update': (event) => setEvents((current) => [`Energy update: ${event.unitsConsumed} units`, ...current].slice(0, 5)),
      ...(['super_admin', 'admin', 'manager'].includes(user?.role) && {
        'alert:new': (event) => setEvents((current) => [`Alert: ${event.title}`, ...current].slice(0, 5)),
      }),
      'device:update': (event) => setEvents((current) => [`Device ${event.name} is ${event.status}`, ...current].slice(0, 5))
    }),
    [user]
  );

  useSocket(handlers);

  useEffect(() => {
    unwrap(api.get('/dashboard/summary')).then(setSummary);
  }, []);

  if (!summary) return <SkeletonGrid />;

  const { kpis, charts } = summary;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Units" value={`${kpis.totalUnits} kWh`} helper="Current month" icon={Zap} />
        <StatCard label="Monthly Cost" value={`₹${kpis.monthlyCost}`} helper="Estimated utility spend" icon={IndianRupee} tone="text-accent" />
        <StatCard label="Active Devices" value={`${kpis.activeDevices}/${kpis.totalDevices}`} helper="Online monitored assets" icon={PlugZap} />
        <StatCard label="Buildings" value={kpis.totalBuildings} helper="Managed facilities" icon={Building2} />
        {['super_admin', 'admin', 'manager'].includes(user?.role) && (
          <StatCard label="Total Alerts" value={kpis.totalAlerts} helper="Open energy alerts" icon={AlertTriangle} tone="text-warning" />
        )}
        <StatCard label="Energy Score" value={`${kpis.energyScore}/100`} helper="Efficiency and budget compliance" icon={Gauge} tone="text-accent" />
        <StatCard label="Monthly CO₂" value={`${kpis.monthlyCo2Kg} kg`} helper="Carbon footprint estimate" icon={Leaf} tone="text-accent" />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DailyConsumptionChart data={charts.dailyConsumption} />
        </div>
        <DeviceDistributionChart data={charts.deviceDistribution} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <PeakUsageChart data={charts.peakUsageHours} />
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Live Operations Feed</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {(events.length ? events : ['Waiting for live Socket.IO events...']).map((event, index) => (
              <div key={`${event}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                {event}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};
