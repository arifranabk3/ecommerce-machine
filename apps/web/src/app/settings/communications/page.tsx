'use client';
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CommunicationSettingsPage() {
  const [config, setConfig] = useState({
    whatsappPhoneNumberId: '10928374918237',
    whatsappWabaId: '29837482910382',
    emailFromAddress: 'notifications@sellzy.store',
    emailFromName: 'Sellzy Store',
    smsSenderId: 'SELLZY',
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader title="Communication & Provider Configuration" subtitle="Configure WhatsApp Business Cloud API, Email gateway, SMS provider, and webhook parameters." />
        <Card title="WhatsApp Business Cloud API">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number ID</label>
              <input type="text" value={config.whatsappPhoneNumberId} onChange={(e) => setConfig({ ...config, whatsappPhoneNumberId: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WABA (WhatsApp Business Account) ID</label>
              <input type="text" value={config.whatsappWabaId} onChange={(e) => setConfig({ ...config, whatsappWabaId: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300" />
            </div>
          </div>
        </Card>
        <Card title="Email & SMS Gateways">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Email Address</label>
              <input type="email" value={config.emailFromAddress} onChange={(e) => setConfig({ ...config, emailFromAddress: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SMS Masking / Sender ID</label>
              <input type="text" value={config.smsSenderId} onChange={(e) => setConfig({ ...config, smsSenderId: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300" />
            </div>
            <div className="pt-2">
              <Button variant="primary">Save Configuration</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
