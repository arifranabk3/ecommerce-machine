'use client';
import React from 'react';
import { Bell, Search, Menu, Command, Store, ChevronDown } from 'lucide-react';

export const TopNav: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-surface px-4 md:px-8 flex items-center justify-between border-b border-border shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-content-secondary hover:text-content-primary hover:bg-surface-hover rounded-lg md:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Global Search */}
        <div className="relative w-full max-w-xl hidden md:block">
          <div className="relative">
            <Search className="w-5 h-5 text-content-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search products, orders, customers..." 
              className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-2.5 text-sm text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Store Context Switcher */}
        <div className="hidden lg:flex items-center gap-2 cursor-pointer px-2 py-1.5 hover:bg-surface-hover rounded-xl transition-all group">
          <div className="flex flex-col text-right">
            <span className="text-[13px] font-bold text-content-primary leading-tight">Acme Fashion</span>
            <span className="text-[11px] text-content-secondary leading-tight">Pakistan · PKR</span>
          </div>
          <ChevronDown className="w-4 h-4 text-content-muted group-hover:text-content-secondary ml-1" />
        </div>

        <div className="h-8 w-px bg-border hidden lg:block" />

        {/* Notifications */}
        <button className="relative p-2 text-content-secondary hover:text-content-primary hover:bg-surface-hover rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-surface-hover p-1.5 pr-2 rounded-xl transition-colors group">
          <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-[12px] shadow-sm border border-brand-100">
            AK
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-[13px] font-bold text-content-primary leading-tight">Arif Khan</span>
            <span className="text-[11px] text-content-secondary leading-tight">Owner</span>
          </div>
          <ChevronDown className="w-4 h-4 text-content-muted group-hover:text-content-secondary" />
        </div>
      </div>
    </header>
  );
};
