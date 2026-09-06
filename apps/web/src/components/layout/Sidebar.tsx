import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Truck, 
  Settings, 
  ShieldCheck, 
  Receipt,
  HelpCircle
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, active: true },
    { name: 'Orders (Coming)', href: '#', icon: ShoppingBag, disabled: true },
    { name: 'Users & Roles', href: '#', icon: Users, disabled: true },
    { name: 'Vendors (Coming)', href: '#', icon: Truck, disabled: true },
    { name: 'Audit Logs', href: '#', icon: ShieldCheck, disabled: true },
    { name: 'Settings', href: '#', icon: Settings, disabled: true },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center gap-3 px-3 py-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-brand-300 flex items-center justify-center font-bold text-brand-900 shadow-sm">
            SZ
          </div>
          <div>
            <h1 className="font-bold text-base text-brand-900 tracking-tight">Sellzy</h1>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Ecommerce Ops</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-brand-50 text-brand-900 border-l-4 border-brand-300'
                    : item.disabled
                    ? 'text-slate-400 cursor-not-allowed opacity-60'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.active ? 'text-brand-700' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center font-semibold text-xs text-brand-800">
            SA
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-800 truncate">Store Admin</p>
            <p className="text-[11px] text-slate-500 truncate">admin@sellzy.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
