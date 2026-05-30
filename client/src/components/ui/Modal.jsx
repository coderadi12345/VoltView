import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { Card } from './Card';
import { Button } from './Button';

export const Modal = ({ isOpen, onClose, title, children, className }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <Card className={cn('relative w-full max-w-lg z-10', className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <Button variant="ghost" className="p-1 h-8 w-8" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        {children}
      </Card>
    </div>,
    document.body
  );
};
