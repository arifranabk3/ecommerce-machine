'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function ShippingDashboardPage() {
  const [metrics] = useState({
    readyToShip: 14,
    pickupScheduled: 8,
    inTransit: 42,
    outForDelivery: 19,
    deliveredToday: 65,
    failedDelivery: 3,
    rtoInitiated: 2,
    deliverySuccessRate: 96.2,
    rtoRate: 2.1
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Shipping & Fulfillment Dashboard" 
          subtitle="Overview of active shipments, courier SLAs, delivery performance, and RTO metrics."
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ready to Ship</span>
            <div className="text-2xl font-bold text-slate-900 mt-2">{metrics.readyToShip}</div>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Transit</span>
            <div className="text-2xl font-bold text-blue-500 mt-2">{metrics.inTransit}</div>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Out For Delivery</span>
            <div className="text-2xl font-bold text-purple-500 mt-2">{metrics.outForDelivery}</div>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivered Today</span>
            <div className="text-2xl font-bold text-emerald-500 mt-2">{metrics.deliveredToday}</div>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">RTO Rate</span>
            <div className="text-2xl font-bold text-rose-500 mt-2">{metrics.rtoRate}%</div>
          </Card>
        </div>

        {/* Carrier Performance Table */}
        <Card className="!p-0 overflow-hidden">
          <div className="p-6 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Active Courier Performance</h2>
          </div>
          <Table>
            <Thead>
              <Tr>
                <Th>Courier Name</Th>
                <Th>Active Shipments</Th>
                <Th>On-Time Delivery</Th>
                <Th>Avg. Transit Time</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td className="font-semibold text-slate-900">TCS Logistics</Td>
                <Td>45</Td>
                <Td className="text-emerald-500 font-semibold">98.4%</Td>
                <Td>1.4 Days</Td>
                <Td><Badge variant="success">ACTIVE</Badge></Td>
              </Tr>
              <Tr>
                <Td className="font-semibold text-slate-900">Leopards Courier</Td>
                <Td>28</Td>
                <Td className="text-emerald-500 font-semibold">95.8%</Td>
                <Td>1.8 Days</Td>
                <Td><Badge variant="success">ACTIVE</Badge></Td>
              </Tr>
              <Tr>
                <Td className="font-semibold text-slate-900">Trax Express</Td>
                <Td>11</Td>
                <Td className="text-amber-500 font-semibold">91.2%</Td>
                <Td>2.1 Days</Td>
                <Td><Badge variant="success">ACTIVE</Badge></Td>
              </Tr>
            </Tbody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
