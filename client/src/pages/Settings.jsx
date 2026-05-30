import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useResource } from '../hooks/useResource';

export const Settings = () => {
  const { rows } = useResource('/settings');
  const setting = rows[0];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Electricity Rates</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <label className="block text-sm text-slate-400">
            Billing Type
            <Input className="mt-2" value={setting?.billingType || 'slab'} readOnly />
          </label>
          <label className="block text-sm text-slate-400">
            Flat Rate
            <Input className="mt-2" value={setting?.electricityRate || 7} readOnly />
          </label>
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notification Thresholds</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <label className="block text-sm text-slate-400">
            High Consumption Units Daily
            <Input className="mt-2" value={setting?.thresholds?.highConsumptionUnitsDaily || 250} readOnly />
          </label>
          <label className="block text-sm text-slate-400">
            Monthly Budget
            <Input className="mt-2" value={setting?.thresholds?.monthlyBudget || 50000} readOnly />
          </label>
          <label className="block text-sm text-slate-400">
            Runtime Hours
            <Input className="mt-2" value={setting?.thresholds?.runtimeHours || 12} readOnly />
          </label>
        </div>
      </Card>
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Slab Tariff Rules</CardTitle>
        </CardHeader>
        <div className="grid gap-3 md:grid-cols-3">
          {(setting?.tariffRules || []).map((rule) => (
            <div key={`${rule.from}-${rule.to}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-lg font-bold">
                {rule.from} - {rule.to || 'above'} units
              </p>
              <p className="text-sm text-slate-400">₹{rule.rate} per unit</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
