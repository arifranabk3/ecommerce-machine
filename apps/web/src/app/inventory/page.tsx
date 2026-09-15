'use client';
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  MapPin, 
  Search, 
  Filter,
  ArrowRightLeft,
  Download,
  ChevronDown
} from 'lucide-react';
import { useApiQuery } from '@/lib/api-client';

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useApiQuery<{ items: any[], total: number, totalPages: number }>(`/api/v1/inventory?page=${page}&limit=20${searchTerm ? `&search=${searchTerm}` : ''}`);

  const inventory = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

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

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 bg-surface rounded-xl border border-border p-2 shadow-sm">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              placeholder="Search by SKU or product name..."
              className="w-full pl-9 pr-4 py-2 bg-transparent text-sm text-content-primary placeholder-content-muted border-none focus:ring-0 focus:outline-none"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
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
                <Th>Status</Th>
              </tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr><Td colSpan={5} className="text-center py-8 text-content-muted">Loading inventory...</Td></Tr>
              ) : error ? (
                <Tr><Td colSpan={5} className="text-center py-8 text-danger-text">Failed to load inventory. {error.message}</Td></Tr>
              ) : inventory.length === 0 ? (
                <Tr><Td colSpan={5} className="text-center py-8 text-content-muted">No inventory found.</Td></Tr>
              ) : inventory.map((item) => (
                <Tr key={item._id}>
                  <Td className="pl-6">
                    <div className="font-bold text-content-primary">{item.productName || 'Unknown Product'}</div>
                    <div className="text-[10px] font-mono text-content-secondary mt-0.5">{item.productSku || 'UNKNOWN'}</div>
                  </Td>
                  <Td>
                    <span className="text-[11px] font-bold text-content-secondary uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-content-muted" /> {item.warehouseName || 'Unknown Warehouse'}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <span className={`font-extrabold ${item.quantityAvailable === 0 ? 'text-danger-text' : item.quantityAvailable < item.reorderPoint ? 'text-warning-text' : 'text-content-primary'}`}>
                      {item.quantityAvailable}
                    </span>
                  </Td>
                  <Td className="text-right font-medium text-content-secondary">{item.quantityReserved}</Td>
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

          <div className="p-4 border-t border-border flex items-center justify-between text-[11px] font-bold text-content-secondary bg-surface">
            <div>Showing {inventory.length} of {total} items (Page {page} of {totalPages})</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[10px] bg-surface border-border" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] bg-surface border-border" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
