'use client';
import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';

export default function EditWorkflowPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/automation" className="text-brand-600 hover:text-brand-700 text-sm font-semibold">← Back to Automations</Link>
          <PageHeader title={`Workflow Detail #${params.id}`} />
        </div>
        <Card>
          <div className="space-y-4 text-sm text-slate-700">
            <p><strong className="text-slate-900">Workflow ID:</strong> {params.id}</p>
            <p><strong className="text-slate-900">Status:</strong> <span className="text-emerald-600 font-semibold">ACTIVE</span></p>
            <p><strong className="text-slate-900">Mode:</strong> AUTO</p>
            <p><strong className="text-slate-900">Version:</strong> 1</p>
            <div className="pt-4">
              <Link href={`/automation/${params.id}/runs`} className="text-brand-600 hover:text-brand-700 font-semibold">View Execution History →</Link>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
