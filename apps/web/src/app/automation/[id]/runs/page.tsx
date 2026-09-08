'use client';
import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';

export default function WorkflowRunsPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href={`/automation/${params.id}`} className="text-brand-600 hover:text-brand-700 text-sm font-semibold">← Back to Workflow</Link>
          <PageHeader title={`Workflow Execution Runs #${params.id}`} />
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Run ID</th>
                  <th className="px-6 py-3 font-semibold">Trigger Event</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Started At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500">run_98124</td>
                  <td className="px-6 py-4">evt_ord_901</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">COMPLETED</span></td>
                  <td className="px-6 py-4">2026-09-06 12:40:12</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
