'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function ProcurementPage() {
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Procurement & Purchase Orders" 
          subtitle="Manage purchase order lifecycles, stock replenishment, vendor acknowledgments, and receiving."
          actions={[
            { label: 'Create Purchase Order', variant: 'primary', href: '/procurement/new' }
          ]}
        />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Approval', val: '3 Orders', detail: '$14,250 Total Value' },
          { label: 'Submitted POs', val: '8 Orders', detail: 'Awaiting Vendor Confirmation' },
          { label: 'In-Transit Replenishment', val: '5 Orders', detail: 'Expected within 48h' },
          { label: 'Exceptions / Holds', val: '0 Issues', detail: 'Clean Procurement Flow' }
        ].map((card, i) => (
          <Card key={i} className="p-4">
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{card.val}</p>
            <p className="text-xs text-brand-500 font-medium mt-1">{card.detail}</p>
          </Card>
        ))}
      </div>

      {/* Table Container */}
      <Card className="!p-0 overflow-hidden">
        <Table>
          <Thead>
            <Tr>
              <Th>PO Number</Th>
              <Th>Vendor</Th>
              <Th>Source</Th>
              <Th>Items</Th>
              <Th>Total</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td className="font-mono font-medium text-slate-900">PO-2026-001001</Td>
              <Td className="text-slate-900 font-medium">Apex Electronics Supplies</Td>
              <Td className="text-xs font-semibold text-slate-500 uppercase">ORDER_SPLIT</Td>
              <Td className="text-slate-600">45 Units</Td>
              <Td className="font-semibold text-slate-900">$4,500.00</Td>
              <Td>
                <Badge variant="info">SUBMITTED</Badge>
              </Td>
              <Td className="text-right">
                <Link href="/procurement/po-1" className="text-brand-500 hover:underline font-medium">
                  View Order
                </Link>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Card>
      </div>
    </DashboardLayout>
  );
}
