'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function ReturnsDashboardPage() {
  const [returns] = useState([
    {
      id: 'ret_1',
      returnNumber: 'RET-2026-000001',
      orderNumber: 'ORD-2026-000088',
      customerName: 'Zainab Bibi',
      reason: 'DEFECTIVE_ITEM',
      status: 'APPROVED_FOR_REFUND',
      requestedAt: '2026-09-03'
    }
  ]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Customer Returns Management" 
          subtitle="Review return requests, perform item inspection, and process restocking."
        />

        <Card className="!p-0 overflow-hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Return #</Th>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Reason</Th>
                <Th>Requested Date</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {returns.map(ret => (
                <Tr key={ret.id}>
                  <Td className="font-semibold text-brand-500">{ret.returnNumber}</Td>
                  <Td>{ret.orderNumber}</Td>
                  <Td>{ret.customerName}</Td>
                  <Td>{ret.reason}</Td>
                  <Td>{ret.requestedAt}</Td>
                  <Td>
                    <Badge variant="warning">{ret.status}</Badge>
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
