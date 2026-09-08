'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // API integration for vendor list
    setLoading(false);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Vendors & Suppliers" 
          subtitle="Manage vendor profiles, contacts, product cost mappings, and procurement SLA tracking."
          actions={[
            { label: 'Purchase Orders', variant: 'outline', href: '/procurement' },
            { label: 'Add Vendor', variant: 'primary', href: '/vendors/new' }
          ]}
        />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Vendors', val: '24', detail: 'Primary suppliers' },
          { label: 'Avg Lead Time', val: '5.2 Days', detail: 'Delivery SLA' },
          { label: 'Mapped Products', val: '412 SKUs', detail: 'Multi-supplier cost matrices' },
          { label: 'Auto-Order Enabled', val: '14 Vendors', detail: 'Threshold reordering' }
        ].map((card, i) => (
          <Card key={i} className="p-4">
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{card.val}</p>
            <p className="text-xs text-brand-500 font-medium mt-1">{card.detail}</p>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search vendors by name, company, email, or VEN number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9] bg-white"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLOCKED">Blocked</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </Card>

      {/* Table Container */}
      <Card className="!p-0 overflow-hidden">
        <Table>
          <Thead>
            <Tr>
              <Th>Vendor</Th>
              <Th>Vendor #</Th>
              <Th>Type</Th>
              <Th>Payment Terms</Th>
              <Th>Lead Time</Th>
              <Th>Rating</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td className="font-medium text-slate-900">
                Apex Electronics Supplies
                <p className="text-xs text-slate-400">orders@apexsupplies.com</p>
              </Td>
              <Td className="text-slate-500 font-mono text-xs">VEN-001001</Td>
              <Td>DISTRIBUTOR</Td>
              <Td>NET 30</Td>
              <Td>5 Days</Td>
              <Td className="text-amber-500">★★★★★ (5.0)</Td>
              <Td>
                <Badge variant="success">ACTIVE</Badge>
              </Td>
              <Td className="text-right">
                <Link href="/vendors/ven-1" className="text-brand-500 hover:underline font-medium">
                  View Profile
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
