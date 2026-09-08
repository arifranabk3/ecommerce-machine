'use client';
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CouriersSettingsPage() {
  const [couriers] = useState([
    { id: 'cour_1', courierCode: 'TCS', name: 'TCS Logistics', type: 'API', status: 'ACTIVE', webhookUrl: 'https://api.sellzy.io/api/v1/shipping/webhooks/tcs' },
    { id: 'cour_2', courierCode: 'LEOPARDS', name: 'Leopards Courier', type: 'API', status: 'ACTIVE', webhookUrl: 'https://api.sellzy.io/api/v1/shipping/webhooks/leopards' }
  ]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Courier Integrations" subtitle="Configure active courier APIs, webhook endpoints, and dispatch rules.">
          <Button variant="primary">+ Add Courier</Button>
        </PageHeader>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Code</th>
                  <th className="px-6 py-3 font-semibold">Courier Name</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Webhook Endpoint</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {couriers.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{c.courierCode}</td>
                    <td className="px-6 py-4">{c.name}</td>
                    <td className="px-6 py-4">{c.type}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{c.webhookUrl}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
