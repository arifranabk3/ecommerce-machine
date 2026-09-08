'use client';
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ShipmentsListPage() {
  const [shipments] = useState([
    { id: 'shp_1', shipmentNumber: 'SHP-2026-000001', orderNumber: 'ORD-2026-000101', customerName: 'Ahmad Khan', courierName: 'TCS Logistics', trackingNumber: 'TRK-984210', status: 'IN_TRANSIT', codAmountMinor: 450000, createdAt: '2026-09-05' },
    { id: 'shp_2', shipmentNumber: 'SHP-2026-000002', orderNumber: 'ORD-2026-000102', customerName: 'Fatima Ali', courierName: 'Leopards Courier', trackingNumber: 'TRK-481029', status: 'DELIVERED', codAmountMinor: 0, createdAt: '2026-09-04' }
  ]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Shipments List" subtitle="Track and manage all tenant outbound shipments.">
          <Button variant="primary">+ Create Shipment</Button>
        </PageHeader>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Shipment #</th>
                  <th className="px-6 py-3 font-semibold">Order</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Courier</th>
                  <th className="px-6 py-3 font-semibold">Tracking #</th>
                  <th className="px-6 py-3 font-semibold">COD</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {shipments.map(shp => (
                  <tr key={shp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-brand-600">{shp.shipmentNumber}</td>
                    <td className="px-6 py-4">{shp.orderNumber}</td>
                    <td className="px-6 py-4">{shp.customerName}</td>
                    <td className="px-6 py-4">{shp.courierName}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{shp.trackingNumber}</td>
                    <td className="px-6 py-4">PKR {(shp.codAmountMinor / 100).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${shp.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-100 text-brand-800'}`}>
                        {shp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
