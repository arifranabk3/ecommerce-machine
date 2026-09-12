'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';

export default function AiCopilotDashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="AI Copilot Advisory Hub" 
          subtitle="AI-assisted business briefs, customer sentiment classification, and recommendation insights."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 bg-white border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Daily Business Brief</h2>
            <p className="text-sm text-slate-600 mb-4">Automated daily summary of orders, revenue, inventory risks, and pending vendor approvals.</p>
            <Link href="/ai/brief" className="text-brand-500 font-semibold hover:underline">View Today&apos;s Brief →</Link>
          </Card>

          <Card className="p-5 bg-white border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Tool Boundary Defense</h2>
            <p className="text-sm text-slate-600 mb-4">AI tools are strictly bounded. Financial dispatches & permissions require explicit human authorization.</p>
            <span className="inline-block bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold">4 Safe Registered Tools</span>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
