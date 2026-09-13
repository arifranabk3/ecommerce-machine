'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Palette, 
  Eye, 
  CheckCircle2, 
  Smartphone, 
  Monitor, 
  Settings2,
  Code,
  Upload,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';

export default function ThemesLibraryPage() {
  const [activeTab, setActiveTab] = useState('LIBRARY');

  const themes = [
    {
      id: 'theme_dawn',
      name: 'Dawn',
      category: 'Minimal',
      tags: ['Apparel', 'Beauty', 'Free'],
      status: 'ACTIVE',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
      author: 'Sellzy Official'
    },
    {
      id: 'theme_spotlight',
      name: 'Spotlight',
      category: 'Modern',
      tags: ['Electronics', 'Gadgets', 'Premium'],
      status: 'LIBRARY',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
      author: 'Sellzy Official'
    },
    {
      id: 'theme_crave',
      name: 'Crave',
      category: 'Vibrant',
      tags: ['Food', 'Beverage', 'Premium'],
      status: 'LIBRARY',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      author: 'Studio Web'
    },
    {
      id: 'theme_origin',
      name: 'Origin',
      category: 'Classic',
      tags: ['Furniture', 'Home', 'Free'],
      status: 'LIBRARY',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
      author: 'Sellzy Official'
    }
  ];

  const activeTheme = themes.find(t => t.status === 'ACTIVE');
  const libraryThemes = themes.filter(t => t.status !== 'ACTIVE');

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Themes</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage your storefront design, customize layouts, and discover new themes.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex bg-white">
              <Code className="w-4 h-4 mr-2 text-slate-400" /> Edit Code
            </Button>
            <Button variant="primary">
              <Upload className="w-4 h-4 mr-2" /> Upload Theme
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('LIBRARY')}
              className={`
                whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors
                ${activeTab === 'LIBRARY' 
                  ? 'border-brand-600 text-brand-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              Theme Library
            </button>
            <button
              onClick={() => setActiveTab('MARKETPLACE')}
              className={`
                whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors
                ${activeTab === 'MARKETPLACE' 
                  ? 'border-brand-600 text-brand-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              Explore Theme Store
            </button>
          </nav>
        </div>

        {activeTab === 'LIBRARY' && (
          <div className="space-y-12">
            
            {/* Active Theme Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-slate-900">Current Theme</h2>
              </div>
              
              {activeTheme && (
                <Card className="overflow-hidden border-emerald-100 shadow-md">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] items-stretch">
                    {/* Preview Image */}
                    <div className="relative aspect-video lg:aspect-auto bg-slate-100 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200 group">
                      <img src={activeTheme.image} alt={activeTheme.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Link href={`/themes/preview/${activeTheme.id}`}>
                          <Button variant="primary" className="shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-all">
                            <Eye className="w-4 h-4 mr-2" /> Live Preview
                          </Button>
                        </Link>
                      </div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge variant="success" className="shadow-sm">Live</Badge>
                      </div>
                    </div>
                    
                    {/* Theme Details */}
                    <div className="p-6 lg:p-8 flex flex-col justify-between bg-white">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-extrabold text-slate-900">{activeTheme.name}</h3>
                            <p className="text-sm font-semibold text-slate-500 mt-1">By {activeTheme.author}</p>
                          </div>
                          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                            <button className="p-1.5 bg-white text-brand-600 rounded shadow-sm"><Monitor className="w-4 h-4" /></button>
                            <button className="p-1.5 text-slate-400 hover:text-slate-900"><Smartphone className="w-4 h-4" /></button>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex flex-wrap gap-2">
                          {activeTheme.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <p className="text-sm text-slate-600 mt-6 leading-relaxed">
                          Dawn is a minimalist, modern theme designed to let your products take center stage. Perfect for apparel and beauty brands.
                        </p>
                      </div>
                      
                      <div className="mt-8 space-y-3">
                        <Link href="/themes/builder">
                          <Button variant="primary" className="w-full">
                            <Settings2 className="w-4 h-4 mr-2" /> Customize Store
                          </Button>
                        </Link>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="w-full bg-white text-slate-700">Actions</Button>
                          <Button variant="outline" className="w-full bg-white text-slate-700">Rename</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Theme Library Grid */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900">Theme Library ({libraryThemes.length})</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search themes..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {libraryThemes.map((theme) => (
                  <Card key={theme.id} className="overflow-hidden hover:shadow-premium-hover transition-all duration-300 group flex flex-col">
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-200">
                      <img src={theme.image} alt={theme.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-colors flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 gap-3">
                        <Link href={`/themes/preview/${theme.id}`}>
                          <Button variant="primary" className="w-32 shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                            Preview
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-32 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                          Publish
                        </Button>
                      </div>
                      {theme.tags.includes('Premium') && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="warning" className="shadow-sm">Premium</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900 text-lg">{theme.name}</h3>
                          <button className="text-slate-400 hover:text-slate-900"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 mt-1">By {theme.author}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Added Sep 2, 2026</span>
                        <button className="text-sm font-bold text-brand-600 hover:underline">Customize</button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Marketplace Tab Placeholder */}
        {activeTab === 'MARKETPLACE' && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-slate-100">
              <Palette className="w-10 h-10 text-brand-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sellzy Theme Store</h2>
            <p className="text-slate-500 max-w-md text-center font-medium mb-8">Discover beautiful, highly-converting themes built by world-class designers and developers.</p>
            <Button variant="primary" size="lg">Explore Themes</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
