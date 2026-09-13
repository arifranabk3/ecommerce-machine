'use client';
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  Box, 
  MapPin, 
  Search, 
  Filter,
  ArrowRightLeft,
  Download,
  AlertTriangle,
  ChevronDown,
  Truck
} from 'lucide-react';

export default function InventoryPage() {
  const mockInventory = [
    { id: '1', product: 'AirMax Pro Wireless', sku: 'AUDIO-001', available: 142, reserved: 15, incoming: 50, location: 'US East Warehouse', status: 'In Stock' },
    { id: '2', product: 'Minimalist Desk Mat', sku: 'OFFICE-082', available: 890, reserved: 45, incoming: 0, location: 'Global Fulfillment', status: 'In Stock' },
    { id: '3', product: 'Ergo Chair V2', sku: 'FURN-014', available: 12, reserved: 8, incoming: 20, location: 'EU Central', status: 'Low Stock' },
    { id: '4', product: 'Studio Microphone', sku: 'AUDIO-045', available: 0, reserved: 0, incoming: 100, location: 'US West', status: 'Out of Stock' },
    { id: '5', product: 'Mechanical Keyboard', sku: 'TECH-112', available: 45, reserved: 12, incoming: 0, location: 'Global Fulfillment', status: 'In Stock' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Inventory</h1>
            <p className="text-content-secondary text-sm mt-1 font-medium">Manage stock levels, transfers, and warehouse operations.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex bg-surface">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button variant="primary">
              <ArrowRightLeft className="w-4 h-4 mr-2" /> Transfer Stock
            </Button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Total Available', value: '18,492', sub: 'Units across all locations', icon: Box, color: 'text-brand-600', bg: 'bg-brand-50' },
            { title: 'Low Stock Alerts', value: '24', sub: 'SKUs below threshold', icon: AlertTriangle, color: 'text-warning-text', bg: 'bg-warning-subtle' },
            { title: 'Out of Stock', value: '8', sub: 'SKUs with 0 inventory', icon: AlertTriangle, color: 'text-danger-text', bg: 'bg-danger-subtle' },
            { title: 'Incoming', value: '1,450', sub: 'Units from purchase orders', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map((kpi, i) => (
            <div key={i} className="bg-surface rounded-xl p-6 border border-border shadow-sm flex flex-col justify-between hover:shadow-premium transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[11px] font-bold text-content-muted uppercase tracking-widest">{kpi.title}</h3>
                <div className={`p-1.5 rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-content-primary mb-1 tracking-tight">{kpi.value}</div>
                <div className="text-[10px] font-medium text-content-secondary uppercase tracking-wider">{kpi.sub}</div>
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
              placeholder="Search by SKU or product name..."
              className="w-full pl-9 pr-4 py-2 bg-transparent text-sm text-content-primary placeholder-content-muted border-none focus:ring-0 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg mr-2 hover:bg-surface-hover cursor-pointer transition-colors bg-surface">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span className="text-[11px] font-bold text-content-primary uppercase tracking-wider">All Locations</span>
              <ChevronDown className="w-3.5 h-3.5 text-content-muted ml-1" />
            </div>
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
                <Th className="pl-6">Product</Th>
                <Th>Location</Th>
                <Th className="text-right">Available</Th>
                <Th className="text-right">Reserved</Th>
                <Th className="text-right">Incoming</Th>
                <Th>Status</Th>
              </tr>
            </Thead>
            <Tbody>
              {mockInventory.map((item) => (
                <Tr key={item.id}>
                  <Td className="pl-6">
                    <div className="font-bold text-content-primary">{item.product}</div>
                    <div className="text-[10px] font-mono text-content-secondary mt-0.5">{item.sku}</div>
                  </Td>
                  <Td>
                    <span className="text-[11px] font-bold text-content-secondary uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-content-muted" /> {item.location}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <span className={`font-extrabold ${item.available === 0 ? 'text-danger-text' : item.available < 20 ? 'text-warning-text' : 'text-content-primary'}`}>
                      {item.available}
                    </span>
                  </Td>
                  <Td className="text-right font-medium text-content-secondary">{item.reserved}</Td>
                  <Td className="text-right font-medium text-indigo-600">{item.incoming || '-'}</Td>
                  <Td>
                    <Badge variant={
                      item.status === 'In Stock' ? 'success' : 
                      item.status === 'Low Stock' ? 'warning' : 'danger'
                    }>
                      {item.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>

      </div>
    </DashboardLayout>
  );
}
