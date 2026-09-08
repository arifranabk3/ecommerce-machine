'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function ApprovalsPage() {
  const [filter, setFilter] = useState('PENDING');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Human Approval Queue" 
          subtitle="Review and authorize high-risk financial operations and APPROVAL mode workflows."
        />

        <div className="flex gap-2 mb-4">
          {['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'secondary'}
              onClick={() => setFilter(status)}
              className="text-xs"
            >
              {status}
            </Button>
          ))}
        </div>

        <Card className="!p-0 overflow-hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Action Type</Th>
                <Th>Resource</Th>
                <Th>Requester</Th>
                <Th>Risk Level</Th>
                <Th>Reason</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td><code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono text-slate-700">VENDOR_PAYMENT</code></Td>
                <Td>Settlement #SETT-902</Td>
                <Td>workflow:wf_vendor_pay</Td>
                <Td><Badge variant="error">HIGH</Badge></Td>
                <Td>Vendor payout exceeds threshold $1,000</Td>
                <Td>
                  <div className="flex gap-2">
                    <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 text-xs py-1 px-2">Approve</Button>
                    <Button variant="danger" className="text-xs py-1 px-2">Reject</Button>
                  </div>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
