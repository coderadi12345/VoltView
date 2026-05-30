import { cn } from '../../utils/cn';

export const Card = ({ className, ...props }) => (
  <div className={cn('rounded-2xl border border-white/10 bg-card/80 p-5 shadow-glow backdrop-blur', className)} {...props} />
);

export const CardHeader = ({ className, ...props }) => (
  <div className={cn('mb-4 flex items-center justify-between gap-3', className)} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn('text-sm font-semibold uppercase tracking-[0.2em] text-slate-400', className)} {...props} />
);
