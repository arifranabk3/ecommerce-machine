'use client';
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function RTOPolicySettingsPage() {
  const [policy, setPolicy] = useState({
    maxDeliveryAttempts: 3,
    autoInitiateRTO: true,
    rtoRestockInspectionRequired: true
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader title="RTO Policy Settings" subtitle="Configure rules for delivery re-attempts, RTO triggers, and warehouse receiving inspection." />
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Delivery Attempts</label>
              <input type="number" value={policy.maxDeliveryAttempts} onChange={e => setPolicy({ ...policy, maxDeliveryAttempts: parseInt(e.target.value, 10) })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={policy.autoInitiateRTO} onChange={e => setPolicy({ ...policy, autoInitiateRTO: e.target.checked })} />
              <span className="text-sm text-slate-700">Automatically initiate RTO after max failed attempts</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={policy.rtoRestockInspectionRequired} onChange={e => setPolicy({ ...policy, rtoRestockInspectionRequired: e.target.checked })} />
              <span className="text-sm text-slate-700">Require physical inspection before restocking RTO items</span>
            </div>
            <div className="pt-2">
              <Button variant="primary">Save RTO Policy</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
