'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';

export default function AnalyticsDashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Sellzy Analytics & Reporting Engine" 
          subtitle="Multi-tenant accurate business intelligence derived from authoritative domain models."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border border-slate-200">
            <div className="text-sm text-slate-500">Net Sales</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">$124,500.00</div>
          </Card>
          <Card className="p-4 bg-white border border-slate-200">
            <div className="text-sm text-slate-500">Total Orders</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">1,420</div>
          </Card>
          <Card className="p-4 bg-white border border-slate-200">
            <div className="text-sm text-slate-500">Contribution Profit</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">$38,200.00</div>
          </Card>
          <Card className="p-4 bg-white border border-slate-200">
            <div className="text-sm text-slate-500">Delivery Success Rate</div>
            <div className="text-2xl font-bold text-brand-500 mt-1">94.2%</div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
