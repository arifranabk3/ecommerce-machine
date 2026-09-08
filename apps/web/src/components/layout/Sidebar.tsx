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
  Package,
  LineChart,
  Headset,
  ChevronDown,
  Palette
} from 'lucide-react';

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, active: true },
    { name: 'Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Vendors', href: '/vendors', icon: Truck },
    { name: 'Payments', href: '/payments', icon: Receipt },
    { name: 'Finance', href: '/finance', icon: Receipt },
    { name: 'Settlements', href: '/settlements', icon: Receipt },
    { name: 'Marketing', href: '/campaigns', icon: LineChart },
    { name: 'Automation', href: '/automation', icon: Settings },
    { name: 'Messages', href: '/messages', icon: Users, badge: '14' },
    { name: 'Analytics', href: '/analytics', icon: LineChart },
    { name: 'AI Copilot', href: '/ai', icon: ShieldCheck },
    { name: 'Integrations', href: '/integrations', icon: ShieldCheck },
    { name: 'Security', href: '/security', icon: ShieldCheck },
    { name: 'Storefront Theme', href: '/settings/theme', icon: Palette },
    { name: 'Settings', href: '/settings/business', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#fbfdfc] border-r border-slate-200 flex-col justify-between p-4 transform transition-transform duration-200 ease-in-out
        md:relative md:flex md:translate-x-0 
        ${isOpen ? 'translate-x-0 flex' : '-translate-x-full hidden md:flex'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-2 mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-500">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h1 className="font-extrabold text-lg text-slate-900 tracking-tight uppercase leading-none">Sellzy</h1>
              <span className="text-[10px] text-slate-500 font-medium">Grow Faster. Sell Smarter.</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1 -mr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    item.active
                      ? 'bg-brand-300 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Widgets */}
          <div className="mt-6 space-y-4">
            <div className="px-3 py-3 rounded-xl border border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Workspace</p>
                <p className="text-sm font-bold text-slate-900">My Store</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            <div className="px-3 py-3 flex items-start gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-brand-50 transition-colors">
                <Headset className="w-4 h-4 text-slate-600 group-hover:text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Need Help?</p>
                <p className="text-xs text-slate-500">Chat with our support team</p>
              </div>
            </div>
            
            <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 flex justify-center items-center gap-2">
               Contact Support
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
