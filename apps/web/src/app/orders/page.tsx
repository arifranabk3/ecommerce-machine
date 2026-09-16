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
import { useApiQuery } from '@/lib/api-client';

export default function OrdersPage() {
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const { data, isLoading, error } = useApiQuery<{ data: any[], total: number, page: number, limit: number }>(`/api/v1/orders?page=${page}&limit=20${searchTerm ? `&search=${searchTerm}` : ''}`);
  
  const orders = data?.data || [];
  const total = data?.total || 0;
  
  const formatCurrency = (minor: number | undefined) => {
    if (minor === undefined) return 'Rs 0';
    return `Rs ${(minor / 100).toLocaleString()}`;
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              {isLoading ? (
                <Tr><Td colSpan={7} className="text-center py-8 text-content-muted">Loading orders...</Td></Tr>
              ) : orders.length === 0 ? (
                <Tr><Td colSpan={7} className="text-center py-8 text-content-muted">No orders found.</Td></Tr>
              ) : (
                orders.map((order) => (
                  <Tr key={order._id}>
                    <Td className="pl-6">
                      <Link href={`/orders/${order._id}`} className="font-bold text-content-primary hover:text-brand-600 transition-colors">
                        #{order.orderNumber || order._id.substring(0,8).toUpperCase()}
                      </Link>
                    </Td>
                    <Td><span className="text-xs font-medium text-content-secondary">{new Date(order.createdAt).toLocaleDateString()}</span></Td>
                    <Td>
                      <div className="font-bold text-content-primary">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</div>
                      <div className="text-[10px] font-mono text-content-secondary mt-0.5">{order.customerInfo?.email || 'N/A'}</div>
                    </Td>
                    <Td>
                      <span className="text-[11px] font-bold text-content-secondary uppercase tracking-wider">
                        {order.paymentStatus || 'PENDING'}
                      </span>
                    </Td>
                    <Td>
                      <Badge variant={
                        order.status === 'COMPLETED' ? 'success' : 
                        order.status === 'PROCESSING' ? 'info' :
                        order.status === 'PENDING' ? 'warning' : 'neutral'
                      }>
                        {order.status || 'NEW'}
                      </Badge>
                    </Td>
                    <Td className="text-right">
                      <span className="font-bold text-content-primary">{formatCurrency(order.totalMinor)}</span>
                      <span className="block text-[10px] font-medium text-content-muted">{order.itemCount} item{order.itemCount !== 1 && 's'}</span>
                    </Td>
                    <Td className="text-right pr-6">
                      <button className="text-content-muted hover:text-content-primary p-1.5 rounded-lg hover:bg-surface-secondary transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
          
          <div className="p-4 border-t border-border flex items-center justify-between text-[11px] font-bold text-content-secondary bg-surface">
            <div>Showing {orders.length > 0 ? (page - 1) * 20 + 1 : 0} to {Math.min(page * 20, total)} of {total} orders</div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-[10px] bg-surface border-border" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-[10px] bg-surface border-border"
                disabled={page * 20 >= total}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
