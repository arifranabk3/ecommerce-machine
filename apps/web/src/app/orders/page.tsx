'use client';
import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  Search, 
  Filter,
  Download,
  Plus,
  MoreHorizontal
} from 'lucide-react';

export default function OrdersPage() {
  const mockOrders = [
    { id: 'SZ-10283', date: 'Today, 10:42 AM', customer: 'Sarah Jenkins', email: 'sarah.j@example.com', total: '$142.00', payment: 'Paid', status: 'Unfulfilled', items: 2 },
    { id: 'SZ-10282', date: 'Today, 09:15 AM', customer: 'Michael Chen', email: 'm.chen@tech.co', total: '$890.50', payment: 'Authorized', status: 'Processing', items: 1 },
    { id: 'SZ-10281', date: 'Yesterday, 04:30 PM', customer: 'Emma Thompson', email: 'emma@studio.design', total: '$45.00', payment: 'Paid', status: 'Fulfilled', items: 1 },
    { id: 'SZ-10280', date: 'Yesterday, 02:10 PM', customer: 'David Wilson', email: 'dwilson99@gmail.com', total: '$12.99', payment: 'Refunded', status: 'Cancelled', items: 1 },
    { id: 'SZ-10279', date: 'Aug 28, 11:20 AM', customer: 'Alex Rivera', email: 'arivera@design.co', total: '$349.99', payment: 'Paid', status: 'Fulfilled', items: 3 },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Orders</h1>
            <p className="text-content-secondary text-sm mt-1 font-medium">Track sales, payments and fulfillment.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex bg-surface">
              <Download className="w-4 h-4 mr-2" /> Export Orders
            </Button>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" /> Create Draft Order
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border pb-0 mb-4">
          <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
            {['All', 'Unfulfilled', 'Unpaid', 'Returns'].map((tab, idx) => (
              <button
                key={tab}
                className={`
                  whitespace-nowrap py-2 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-colors
                  ${idx === 0 
                    ? 'border-brand-600 text-brand-600' 
                    : 'border-transparent text-content-secondary hover:text-content-primary hover:border-border'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 bg-surface rounded-xl border border-border p-2 shadow-sm">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or email..."
              className="w-full pl-9 pr-4 py-2 bg-transparent text-sm text-content-primary placeholder-content-muted border-none focus:ring-0 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-surface shadow-none border-border">
              <Filter className="w-3.5 h-3.5 mr-2 text-content-secondary" /> Filters
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          <Table>
            <Thead>
              <tr>
                <Th className="pl-6 w-[120px]">Order</Th>
                <Th>Date</Th>
                <Th>Customer</Th>
                <Th>Payment</Th>
                <Th>Status</Th>
                <Th className="text-right">Total</Th>
                <Th className="text-right pr-6"></Th>
              </tr>
            </Thead>
            <Tbody>
              {mockOrders.map((order) => (
                <Tr key={order.id}>
                  <Td className="pl-6">
                    <Link href={`/orders/${order.id}`} className="font-bold text-content-primary hover:text-brand-600 transition-colors">
                      {order.id}
                    </Link>
                  </Td>
                  <Td><span className="text-xs font-medium text-content-secondary">{order.date}</span></Td>
                  <Td>
                    <div className="font-bold text-content-primary">{order.customer}</div>
                    <div className="text-[10px] font-mono text-content-secondary mt-0.5">{order.email}</div>
                  </Td>
                  <Td>
                    <span className="text-[11px] font-bold text-content-secondary uppercase tracking-wider">
                      {order.payment}
                    </span>
                  </Td>
                  <Td>
                    <Badge variant={
                      order.status === 'Fulfilled' ? 'success' : 
                      order.status === 'Processing' ? 'info' :
                      order.status === 'Unfulfilled' ? 'warning' : 'neutral'
                    }>
                      {order.status}
                    </Badge>
                  </Td>
                  <Td className="text-right">
                    <span className="font-bold text-content-primary">{order.total}</span>
                    <span className="block text-[10px] font-medium text-content-muted">{order.items} item{order.items !== 1 && 's'}</span>
                  </Td>
                  <Td className="text-right pr-6">
                    <button className="text-content-muted hover:text-content-primary p-1.5 rounded-lg hover:bg-surface-secondary transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          
          <div className="p-4 border-t border-border flex items-center justify-between text-[11px] font-bold text-content-secondary bg-surface">
            <div>Showing 1 to 5 of 1,248 orders</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[10px] bg-surface border-border" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] bg-surface border-border">Next</Button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
