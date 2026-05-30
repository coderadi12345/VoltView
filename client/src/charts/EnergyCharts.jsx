import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';

const colors = ['#38bdf8', '#22c55e', '#f59e0b', '#a78bfa', '#ef4444', '#14b8a6'];

const chartTheme = {
  contentStyle: { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 },
  labelStyle: { color: '#e2e8f0' }
};

export const DailyConsumptionChart = ({ data }) => (
  <Card className="min-h-96">
    <CardHeader>
      <CardTitle>Daily Consumption</CardTitle>
    </CardHeader>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="units" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
        <YAxis stroke="#64748b" />
        <Tooltip {...chartTheme} />
        <Area type="monotone" dataKey="units" stroke="#38bdf8" fill="url(#units)" strokeWidth={3} />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);

export const DeviceDistributionChart = ({ data }) => (
  <Card className="min-h-96">
    <CardHeader>
      <CardTitle>Device Distribution</CardTitle>
    </CardHeader>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip {...chartTheme} />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

export const PeakUsageChart = ({ data }) => (
  <Card className="min-h-96">
    <CardHeader>
      <CardTitle>Peak Usage Hours</CardTitle>
    </CardHeader>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="hour" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip {...chartTheme} />
        <Bar dataKey="units" fill="#22c55e" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);
