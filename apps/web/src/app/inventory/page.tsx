'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Warehouse, ArrowRightLeft, History, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-900 tracking-tight">Inventory & Stock Ledger</h1>
            <p className="text-sm text-slate-500 mt-1">Multi-location stock balances, reservations, and movement audit log</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/settings/locations">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Warehouse className="w-4 h-4" /> Manage Locations
              </Button>
            </Link>
            <Button variant="primary" size="sm" className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4" /> Transfer Stock
            </Button>
          </div>
        </div>

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
          <Card className="overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                  <th className="py-3 px-4">Product & SKU</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">On Hand</th>
                  <th className="py-3 px-4">Reserved</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {balances.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-medium text-brand-900">
                      <div>{b.productName}</div>
                      <span className="text-xs text-slate-400 font-mono">{b.sku}</span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-600">{b.location}</td>
                    <td className="py-3 px-4 font-bold">{b.onHand}</td>
                    <td className="py-3 px-4 text-amber-600 font-semibold">{b.reserved}</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">{b.available}</td>
                    <td className="py-3 px-4">
                      {b.available <= b.reorderPoint ? (
                        <Badge variant="warning" className="flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="success" className="flex items-center gap-1 w-max">
                          <CheckCircle className="w-3 h-3" /> In Stock
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="outline" size="sm">Adjust</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {activeTab === 'MOVEMENTS' && (
          <Card className="overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4">Delta</th>
                  <th className="py-3 px-4">Before / After</th>
                  <th className="py-3 px-4">Reason / Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-xs text-slate-400">{m.time}</td>
                    <td className="py-3 px-4 font-mono text-xs">{m.sku}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{m.type}</Badge>
                    </td>
                    <td className={`py-3 px-4 font-bold ${m.delta.startsWith('+') ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {m.delta}
                    </td>
                    <td className="py-3 px-4 text-xs">{m.before} → <span className="font-semibold text-brand-900">{m.after}</span></td>
                    <td className="py-3 px-4 text-xs text-slate-500">{m.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
