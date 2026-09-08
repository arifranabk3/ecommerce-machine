'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function SettlementsPage() {
  const [filterStatus, setFilterStatus] = useState('');

  const settlements = [
    {
      id: 'set-1',
      settlementNumber: 'SET-2026-000014',
      vendorName: 'Apex Wholesalers Ltd',
      vendorNumber: 'VEN-001004',
      period: '2026-08-01 → 2026-08-31',
      grossPayable: 'PKR 1,500,000',
      adjustments: 'PKR -150,000',
      netPayable: 'PKR 1,350,000',
      status: 'APPROVED',
      date: '2026-09-01'
    },
    {
      id: 'set-2',
      settlementNumber: 'SET-2026-000013',
      vendorName: 'Zenith Logistics & Trading',
      vendorNumber: 'VEN-001002',
      period: '2026-08-15 → 2026-08-31',
      grossPayable: 'PKR 820,000',
      adjustments: 'PKR -20,000',
      netPayable: 'PKR 800,000',
      status: 'PAID',
      date: '2026-09-02'
    },
    {
      id: 'set-3',
      settlementNumber: 'SET-2026-000012',
      vendorName: 'Global Distro Corp',
      vendorNumber: 'VEN-001001',
      period: '2026-08-01 → 2026-08-15',
      grossPayable: 'PKR 450,000',
      adjustments: 'PKR 0',
      netPayable: 'PKR 450,000',
      status: 'PENDING_REVIEW',
      date: '2026-09-04'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Vendor Settlements" 
          subtitle="Automated settlement calculation, eligible entry locking, approval workflows, and reconciliation."
          actions={[
            { label: 'Payment Records', variant: 'outline', href: '/vendor-payments' },
            { label: 'Calculate Settlement', variant: 'primary' }
          ]}
        />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', val: 'PKR 450,000', count: '1 Batch' },
          { label: 'Pending Approval', val: 'PKR 0', count: '0 Batches' },
          { label: 'Approved Payouts', val: 'PKR 1,350,000', count: '1 Payout' },
          { label: 'Completed Settlements', val: 'PKR 800,000', count: '1 Payout' }
        ].map((card, i) => (
          <Card key={i} className="p-4">
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{card.val}</p>
            <p className="text-xs text-brand-500 font-medium mt-1">{card.count}</p>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="!p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <span className="text-sm font-semibold text-slate-900">Settlement Records</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        <Table>
          <Thead>
            <Tr>
              <Th>Settlement #</Th>
              <Th>Vendor</Th>
              <Th>Period</Th>
              <Th>Gross Payable</Th>
              <Th>Adjustments</Th>
              <Th>Net Payable</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {settlements.map((row) => (
              <Tr key={row.id}>
                <Td className="font-mono font-medium text-slate-900">{row.settlementNumber}</Td>
                <Td>
                  <div className="font-medium text-slate-900">{row.vendorName}</div>
                  <div className="text-xs text-slate-400">{row.vendorNumber}</div>
                </Td>
                <Td className="text-xs text-slate-500">{row.period}</Td>
                <Td className="text-slate-700">{row.grossPayable}</Td>
                <Td className="text-amber-700 font-medium">{row.adjustments}</Td>
                <Td className="font-bold text-slate-900">{row.netPayable}</Td>
                <Td>
                  <Badge 
                    variant={row.status === 'APPROVED' ? 'info' : row.status === 'PAID' ? 'success' : 'warning'}
                  >
                    {row.status}
                  </Badge>
                </Td>
                <Td className="text-right">
                  <Link
                    href={`/settlements/${row.id}`}
                    className="text-xs font-medium text-brand-500 hover:underline"
                  >
                    View Details →
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
      </div>
    </DashboardLayout>
  );
}
