import { ArrowUpRight } from 'lucide-react';
import { Card } from './ui/Card';

export const StatCard = ({ label, value, helper, icon: Icon = ArrowUpRight, tone = 'text-primary' }) => (
  <Card>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</p>
        <p className="mt-2 text-xs text-slate-500">{helper}</p>
      </div>
      <div className={`rounded-2xl border border-white/10 bg-white/5 p-3 ${tone}`}>
        <Icon size={22} />
      </div>
    </div>
  </Card>
);
