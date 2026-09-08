'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function CampaignsDashboardPage() {
  const [campaigns] = useState([
    {
      id: 'cmp_101',
      name: 'Summer Mega Sale 2026',
      channel: 'WHATSAPP',
      status: 'COMPLETED',
      totalRecipients: 1250,
      sentCount: 1240,
      deliveredCount: 1210,
      readCount: 980,
      failedCount: 10,
      createdAt: '2026-09-01',
    },
    {
      id: 'cmp_102',
      name: 'VIP Customer Retention Promo',
      channel: 'EMAIL',
      status: 'SCHEDULED',
      totalRecipients: 450,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      failedCount: 0,
      createdAt: '2026-09-04',
    },
  ]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Marketing & Broadcast Campaigns" 
          subtitle="Manage promotional broadcasts, audience segmentation, scheduled delivery, and metrics."
          actions={[
            { label: 'Create Campaign', variant: 'primary' }
          ]}
        />

        <Card className="!p-0 overflow-hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Campaign Name</Th>
                <Th>Channel</Th>
                <Th>Status</Th>
                <Th>Recipients</Th>
                <Th>Delivered / Read</Th>
                <Th>Failed</Th>
                <Th>Created At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {campaigns.map((c) => (
                <Tr key={c.id}>
                  <Td className="font-semibold text-slate-900">{c.name}</Td>
                  <Td>
                    <Badge variant="info">
                      {c.channel}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge variant={c.status === 'COMPLETED' ? 'success' : 'warning'}>
                      {c.status}
                    </Badge>
                  </Td>
                  <Td className="text-slate-700">{c.totalRecipients}</Td>
                  <Td className="text-slate-700">{c.deliveredCount} / {c.readCount}</Td>
                  <Td className={c.failedCount > 0 ? 'text-rose-600 font-semibold' : 'text-slate-700'}>{c.failedCount}</Td>
                  <Td className="text-slate-500 text-xs">{c.createdAt}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
