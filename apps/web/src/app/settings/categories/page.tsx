'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tag, Plus, Folder, ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  const categories = [
    {
      id: 'cat_1',
      name: 'Electronics',
      slug: 'electronics',
      depth: 0,
      productCount: 24,
      children: [
        { id: 'cat_2', name: 'Audio & Headsets', slug: 'audio-headsets', depth: 1, productCount: 12 },
        { id: 'cat_3', name: 'Peripherals', slug: 'peripherals', depth: 1, productCount: 8 }
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-900 tracking-tight">Category Hierarchy</h1>
            <p className="text-sm text-slate-500 mt-1">Organize products into hierarchical categories & subcategories</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </div>

        <Card className="p-6 space-y-4">
          {categories.map((c) => (
            <div key={c.id} className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3 font-medium text-brand-900">
                  <Folder className="w-5 h-5 text-brand-600" />
                  <span>{c.name}</span>
                  <span className="text-xs text-slate-400 font-mono">/{c.slug}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="neutral">{c.productCount} products</Badge>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>

              {c.children && (
                <div className="pl-6 space-y-2 border-l-2 border-slate-200 ml-3">
                  {c.children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <span>{child.name}</span>
                        <span className="text-xs text-slate-400 font-mono">/{child.slug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral">{child.productCount} products</Badge>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Card>
      </div>
    </DashboardLayout>
  );
}
