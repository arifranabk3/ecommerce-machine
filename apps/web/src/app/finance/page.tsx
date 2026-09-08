'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function FinanceDashboardPage() {
  const [summary, setSummary] = useState<any>({
    grossRevenueMinor: 12500000,
    refundsMinor: 450000,
    paymentFeesMinor: 312500,
    netCollectionsMinor: 11737500,
    codPendingMinor: 1850000,
    currency: 'PKR',
    totalTransactions: 142
  });

  const formatMoney = (amountMinor: number) => {
    return `PKR ${(amountMinor / 100).toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader 
          title="Finance & Cash Flow" 
          subtitle="Real-time cash flow, gross revenue, provider fee deductions, and net collections."
          actions={[
            { label: 'Export Statement', variant: 'primary' }
          ]}
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
            <div className="text-2xl font-bold text-slate-900">{formatMoney(summary.grossRevenueMinor)}</div>
            <p className="text-xs text-emerald-600 font-medium">↑ 12.4% vs last period</p>
          </Card>

          <Card className="p-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer Refunds</span>
            <div className="text-2xl font-bold text-rose-600">-{formatMoney(summary.refundsMinor)}</div>
            <p className="text-xs text-slate-400">3.6% of gross sales</p>
          </Card>

          <Card className="p-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Provider Fees</span>
            <div className="text-2xl font-bold text-amber-600">-{formatMoney(summary.paymentFeesMinor)}</div>
            <p className="text-xs text-slate-400">Average 2.5% rate</p>
          </Card>

          <Card className="p-6 border-l-4 border-l-brand-300">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Collections</span>
            <div className="text-2xl font-bold text-slate-900">{formatMoney(summary.netCollectionsMinor)}</div>
            <p className="text-xs text-slate-500 font-medium">Available for settlement</p>
          </Card>
        </div>

        {/* Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 !p-0 overflow-hidden space-y-0">
            <div className="p-6 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Recent Financial Transactions</h2>
            </div>
            <Table>
              <Thead>
                <Tr>
                  <Th>Tx Number</Th>
                  <Th>Type</Th>
                  <Th>Amount</Th>
                  <Th>Direction</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td className="font-mono font-medium text-slate-900">FIN-2026-000104</Td>
                  <Td><Badge variant="success">PAYMENT</Badge></Td>
                  <Td className="font-semibold text-slate-900">PKR 10,000.00</Td>
                  <Td className="text-xs font-bold text-emerald-600">CREDIT</Td>
                  <Td className="text-xs text-slate-500 font-medium">POSTED</Td>
                </Tr>
                <Tr>
                  <Td className="font-mono font-medium text-slate-900">FIN-2026-000103</Td>
                  <Td><Badge variant="error">REFUND</Badge></Td>
                  <Td className="font-semibold text-rose-600">PKR 3,000.00</Td>
                  <Td className="text-xs font-bold text-rose-600">DEBIT</Td>
                  <Td className="text-xs text-slate-500 font-medium">POSTED</Td>
                </Tr>
                <Tr>
                  <Td className="font-mono font-medium text-slate-900">FIN-2026-000102</Td>
                  <Td><Badge variant="warning">FEE</Badge></Td>
                  <Td className="font-semibold text-amber-600">PKR 250.00</Td>
                  <Td className="text-xs font-bold text-rose-600">DEBIT</Td>
                  <Td className="text-xs text-slate-500 font-medium">POSTED</Td>
                </Tr>
              </Tbody>
            </Table>
          </Card>

          <Card className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900">COD Cash Pending</h2>
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg space-y-2">
              <span className="text-xs font-medium text-amber-700">Uncollected Delivery Cash</span>
              <div className="text-xl font-bold text-amber-900">{formatMoney(summary.codPendingMinor)}</div>
              <p className="text-xs text-amber-700/80">Pending physical courier cash handover</p>
            </div>
            <Button variant="secondary" className="w-full">
              Manage COD Collections →
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
