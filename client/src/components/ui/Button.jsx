import { cn } from '../../utils/cn';

export const Button = ({ className, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-primary text-slate-950 hover:bg-sky-300',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
