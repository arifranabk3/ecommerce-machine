'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Monitor,
  Smartphone,
  ChevronDown,
  Store,
  Search,
  Filter,
  Palette,
  Eye,
  Settings,
  Copy,
  ArrowRightLeft,
  CheckCircle2,
  Lock,
  Star,
  Check,
  X,
  LayoutTemplate,
  MonitorPlay,
  Grid,
  AlertCircle
} from 'lucide-react';

export default function ThemesDashboardPage() {
  const [view, setView] = useState<'library' | 'detail'>('library');
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');

  const activeTheme = {
    id: 't-1',
    name: 'Dawn Minimal',
    version: '2.4.1',
    category: 'Fashion',
    activeStore: 'Main Store',
    lastUpdated: '2 days ago',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'
  };

  const themes = [
    { id: 't-1', name: 'Dawn Minimal', version: '2.4.1', category: 'Fashion', industry: ['Apparel', 'Lifestyle'], rating: 4.8, plan: 'Starter', locked: false, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80' },
    { id: 't-2', name: 'Luxe Beauty', version: '1.2.0', category: 'Beauty', industry: ['Cosmetics', 'Skincare'], rating: 4.9, plan: 'Growth', locked: false, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80' },
    { id: 't-3', name: 'TechStore Pro', version: '3.1.5', category: 'Electronics', industry: ['Gadgets', 'Computers'], rating: 4.7, plan: 'Professional', locked: true, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80' },
    { id: 't-4', name: 'Home Living', version: '1.0.2', category: 'Furniture', industry: ['Home Decor', 'Interiors'], rating: 4.5, plan: 'Growth', locked: false, image: 'https://images.unsplash.com/photo-1618220179428-22790b46a013?w=800&q=80' },
    { id: 't-5', name: 'Fresh Grocery', version: '2.0.1', category: 'Food', industry: ['Supermarket', 'Organic'], rating: 4.6, plan: 'Starter', locked: false, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80' },
    { id: 't-6', name: 'Active Wear', version: '1.5.0', category: 'Sports', industry: ['Fitness', 'Apparel'], rating: 4.8, plan: 'Professional', locked: true, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80' },
  ];

  const handleOpenDetail = (theme: any) => {
    setSelectedTheme(theme);
    setView('detail');
    window.scrollTo(0, 0);
  };

  const handleOpenUseTheme = (theme: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (theme.locked) return;
    setSelectedTheme(theme);
    setIsUseModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Themes</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Choose, customize, and manage the storefront experience.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hidden sm:flex">
              <Store className="w-4 h-4 mr-2 text-slate-500" />
              Main Store
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search 100+ themes..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-64"
              />
            </div>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
              <Filter className="w-4 h-4 mr-2" />
              Category
            </Button>
            <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm">
              <Palette className="w-4 h-4 mr-2" />
              Customize Active
            </Button>
          </div>
        </div>

        {view === 'library' && (
          <>
            {/* ACTIVE THEME */}
            <div className="mb-10">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4 px-1">Active Theme</h2>
              <Card className="shadow-md border-slate-200/60 overflow-hidden bg-gradient-to-r from-brand-50/50 to-white">
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="md:w-1/2 lg:w-3/5 h-64 md:h-auto relative overflow-hidden bg-slate-100 border-b md:border-b-0 md:border-r border-slate-200 group">
                    <img 
                      src={activeTheme.image} 
                      alt="Active Theme" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="success" className="bg-emerald-500 text-white border-none shadow-sm flex items-center gap-1 font-bold px-3 py-1">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-extrabold text-slate-900">{activeTheme.name}</h3>
                      <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 font-bold">v{activeTheme.version}</Badge>
                    </div>
                    <p className="text-slate-500 font-medium mb-6">Currently active on <strong className="text-slate-700">Main Store</strong>. Last updated {activeTheme.lastUpdated}.</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm w-full py-6">
                        <Palette className="w-5 h-5 mr-2" />
                        Customize
                      </Button>
                      <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 w-full py-6 font-bold">
                        <Eye className="w-5 h-5 mr-2 text-slate-400" />
                        Preview Store
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 font-bold px-2"><Settings className="w-4 h-4 mr-2" /> Settings</Button>
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 font-bold px-2"><Copy className="w-4 h-4 mr-2" /> Duplicate</Button>
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 font-bold px-2"><ArrowRightLeft className="w-4 h-4 mr-2" /> Switch</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* THEME LIBRARY */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-extrabold text-slate-900">Theme Library <span className="text-slate-400 font-medium text-sm ml-2">100+ themes</span></h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-white text-slate-600">Popular</Button>
                  <Button variant="outline" size="sm" className="bg-white text-slate-600">New</Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {themes.map((theme) => (
                  <Card key={theme.id} className="shadow-sm border-slate-200 overflow-hidden group hover:shadow-lg transition-all duration-300 hover:border-brand-200 cursor-pointer" onClick={() => handleOpenDetail(theme)}>
                    <CardContent className="p-0">
                      <div className="relative h-[240px] bg-slate-100 overflow-hidden">
                        <img 
                          src={theme.image} 
                          alt={theme.name} 
                          className={`w-full h-full object-cover transition-transform duration-700 ${theme.locked ? 'grayscale' : 'group-hover:scale-105'}`}
                        />
                        {theme.id === 't-1' && (
                          <div className="absolute top-3 left-3">
                            <Badge variant="success" className="bg-emerald-500 text-white border-none shadow-sm text-[10px] font-bold px-2 py-0.5">Active</Badge>
                          </div>
                        )}
                        {theme.locked && (
                          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3 backdrop-blur-md">
                              <Lock className="w-5 h-5 text-white" />
                            </div>
                            <p className="font-bold text-sm mb-1 text-center">Requires {theme.plan} Plan</p>
                            <Button variant="primary" size="sm" className="bg-white text-slate-900 hover:bg-slate-100 mt-2 text-xs font-bold" onClick={(e) => { e.stopPropagation(); }}>
                              Upgrade Plan
                            </Button>
                          </div>
                        )}
                        {!theme.locked && (
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white font-bold" onClick={(e) => handleOpenUseTheme(theme, e)}>
                              Use Theme
                            </Button>
                            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold backdrop-blur-sm">
                              Preview
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-extrabold text-slate-900 text-lg">{theme.name}</h4>
                          <span className="flex items-center text-xs font-bold text-slate-500"><Star className="w-3 h-3 text-amber-400 mr-1 fill-amber-400" /> {theme.rating}</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mb-4">{theme.category}</p>
                        
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                          <div className="flex gap-2">
                            {theme.industry.map(tag => (
                              <Badge key={tag} variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[10px]">{tag}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Monitor className="w-3.5 h-3.5" />
                            <Smartphone className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'detail' && selectedTheme && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" className="bg-white" onClick={() => setView('library')}>
                ← Back to Library
              </Button>
              <div className="h-4 w-px bg-slate-300"></div>
              <span className="text-slate-500 font-medium">Theme Preview: <strong className="text-slate-900">{selectedTheme.name}</strong></span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Preview Area */}
              <Card className="lg:col-span-2 shadow-sm border-slate-200 overflow-hidden bg-slate-100 flex flex-col">
                <div className="bg-white border-b border-slate-200 p-3 flex justify-center gap-2 z-10 relative shadow-sm">
                  <Button 
                    variant={devicePreview === 'desktop' ? 'primary' : 'ghost'} 
                    size="sm" 
                    className={devicePreview === 'desktop' ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'text-slate-500'}
                    onClick={() => setDevicePreview('desktop')}
                  >
                    <Monitor className="w-4 h-4 mr-2" /> Desktop
                  </Button>
                  <Button 
                    variant={devicePreview === 'mobile' ? 'primary' : 'ghost'} 
                    size="sm" 
                    className={devicePreview === 'mobile' ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'text-slate-500'}
                    onClick={() => setDevicePreview('mobile')}
                  >
                    <Smartphone className="w-4 h-4 mr-2" /> Mobile
                  </Button>
                </div>
                <div className="flex-1 p-6 flex items-start justify-center overflow-auto">
                  <div className={`transition-all duration-500 bg-white shadow-xl rounded-b-lg overflow-hidden border-t-4 border-slate-300 ${devicePreview === 'desktop' ? 'w-full max-w-4xl' : 'w-[375px] rounded-t-3xl border-4 border-slate-800 h-[812px]'}`}>
                    <img src={selectedTheme.image} alt="Preview" className="w-full h-auto" />
                    {/* Placeholder content below fold to simulate scrolling */}
                    <div className="h-[800px] w-full bg-slate-50 p-8">
                      <div className="w-1/2 h-10 bg-slate-200 rounded mb-8"></div>
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="h-64 bg-slate-200 rounded"></div>
                        <div className="h-64 bg-slate-200 rounded"></div>
                        <div className="h-64 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Theme Info Panel */}
              <div className="space-y-6">
                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl font-extrabold text-slate-900">{selectedTheme.name}</h2>
                      <Badge variant="outline" className="bg-white text-slate-600 font-bold">v{selectedTheme.version}</Badge>
                    </div>
                    <p className="text-slate-500 font-medium mb-6">A premium, highly converting theme designed specifically for the {selectedTheme.category} industry. Includes 25+ customizable sections.</p>
                    
                    {selectedTheme.locked ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center mb-6">
                        <Lock className="w-6 h-6 text-slate-400 mb-2" />
                        <p className="font-bold text-slate-900 text-sm">Theme Locked</p>
                        <p className="text-xs text-slate-500 mt-1 mb-4">Requires the {selectedTheme.plan} plan to use this theme.</p>
                        <Button variant="primary" className="bg-slate-900 text-white w-full">Upgrade Plan</Button>
                      </div>
                    ) : selectedTheme.id === 't-1' ? (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 mb-6">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-bold text-emerald-900 text-sm">Currently Active</p>
                          <p className="text-xs text-emerald-700">This theme is live on your Main Store.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 mb-6">
                        <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-6 text-base shadow-sm" onClick={() => handleOpenUseTheme(selectedTheme)}>
                          Use Theme
                        </Button>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Features</h4>
                      <ul className="space-y-3">
                        {['Fully Responsive Design', 'Mega Menu Support', 'Product Quick View', 'Advanced Filtering', 'Sticky Add to Cart'].map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                            <Check className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" /> {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* USE THEME MODAL FLOW */}
      {isUseModalOpen && selectedTheme && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsUseModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-extrabold text-slate-900">Switch Theme</h2>
              <button onClick={() => setIsUseModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden relative">
                    <img src={activeTheme.image} alt="Current" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current</p>
                    <p className="text-sm font-bold text-slate-900">{activeTheme.name}</p>
                  </div>
                </div>
                <ArrowRightLeft className="w-5 h-5 text-slate-300" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden relative border-2 border-brand-500">
                    <img src={selectedTheme.image} alt="New" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">New Theme</p>
                    <p className="text-sm font-bold text-slate-900">{selectedTheme.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 text-sm">Theme Change Notice</p>
                  <p className="text-xs text-amber-800 mt-1 font-medium leading-relaxed">
                    Switching themes changes storefront presentation only. Your products, orders, customers, inventory, pricing, payments, shipping, and marketing data remain completely unchanged.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-bold text-slate-700">Apply to store:</p>
                <div className="border border-brand-500 bg-brand-50 rounded-lg p-3 flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-brand-600" />
                    <span className="font-bold text-brand-900 text-sm">Main Store</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <Button variant="outline" className="text-slate-600 font-bold bg-white" onClick={() => setIsUseModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-sm" onClick={() => setIsUseModalOpen(false)}>
                Apply Theme Now
              </Button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
