import { cn } from '../../utils/cn';

export const Input = ({ className, ...props }) => (
  <input
    className={cn(
      'w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-primary',
      className
    )}
    {...props}
  />
);
