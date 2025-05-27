// src/components/loader.tsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  size?: number; 
}

export function Spinner({ className, size = 24 }: SpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-primary', className)}
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}
