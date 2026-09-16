'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { useApiQuery } from '@/lib/api-client';

export default function ProcurementPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const { data: poData, isLoading } = useApiQuery<any>('/api/v1/procurement/purchase-orders');
  const purchaseOrders = poData?.data || [];

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
              {isLoading ? (
                <Tr>
                  <Td colSpan={7} className="text-center py-10 text-slate-500 font-medium">Loading purchase orders...</Td>
                </Tr>
              ) : purchaseOrders.length === 0 ? (
                <Tr>
                  <Td colSpan={7} className="text-center py-10 text-slate-500 font-medium">No purchase orders found.</Td>
                </Tr>
              ) : (
                purchaseOrders.map((po: any) => (
                  <Tr key={po._id}>
                    <Td className="font-mono font-medium text-slate-900">{po.poNumber}</Td>
                    <Td className="text-slate-900 font-medium">{po.vendor?.name || 'Unknown Vendor'}</Td>
                    <Td className="text-xs font-semibold text-slate-500 uppercase">{po.source || 'MANUAL'}</Td>
                    <Td className="text-slate-600">{po.items?.length || 0} Items</Td>
                    <Td className="font-semibold text-slate-900">
                      PKR {po.totalAmount ? (po.totalAmount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                    </Td>
                    <Td>
                      <Badge variant={
                        po.status === 'COMPLETED' ? 'success' : 
                        po.status === 'SUBMITTED' ? 'info' : 
                        po.status === 'DRAFT' ? 'default' : 'warning'
                      }>
                        {po.status}
                      </Badge>
                    </Td>
                    <Td className="text-right">
                      <Link href={`/procurement/${po._id}`} className="text-brand-500 hover:underline font-medium">
                        View Order
                      </Link>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
