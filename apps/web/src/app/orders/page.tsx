'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Plus, Search, Filter, Clock, CheckCircle2, Truck, AlertCircle, XCircle, PauseCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const mockOrders = [
    {
      id: 'ord_101',
      orderNumber: 'SZ-2026-000001',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.j@example.com',
      itemCount: 2,
      totalMinor: 25998,
      currency: 'USD',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'PENDING',
      source: 'WEBSITE',
      paymentMethod: 'PREPAID',
      createdAt: '2026-09-05 14:00'
    },
    {
      id: 'ord_102',
      orderNumber: 'SZ-2026-000002',
      customerName: 'Alex Mercer',
      customerEmail: 'alex.m@example.com',
      itemCount: 1,
      totalMinor: 18500,
      currency: 'USD',
      status: 'PROCESSING',
      paymentStatus: 'PENDING',
      fulfillmentStatus: 'PROCESSING',
      source: 'MANUAL',
      paymentMethod: 'COD',
      createdAt: '2026-09-05 13:45'
    },
    {
      id: 'ord_103',
      orderNumber: 'SZ-2026-000003',
      customerName: 'David Vance',
      customerEmail: 'david.v@example.com',
      itemCount: 4,
      totalMinor: 42000,
      currency: 'USD',
      status: 'SHIPPED',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'SHIPPED',
      source: 'WEBSITE',
      paymentMethod: 'PREPAID',
      createdAt: '2026-09-04 10:15'
    },
    {
      id: 'ord_104',
      orderNumber: 'SZ-2026-000004',
      customerName: 'Elena Rostova',
      customerEmail: 'elena.r@example.com',
      itemCount: 1,
      totalMinor: 8900,
      currency: 'USD',
      status: 'ON_HOLD',
      paymentStatus: 'PENDING',
      fulfillmentStatus: 'PENDING',
      source: 'WHATSAPP',
      paymentMethod: 'COD',
      createdAt: '2026-09-05 11:20'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="success">Confirmed</Badge>;
      case 'PROCESSING':
        return <Badge variant="info">Processing</Badge>;
      case 'SHIPPED':
        return <Badge variant="info">Shipped</Badge>;
      case 'DELIVERED':
        return <Badge variant="success">Delivered</Badge>;
      case 'ON_HOLD':
        return <Badge variant="warning">On Hold</Badge>;
      case 'CANCELLED':
        return <Badge variant="error">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success">Paid</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pending COD</Badge>;
      case 'UNPAID':
        return <Badge variant="error">Unpaid</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders & Fulfillment</h1>
            <p className="text-sm text-slate-500 mt-1">Manage customer sales orders, state transitions, and fulfillment pipeline</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/orders/new">
              <Button variant="primary" className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Manual Order
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 flex items-center gap-3">
            <div className="p-3 bg-brand-50 rounded-xl text-brand-700">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Orders</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">142</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending / Unconfirmed</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">18</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Processing / Shipped</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">34</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Delivered This Month</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">90</p>
            </div>
          </Card>
        </div>

        {/* Filter Controls */}
        <Card className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search order #, customer, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </Card>

        {/* Orders Table */}
        <Card className="overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Order Number</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-brand-900">
                      <Link href={`/orders/${ord.id}`} className="hover:underline">
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{ord.customerName}</div>
                      <div className="text-xs text-slate-400">{ord.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">{ord.itemCount} items</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      ${(ord.totalMinor / 100).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">{getPaymentBadge(ord.paymentStatus)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(ord.status)}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {ord.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">{ord.createdAt}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/orders/${ord.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
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
