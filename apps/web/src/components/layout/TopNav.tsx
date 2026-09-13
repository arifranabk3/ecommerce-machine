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
        
        {/* Global Search / Command Palette Trigger */}
        <div className="relative w-full max-w-md hidden md:block">
          <button className="w-full flex items-center justify-between px-3 py-2 bg-background border border-border rounded-lg text-sm text-content-muted hover:bg-surface-secondary hover:border-content-muted transition-all shadow-sm group">
            <span className="flex items-center gap-2 group-hover:text-content-secondary transition-colors">
              <Search className="w-4 h-4 text-content-muted group-hover:text-brand-600 transition-colors" />
              Search anywhere...
            </span>
            <div className="flex items-center gap-1">
              <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-surface px-1.5 font-mono text-[10px] font-medium text-content-secondary shadow-sm">
                <Command className="w-3 h-3" />
                <span>K</span>
              </kbd>
            </div>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Store Context Switcher */}
        <div className="hidden lg:flex items-center gap-3 cursor-pointer px-3 py-1.5 hover:bg-surface-hover rounded-xl transition-all group">
          <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center border border-border shadow-sm group-hover:border-brand-200 transition-colors">
            <Store className="w-4 h-4 text-content-secondary group-hover:text-brand-600 transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-content-muted leading-tight uppercase tracking-wider">Acme Fashion</span>
            <span className="text-[13px] font-bold text-content-primary leading-tight">Pakistan • PKR</span>
          </div>
          <ChevronDown className="w-4 h-4 text-content-muted group-hover:text-content-secondary ml-1" />
        </div>

        <div className="h-6 w-px bg-border hidden lg:block" />

        {/* Notifications */}
        <button className="relative p-2 text-content-secondary hover:text-content-primary hover:bg-surface-hover rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full border-2 border-surface"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-2 cursor-pointer group ml-1">
          <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center font-bold text-content-secondary text-[11px] shadow-sm ring-2 ring-transparent group-hover:ring-brand-100 transition-all border border-border">
            AR
          </div>
        </div>
      </div>
    </header>
  );
};
