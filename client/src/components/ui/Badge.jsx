import { cn } from '../../utils/cn';

export const Badge = ({ className, tone = 'default', ...props }) => {
  const tones = {
    default: 'border-slate-500/30 bg-slate-500/10 text-slate-200',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    danger: 'border-red-500/30 bg-red-500/10 text-red-300'
  };

  return <span className={cn('rounded-full border px-2.5 py-1 text-xs font-medium', tones[tone], className)} {...props} />;
};
