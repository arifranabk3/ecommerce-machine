'use client';
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';

export default function RTODashboardPage() {
  const [rtos] = useState([
    { id: 'rto_1', rtoNumber: 'RTO-2026-000001', shipmentNumber: 'SHP-2026-000019', orderNumber: 'ORD-2026-000115', reason: 'CUSTOMER_UNAVAILABLE_3_ATTEMPTS', status: 'IN_TRANSIT', rtoCostMinor: 25000, initiatedAt: '2026-09-04' }
  ]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Return-to-Origin (RTO) Tracking" subtitle="Monitor failed delivery returns, reverse transit, and warehouse receiving." />
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">RTO #</th>
                  <th className="px-6 py-3 font-semibold">Shipment #</th>
                  <th className="px-6 py-3 font-semibold">Order</th>
                  <th className="px-6 py-3 font-semibold">Reason</th>
                  <th className="px-6 py-3 font-semibold">RTO Cost</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rtos.map(rto => (
                  <tr key={rto.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-red-600">{rto.rtoNumber}</td>
                    <td className="px-6 py-4">{rto.shipmentNumber}</td>
                    <td className="px-6 py-4">{rto.orderNumber}</td>
                    <td className="px-6 py-4">{rto.reason}</td>
                    <td className="px-6 py-4">PKR {(rto.rtoCostMinor / 100).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">
                        {rto.status}
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
