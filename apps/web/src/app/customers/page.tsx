'use client';
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  Search, 
  Filter,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Mail,
  MapPin
} from 'lucide-react';

export default function CustomersPage() {
  const mockCustomers = [
    { id: '1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', location: 'San Francisco, CA', orders: 12, spent: '$1,240.00', lastActive: '2 hours ago', status: 'Active' },
    { id: '2', name: 'Michael Chen', email: 'm.chen@tech.co', location: 'Seattle, WA', orders: 4, spent: '$890.50', lastActive: '5 hours ago', status: 'Active' },
    { id: '3', name: 'Emma Thompson', email: 'emma@studio.design', location: 'London, UK', orders: 1, spent: '$45.00', lastActive: '1 day ago', status: 'New' },
    { id: '4', name: 'David Wilson', email: 'dwilson99@gmail.com', location: 'Austin, TX', orders: 0, spent: '$0.00', lastActive: '2 days ago', status: 'Inactive' },
    { id: '5', name: 'Alex Rivera', email: 'arivera@design.co', location: 'New York, NY', orders: 24, spent: '$3,490.99', lastActive: '1 week ago', status: 'VIP' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Customers</h1>
            <p className="text-content-secondary text-sm mt-1 font-medium">Manage your customer relationships, segments, and profiles.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex bg-surface">
              <Upload className="w-4 h-4 mr-2" /> Import
            </Button>
            <Button variant="outline" className="hidden sm:flex bg-surface">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" /> Add Customer
            </Button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Total Customers', value: '12,482', change: '+124 this week' },
            { title: 'Active (30d)', value: '4,291', change: '+18% vs last month' },
            { title: 'Average CLV', value: '$342.50', change: '+4.2% vs last year' },
            { title: 'Repeat Rate', value: '38.4%', change: '-1.2% vs last month' },
          ].map((kpi, i) => (
            <div key={i} className="bg-surface p-6 flex flex-col justify-between hover:shadow-premium transition-shadow rounded-xl border border-border shadow-sm">
              <h3 className="text-[11px] font-bold text-content-muted uppercase tracking-widest mb-4">{kpi.title}</h3>
              <div>
                <div className="text-2xl font-bold text-content-primary mb-1 tracking-tight">{kpi.value}</div>
                <div className="text-[10px] font-medium text-success-text uppercase tracking-wider">{kpi.change}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 bg-surface rounded-xl border border-border p-2 shadow-sm">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              className="w-full pl-9 pr-4 py-2 bg-transparent text-sm text-content-primary placeholder-content-muted border-none focus:ring-0 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-surface shadow-none border-border">
              <Filter className="w-3.5 h-3.5 mr-2 text-content-secondary" /> Segments
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          <Table>
            <Thead>
              <tr>
                <Th className="pl-6">Customer</Th>
                <Th>Location</Th>
                <Th className="text-right">Orders</Th>
                <Th className="text-right">Total Spent</Th>
                <Th>Last Active</Th>
                <Th>Status</Th>
                <Th className="text-right pr-6"></Th>
              </tr>
            </Thead>
            <Tbody>
              {mockCustomers.map((customer) => (
                <Tr key={customer.id}>
                  <Td className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-xs font-bold text-brand-600 shrink-0">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-content-primary cursor-pointer hover:text-brand-600 transition-colors">{customer.name}</div>
                        <div className="text-[10px] font-medium text-content-secondary mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {customer.email}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-[11px] font-bold text-content-secondary uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-content-muted" /> {customer.location}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <span className="font-bold text-content-primary">{customer.orders}</span>
                  </Td>
                  <Td className="text-right">
                    <span className="font-bold text-content-primary">{customer.spent}</span>
                  </Td>
                  <Td>
                    <span className="text-xs font-medium text-content-secondary">{customer.lastActive}</span>
                  </Td>
                  <Td>
                    <Badge variant={
                      customer.status === 'Active' ? 'success' : 
                      customer.status === 'VIP' ? 'info' :
                      customer.status === 'New' ? 'warning' : 'neutral'
                    }>
                      {customer.status}
                    </Badge>
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
            <div>Showing 1 to 5 of 12,482 customers</div>
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
