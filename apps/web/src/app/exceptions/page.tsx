'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function ExceptionsInboxPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Automation Exception Inbox" 
          subtitle="Review system escalations, failed automation steps, and policy exception items."
        />

        <Card className="!p-0 overflow-hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Severity</Th>
                <Th>Category</Th>
                <Th>Title</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td><Badge variant="error">HIGH</Badge></Td>
                <Td>INVENTORY_STOCKOUT</Td>
                <Td>Supplier Unavailable for SKU-100</Td>
                <Td><span className="text-amber-600 font-semibold">OPEN</span></Td>
                <Td>
                  <Link href="/exceptions/exc_901" className="text-brand-500 font-semibold hover:underline">Review & Resolve →</Link>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
