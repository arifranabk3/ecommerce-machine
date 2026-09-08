import React from 'react';
import { Bell, Search, Menu, Moon, ChevronDown } from 'lucide-react';

export const TopNav: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  return (
    <header className="h-[72px] bg-[#fbfdfc] px-4 md:px-8 flex items-center justify-between border-b border-slate-100 shrink-0">
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-full max-w-xl hidden md:block">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, customers, products, vendors..."
            className="w-full pl-10 pr-16 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300 transition shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">Ctrl K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Currency Dropdown */}
        <div className="hidden md:flex items-center gap-2 cursor-pointer px-2 py-1.5 hover:bg-slate-50 rounded-lg transition-colors">
          <div className="w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">☾</span>
          </div>
          <span className="text-sm font-semibold text-slate-700">PKR</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        <div className="h-6 w-px bg-slate-200 hidden md:block" />

        {/* Icons */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>
          
          <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors">
            <Moon className="w-5 h-5" />
          </button>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-brand-300 flex items-center justify-center font-bold text-white shadow-sm ring-2 ring-transparent group-hover:ring-brand-200 transition-all">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-slate-900 leading-tight">Arif Mahmood</p>
            <p className="text-xs text-slate-500 font-medium">Owner</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
        </div>
      </div>
    </header>
  );
};
