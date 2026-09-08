'use client';
import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';

export default function DailyBusinessBriefPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/ai" className="text-brand-600 hover:text-brand-700 text-sm font-semibold">← Back to AI Copilot</Link>
          <PageHeader title="Daily Business Brief — 2026-09-06" />
        </div>
        <div className="grid gap-4">
          <Card className="bg-slate-50 border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-3">📊 FACTS (Verified Data)</h2>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Total Orders Today: <strong className="text-slate-900">150</strong></li>
              <li>Gross Revenue: <strong className="text-slate-900">$45,000.00</strong></li>
              <li>Low Stock Items Identified: <strong className="text-slate-900">3 SKUs</strong></li>
              <li>Pending Vendor Settlement Approvals: <strong className="text-slate-900">2 Batches</strong></li>
              <li>Open Exception Items: <strong className="text-slate-900">1 Item</strong></li>
            </ul>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <h2 className="text-base font-bold text-blue-800 mb-3">💡 RECOMMENDATIONS</h2>
            <ul className="list-disc pl-5 text-sm text-blue-900 space-y-1">
              <li>Reorder 50 units of low-stock SKU-100 to prevent stockout in 48 hours.</li>
              <li>Review 2 pending vendor payment approval requests in Approvals queue.</li>
            </ul>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <h2 className="text-base font-bold text-orange-800 mb-3">⚠️ RISKS</h2>
            <ul className="list-disc pl-5 text-sm text-orange-900 space-y-1">
              <li>SKU-100 inventory will deplete in 48 hours based on recent 7-day sales velocity.</li>
            </ul>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <h2 className="text-base font-bold text-red-800 mb-3">⚡ ACTION REQUIRED</h2>
            <ul className="list-disc pl-5 text-sm text-red-900 space-y-1">
              <li>Authorize Vendor Payment Batch #SETT-902 ($12,450.00).</li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
