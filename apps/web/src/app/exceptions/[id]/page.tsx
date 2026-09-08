'use client';
import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ExceptionDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/exceptions" className="text-brand-600 hover:text-brand-700 text-sm font-semibold">← Back to Exceptions</Link>
          <PageHeader title={`Exception Detail #${params.id}`} />
        </div>
        <Card>
          <div className="space-y-4 text-sm text-slate-700">
            <p><strong className="text-slate-900">Category:</strong> INVENTORY_STOCKOUT</p>
            <p><strong className="text-slate-900">Severity:</strong> <span className="text-red-600 font-semibold">HIGH</span></p>
            <p><strong className="text-slate-900">Title:</strong> Supplier Unavailable for SKU-100</p>
            <p><strong className="text-slate-900">Description:</strong> Automated reorder for SKU-100 failed because Primary Supplier is out of stock.</p>
            <p><strong className="text-slate-900">Recommended Action:</strong> Select fallback supplier from procurement settings or manually adjust reorder quantity.</p>
            <div className="pt-4 flex gap-3">
              <Button variant="primary">Resolve Exception</Button>
              <Button variant="secondary">Ignore</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
