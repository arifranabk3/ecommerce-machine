'use client';
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ReturnPolicySettingsPage() {
  const [policy, setPolicy] = useState({
    returnWindowDays: 14,
    allowOpenedReturns: true,
    requirePhotoEvidence: true,
    autoRestockSealed: true
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader title="Return Policy Settings" subtitle="Configure customer return windows, eligibility rules, and automated restocking policies." />
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Return Window (Days)</label>
              <input type="number" value={policy.returnWindowDays} onChange={e => setPolicy({ ...policy, returnWindowDays: parseInt(e.target.value, 10) })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={policy.allowOpenedReturns} onChange={e => setPolicy({ ...policy, allowOpenedReturns: e.target.checked })} />
              <span className="text-sm text-slate-700">Allow returns for opened items (subject to inspection)</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={policy.autoRestockSealed} onChange={e => setPolicy({ ...policy, autoRestockSealed: e.target.checked })} />
              <span className="text-sm text-slate-700">Automatically restock sealed returned items to sellable inventory</span>
            </div>
            <div className="pt-2">
              <Button variant="primary">Save Return Policy</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
