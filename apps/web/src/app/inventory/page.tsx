'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Warehouse, ArrowRightLeft, History, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'BALANCES' | 'MOVEMENTS' | 'ALERTS'>('BALANCES');

  // Sample inventory balances
  const balances = [
    {
      id: 'inv_1',
      productName: 'Wireless Ergonomic Keyboard',
      sku: 'KB-WL-001',
      location: 'Main Warehouse (WH-MAIN)',
      onHand: 45,
      reserved: 5,
      available: 40,
      reorderPoint: 10
    },
    {
      id: 'inv_2',
      productName: 'Pro Gaming Headset - Black',
      sku: 'HS-PRO-BLK',
      location: 'Main Warehouse (WH-MAIN)',
      onHand: 8,
      reserved: 2,
      available: 6,
      reorderPoint: 10
    }
  ];

  const movements = [
    {
      id: 'mov_1',
      sku: 'KB-WL-001',
      type: 'STOCK_RECEIVED',
      delta: '+50',
      before: 0,
      after: 50,
      location: 'Main Warehouse',
      reason: 'Purchase Order #PO-902',
      time: '10 mins ago'
    },
    {
      id: 'mov_2',
      sku: 'KB-WL-001',
      type: 'STOCK_RESERVED',
      delta: '0',
      before: 50,
      after: 50,
      location: 'Main Warehouse',
      reason: 'Checkout Reservation (Cart #881)',
      time: '5 mins ago'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Inventory & Stock Ledger" 
          subtitle="Multi-location stock balances, reservations, and movement audit log"
          actions={[
            { label: 'Manage Locations', variant: 'outline', icon: <Warehouse className="w-4 h-4" />, href: '/settings/locations' },
            { label: 'Transfer Stock', variant: 'primary', icon: <ArrowRightLeft className="w-4 h-4" /> }
          ]}
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Button
            variant={activeTab === 'BALANCES' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('BALANCES')}
            className="flex items-center gap-2"
          >
            <Warehouse className="w-4 h-4" /> Stock Balances
          </Button>
          <Button
            variant={activeTab === 'MOVEMENTS' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('MOVEMENTS')}
            className="flex items-center gap-2"
          >
            <History className="w-4 h-4" /> Movement Ledger
          </Button>
          <Button
            variant={activeTab === 'ALERTS' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('ALERTS')}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" /> Low Stock Alerts (1)
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'BALANCES' && (
          <Card className="!p-0 overflow-hidden">
            <Table>
              <Thead>
                <Tr>
                  <Th>Product & SKU</Th>
                  <Th>Location</Th>
                  <Th>On Hand</Th>
                  <Th>Reserved</Th>
                  <Th>Available</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {balances.map((b) => (
                  <Tr key={b.id}>
                    <Td className="font-medium text-brand-900">
                      <div>{b.productName}</div>
                      <span className="text-xs text-slate-400 font-mono">{b.sku}</span>
                    </Td>
                    <Td className="text-xs font-medium text-slate-600">{b.location}</Td>
                    <Td className="font-bold">{b.onHand}</Td>
                    <Td className="text-amber-600 font-semibold">{b.reserved}</Td>
                    <Td className="text-emerald-600 font-bold">{b.available}</Td>
                    <Td>
                      {b.available <= b.reorderPoint ? (
                        <Badge variant="warning" className="flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="success" className="flex items-center gap-1 w-max">
                          <CheckCircle className="w-3 h-3" /> In Stock
                        </Badge>
                      )}
                    </Td>
                    <Td className="text-right">
                      <Button variant="outline" size="sm">Adjust</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        )}

        {activeTab === 'MOVEMENTS' && (
          <Card className="!p-0 overflow-hidden">
            <Table>
              <Thead>
                <Tr>
                  <Th>Timestamp</Th>
                  <Th>SKU</Th>
                  <Th>Movement Type</Th>
                  <Th>Delta</Th>
                  <Th>Before / After</Th>
                  <Th>Reason / Ref</Th>
                </Tr>
              </Thead>
              <Tbody>
                {movements.map((m) => (
                  <Tr key={m.id}>
                    <Td className="text-xs text-slate-400">{m.time}</Td>
                    <Td className="font-mono text-xs">{m.sku}</Td>
                    <Td>
                      <Badge variant="outline">{m.type}</Badge>
                    </Td>
                    <Td className={`font-bold ${m.delta.startsWith('+') ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {m.delta}
                    </Td>
                    <Td className="text-xs">{m.before} → <span className="font-semibold text-brand-900">{m.after}</span></Td>
                    <Td className="text-xs text-slate-500">{m.reason}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        )}

        {activeTab === 'ALERTS' && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Low Stock Alert — Pro Gaming Headset - Black (HS-PRO-BLK)</h4>
                <p className="text-xs text-amber-700 mt-0.5">Available stock (6) is below reorder threshold (10). Reorder recommended.</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
