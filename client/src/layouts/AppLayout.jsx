import { NavLink, Outlet } from 'react-router-dom';
import {
  Activity,
  Bell,
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/devices', label: 'Devices', icon: Zap },
  { to: '/organization', label: 'Organization', icon: Building2, roles: ['super_admin', 'admin', 'manager'] },
  { to: '/billing', label: 'Billing', icon: CreditCard },
  { to: '/alerts', label: 'Alerts', icon: Bell, roles: ['super_admin', 'admin', 'manager'] },
  { to: '/audit-logs', label: 'Audit Logs', icon: ShieldCheck, roles: ['super_admin', 'admin', 'manager'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['super_admin', 'admin', 'manager'] }
];

export const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/10 bg-slate-950/75 p-5 backdrop-blur-xl lg:block">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary p-3 text-slate-950">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">VoltView</h1>
            <p className="text-xs text-slate-500">See Every Watt. Control Every Cost.</p>
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems
            .filter((item) => !item.roles || item.roles.includes(user?.role))
            .map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-primary text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-background/75 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm text-slate-400">
                <Activity size={16} className="text-accent" />
                Live energy operations center
              </p>
              <h2 className="mt-1 text-2xl font-bold">Smart Utility Management</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs capitalize text-slate-500">{user?.role?.replace('_', ' ')}</p>
              </div>
              <Button variant="secondary" onClick={logout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
