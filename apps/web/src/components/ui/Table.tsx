import React from 'react';
import { cn } from '@/utils/cn';

export const Table: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className="w-full overflow-x-auto">
    <table className={cn("w-full text-sm text-left text-content-primary", className)}>
      {children}
    </table>
  </div>
);

export const Thead: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <thead className="text-[11px] text-content-secondary font-bold uppercase tracking-wider bg-surface-secondary/50 border-b border-border">
    {children}
  </thead>
);

export const Tbody: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-border bg-transparent">
    {children}
  </tbody>
);

export const Tr: React.FC<{ children?: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <tr 
    className={cn(
      "hover:bg-surface-secondary/50 transition-colors group",
      onClick && "cursor-pointer",
      className
    )}
    onClick={onClick}
  >
    {children}
  </tr>
);

export const Th: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th scope="col" className={cn("px-4 py-3.5 font-bold text-content-secondary", className)}>
    {children}
  </th>
);

export const Td: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <td className={cn("px-4 py-4 whitespace-nowrap", className)}>
    {children}
  </td>
);
