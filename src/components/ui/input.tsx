import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Keep layout-related classes
        'flex h-10 w-full min-w-0 rounded-md bg-transparent px-3 py-4 text-base md:text-sm',
        // Remove default border + shadow
        'border-none shadow-none',
        // Keep accessibility & focus handling
        'outline-none focus-visible:outline-none focus-visible:ring-0',
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Input };
