'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  ShieldCheck, 
  Receipt,
  Package,
  LineChart,
  ChevronDown,
  Palette,
  Box,
  Globe
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const mainNav = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
  ];

  const commerceNav = [
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Inventory', href: '/inventory', icon: Box },
    { name: 'Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/customers', icon: Users },
  ];

  const growthNav = [
    { name: 'Marketing', href: '/campaigns', icon: LineChart },
    { name: 'Automation', href: '/automation', icon: Settings },
    { name: 'Analytics', href: '/analytics', icon: LineChart },
  ];

  const experienceNav = [
    { name: 'Themes', href: '/themes', icon: Palette },
    { name: 'Integrations', href: '/integrations', icon: ShieldCheck },
  ];
  
  const platformNav = [
    { name: 'Domains', href: '/settings/domains', icon: Globe },
    { name: 'Billing', href: '/settings/subscription', icon: Receipt },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const NavGroup = ({ items, label }: { items: any[], label?: string }) => (
    <div className="mb-6">
      {label && <h4 className="px-4 mb-2 text-[10px] font-bold text-content-muted uppercase tracking-widest">{label}</h4>}
      <nav className="space-y-0.5 px-2">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                isActive 
                  ? "bg-brand-50 text-brand-600" 
                  : "text-content-secondary hover:text-content-primary hover:bg-surface-hover"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn(
                  "w-4 h-4 transition-colors", 
                  isActive ? "text-brand-600" : "text-content-muted group-hover:text-content-secondary"
                )} />
                <span className={cn(isActive && "font-semibold")}>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-content-primary/40 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Content */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-[260px] bg-surface border-r border-border flex flex-col justify-between pt-5 pb-4 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full hidden md:flex"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 mb-8">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-content-primary tracking-tight leading-none">Sellzy</h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <NavGroup items={mainNav} />
            <NavGroup items={commerceNav} label="Commerce" />
            <NavGroup items={growthNav} label="Growth" />
            <NavGroup items={experienceNav} label="Experience" />
            <NavGroup items={platformNav} label="Platform" />
          </div>

          {/* Bottom Profile */}
          <div className="mt-4 px-4">
            <div className="px-3 py-2.5 flex justify-between items-center cursor-pointer hover:bg-surface-hover rounded-xl transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center overflow-hidden border border-border group-hover:border-border-subtle transition-colors">
                  <span className="text-[10px] font-bold text-content-secondary">AR</span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-content-primary leading-tight">Arif Rana</p>
                  <p className="text-[11px] text-content-secondary font-medium">Owner</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-content-muted group-hover:text-content-secondary" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
