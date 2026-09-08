import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-900 tracking-tight">Product Details</h1>
            <p className="text-sm text-slate-500 mt-1">ID: {params.id}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Edit Product</Button>
            <Button variant="primary" size="sm">Save Changes</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card title="General Information">
              <div className="space-y-4">
                 <div className="h-8 bg-slate-100 rounded animate-pulse w-3/4"></div>
                 <div className="h-4 bg-slate-100 rounded animate-pulse w-full"></div>
                 <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6"></div>
              </div>
            </Card>
             <Card title="Pricing & Inventory">
               <div className="grid grid-cols-2 gap-4">
                 <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
                 <div className="h-10 bg-slate-100 rounded animate-pulse"></div>
               </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card title="Status">
              <Badge variant="success" className="mb-4">Active</Badge>
              <div className="space-y-2">
                 <p className="text-sm font-medium text-slate-600">Visibility</p>
                 <div className="h-6 bg-slate-100 rounded animate-pulse w-1/2"></div>
              </div>
            </Card>
             <Card title="Organization">
              <div className="space-y-2">
                 <p className="text-sm font-medium text-slate-600">Category</p>
                 <div className="h-6 bg-slate-100 rounded animate-pulse w-full"></div>
                 <p className="text-sm font-medium text-slate-600 mt-4">Vendor</p>
                 <div className="h-6 bg-slate-100 rounded animate-pulse w-full"></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
