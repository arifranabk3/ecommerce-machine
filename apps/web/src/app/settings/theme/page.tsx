'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Palette, CheckCircle2, Search, Filter } from 'lucide-react';

// Mocked from the Theme Registry (in production this would be fetched from API)
const THEME_CATEGORIES = [
  'Multipurpose', 'Fashion', 'Clothing', 'Jewelry', 'Luxury', 'Watches',
  'Beauty', 'Cosmetics', 'Perfume', 'Furniture', 'Interior', 'Home Decor',
  'Electronics', 'Technology', 'Gaming', 'Grocery', 'Food', 'Organic',
  'Sports', 'Shoes', 'Automotive', 'Kids', 'Baby', 'Books', 'Handmade',
  'Creative', 'Single Product'
];

const THEMES = [
  { id: 'moduva', name: 'Moduva', categories: ['Fashion', 'Clothing', 'Minimal'], version: '1.0.0', status: 'active' },
  { id: 'lusion', name: 'Lusion', categories: ['Multipurpose', 'Electronics', 'Technology'], version: '1.2.0', status: 'active' },
  { id: 'mate', name: 'Mate', categories: ['Furniture', 'Interior', 'Home Decor'], version: '2.1.0', status: 'active' },
  { id: 'weare', name: 'WeAre', categories: ['Fashion', 'Jewelry', 'Luxury'], version: '1.0.5', status: 'active' },
];

export default function ThemeSelectionPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('moduva'); // Default active theme
  const [isSaving, setIsSaving] = useState(false);

  // Filter themes dynamically based on selected category
  const filteredThemes = useMemo(() => {
    if (!selectedCategory) return THEMES;
    return THEMES.filter(t => t.categories.includes(selectedCategory));
  }, [selectedCategory]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call to save theme selection
    setTimeout(() => {
      setIsSaving(false);
      alert('Theme updated successfully. Your storefront is now using: ' + selectedThemeId);
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Storefront Theme</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage the visual presentation of your online store.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Activating...' : 'Activate Theme'}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex">
          
          {/* Left Panel: Category Selection */}
          <div className="w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-900 text-sm">1. Theme Category</h2>
              <p className="text-xs text-slate-500 mt-1">Select your industry or niche</p>
            </div>
            
            <div className="p-2 border-b border-slate-200">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter categories..." 
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[600px] p-2 space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-2 rounded text-sm font-semibold transition-colors ${selectedCategory === '' ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                All Categories
              </button>
              {THEME_CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded text-sm font-semibold transition-colors ${selectedCategory === category ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel: Theme Selection */}
          <div className="w-2/3 bg-white flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">2. Select Theme</h2>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedCategory ? `Showing themes for "${selectedCategory}"` : 'Showing all themes'}
                </p>
              </div>
              <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                {filteredThemes.length} available
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-6 overflow-y-auto max-h-[600px]">
              {filteredThemes.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-slate-500">
                  <Palette className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="font-semibold text-sm">No themes available in this category.</p>
                </div>
              ) : (
                filteredThemes.map(theme => (
                  <div 
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`relative rounded-xl border-2 cursor-pointer overflow-hidden transition-all duration-200 ${
                      selectedThemeId === theme.id 
                        ? 'border-brand-500 shadow-md ring-4 ring-brand-50' 
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    {selectedThemeId === theme.id && (
                      <div className="absolute top-3 right-3 z-10 bg-white rounded-full">
                        <CheckCircle2 className="w-6 h-6 text-brand-500" />
                      </div>
                    )}
                    
                    {/* Placeholder Preview Image */}
                    <div className="aspect-[4/3] bg-slate-100 border-b border-slate-200 flex items-center justify-center p-6 relative overflow-hidden group">
                      <div className={`absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${selectedThemeId === theme.id ? 'hidden' : ''}`}>
                        <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">Select Theme</span>
                      </div>
                      <div className="text-center">
                        <Palette className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                        <span className="text-xl font-black text-slate-300 uppercase tracking-widest">{theme.id}</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900">{theme.name}</h3>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">v{theme.version}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {theme.categories.slice(0, 2).map(cat => (
                          <span key={cat} className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                            {cat}
                          </span>
                        ))}
                        {theme.categories.length > 2 && (
                          <span className="text-[10px] font-semibold text-slate-400">+{theme.categories.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
