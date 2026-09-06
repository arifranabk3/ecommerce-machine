import React from 'react';
import { Bell, Search, Globe } from 'lucide-react';

export const TopNav: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, SKU, vendors..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>Tenant: <strong className="text-brand-900">Alpha Store</strong></span>
        </div>

        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-400 rounded-full" />
        </button>
      </div>
    </header>
  );
};
