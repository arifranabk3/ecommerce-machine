'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function MessageTemplatesPage() {
  const [templates] = useState([
    {
      id: 'tmpl_101',
      name: 'order_shipped_v1',
      category: 'UTILITY',
      channel: 'WHATSAPP',
      language: 'en',
      status: 'APPROVED',
      content: 'Hi {{1}}, your order {{2}} has shipped! Track here: {{3}}',
    },
    {
      id: 'tmpl_102',
      name: 'abandoned_cart_discount',
      category: 'MARKETING',
      channel: 'WHATSAPP',
      language: 'en',
      status: 'APPROVED',
      content: 'Hi {{1}}, you left items in your cart. Use code {{2}} for 10% off!',
    },
  ]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Message & Notification Templates" 
          subtitle="Pre-approved message templates for WhatsApp Cloud API, Email, and SMS notifications."
          actions={[
            { label: 'New Template', variant: 'primary' }
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <Card key={t.id} className="p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-900">{t.name}</span>
                  <Badge variant="success">
                    {t.status}
                  </Badge>
                </div>
                <div className="text-xs text-slate-500 mb-4">
                  Channel: <strong className="text-slate-700">{t.channel}</strong> | Category: <strong className="text-slate-700">{t.category}</strong> | Lang: <strong className="text-slate-700">{t.language}</strong>
                </div>
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 text-sm text-slate-700 font-mono">
                  {t.content}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
