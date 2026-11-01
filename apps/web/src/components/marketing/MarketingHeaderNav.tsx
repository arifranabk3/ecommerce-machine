'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3,
  Search, 
  Globe2, 
  CheckCircle, 
  Users, 
  FileSpreadsheet, 
  Zap, 
  LayoutTemplate, 
  Inbox 
} from 'lucide-react';
import { cn } from '@/utils/cn';

export interface IMarketingNavTab {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const MARKETING_NAV_TABS: IMarketingNavTab[] = [
  { name: 'Overview', href: '/marketing', icon: BarChart3 },
  { name: 'Lead Finder (USA)', href: '/marketing/leads/finder', icon: Search },
  { name: 'Email Grabber', href: '/marketing/leads/grabber', icon: Globe2 },
  { name: 'Email Verification', href: '/marketing/leads/verification', icon: CheckCircle },
  { name: 'Lead Lists', href: '/marketing/leads', icon: Users },
  { name: 'Excel Import & Match', href: '/marketing/match', icon: FileSpreadsheet },
  { name: 'Campaigns', href: '/campaigns', icon: Zap },
  { name: 'Templates', href: '/templates', icon: LayoutTemplate },
  { name: 'Unified Inbox', href: '/messages', icon: Inbox },
];

export const MarketingHeaderNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-slate-200 bg-white px-2 py-1.5 rounded-xl shadow-sm mb-6">
      {MARKETING_NAV_TABS.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
              isActive
                ? "bg-brand-50 text-brand-600 shadow-sm border border-brand-100"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <Icon className={cn("w-4 h-4", isActive ? "text-brand-600" : "text-slate-400")} />
            <span>{tab.name}</span>
            {tab.badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700 font-extrabold">
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
};
