'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function PaymentsListPage() {
  const [payments] = useState<any[]>([
    {
      id: 'pay_001',
      paymentNumber: 'PAY-2026-000089',
      orderId: 'ord_1001',
      method: 'CARD',
      provider: 'MOCK',
      amountMinor: 100000,
      currency: 'PKR',
      status: 'CAPTURED',
      createdAt: '2026-09-06T08:30:00Z'
    },
    {
      id: 'pay_002',
      paymentNumber: 'PAY-2026-000090',
      orderId: 'ord_1002',
      method: 'COD',
      provider: 'MOCK',
      amountMinor: 45000,
      currency: 'PKR',
      status: 'PENDING',
      createdAt: '2026-09-06T09:00:00Z'
    }
  ]);

  const formatMoney = (amountMinor: number, currency: string) => {
    return `${currency} ${(amountMinor / 100).toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Customer Payments" 
          subtitle="View and filter all customer transactions, payment states, and payment methods."
        />

        <Card className="!p-0 overflow-hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Payment Number</Th>
                <Th>Order ID</Th>
                <Th>Method</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Created At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payments.map((p) => (
                <Tr key={p.id}>
                  <Td className="font-mono font-medium text-slate-900">{p.paymentNumber}</Td>
                  <Td className="text-slate-600 font-mono">{p.orderId}</Td>
                  <Td>
                    <Badge variant="neutral">{p.method}</Badge>
                  </Td>
                  <Td className="font-semibold text-slate-900">{formatMoney(p.amountMinor, p.currency)}</Td>
                  <Td>
                    <Badge variant={p.status === 'CAPTURED' ? 'success' : 'warning'}>
                      {p.status}
                    </Badge>
                  </Td>
                  <Td className="text-slate-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
