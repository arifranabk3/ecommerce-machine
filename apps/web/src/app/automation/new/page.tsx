'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function NewWorkflowPage() {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('ORDER_CREATED');
  const [mode, setMode] = useState('AUTO');

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/automation" className="text-brand-600 hover:text-brand-700 text-sm font-semibold">← Back to Automations</Link>
          <PageHeader title="Create New Workflow" />
        </div>
        <Card>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Workflow Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Order Failed Payment Notification" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Event Trigger</label>
              <select value={trigger} onChange={(e) => setTrigger(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300 bg-white">
                <option value="ORDER_CREATED">ORDER_CREATED</option>
                <option value="ORDER_PAYMENT_FAILED">ORDER_PAYMENT_FAILED</option>
                <option value="INVENTORY_LOW">INVENTORY_LOW</option>
                <option value="CUSTOMER_RETURN_REQUESTED">CUSTOMER_RETURN_REQUESTED</option>
                <option value="VENDOR_SETTLEMENT_DUE">VENDOR_SETTLEMENT_DUE</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Execution Mode</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300 bg-white">
                <option value="AUTO">AUTO (Safe Reversible Execution)</option>
                <option value="APPROVAL">APPROVAL (Requires Human Authorization)</option>
                <option value="ESCALATION">ESCALATION (Stop & Create Inbox Exception)</option>
              </select>
            </div>
            <div className="pt-2">
              <Button type="submit" variant="primary">Save & Activate Workflow</Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
