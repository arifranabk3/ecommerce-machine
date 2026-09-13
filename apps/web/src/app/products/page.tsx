'use client';
import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Upload,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';

export default function ProductsPage() {
  const mockProducts = [
    { id: '1', name: 'AirMax Pro Wireless', sku: 'AUDIO-001', price: '$299.00', inventory: 142, status: 'Active', store: 'Acme US', updated: '2 hours ago' },
    { id: '2', name: 'Minimalist Desk Mat', sku: 'OFFICE-082', price: '$45.00', inventory: 890, status: 'Active', store: 'Acme Global', updated: '5 hours ago' },
    { id: '3', name: 'Ergo Chair V2', sku: 'FURN-014', price: '$599.00', inventory: 12, status: 'Low Stock', store: 'Acme EU', updated: '1 day ago' },
    { id: '4', name: 'Studio Microphone', sku: 'AUDIO-045', price: '$149.00', inventory: 0, status: 'Out of Stock', store: 'Acme US', updated: '2 days ago' },
    { id: '5', name: 'Mechanical Keyboard', sku: 'TECH-112', price: '$189.00', inventory: 45, status: 'Draft', store: 'Acme Global', updated: '1 week ago' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Products</h1>
            <p className="text-content-secondary text-sm mt-1 font-medium">Manage your catalog across stores and markets.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex">
              <Upload className="w-4 h-4 mr-2" /> Import
            </Button>
            <Button variant="outline" className="hidden sm:flex">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 bg-surface rounded-xl border border-border p-2 shadow-sm">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              placeholder="Search products by name, SKU, or tag..."
              className="w-full pl-9 pr-4 py-2 bg-transparent text-sm text-content-primary placeholder-content-muted border-none focus:ring-0 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-surface shadow-none border-border">
              <Filter className="w-3.5 h-3.5 mr-2 text-content-secondary" /> Filters
            </Button>
            <Button variant="outline" size="sm" className="bg-surface shadow-none border-border hidden md:flex">
              View: All Products <ChevronDown className="w-3.5 h-3.5 ml-2 text-content-secondary" />
            </Button>
            <Button variant="outline" size="sm" className="bg-surface shadow-none border-border hidden md:flex">
              Columns <ChevronDown className="w-3.5 h-3.5 ml-2 text-content-secondary" />
            </Button>
          </div>
        </div>

        {/* Product Table Container */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          <Table>
            <Thead>
              <tr>
                <Th className="pl-6 w-[300px]">Product</Th>
                <Th>SKU</Th>
                <Th>Price</Th>
                <Th>Inventory</Th>
                <Th>Status</Th>
                <Th>Store</Th>
                <Th>Updated</Th>
                <Th className="text-right pr-6"></Th>
              </tr>
            </Thead>
            <Tbody>
              {mockProducts.map((product) => (
                <Tr key={product.id}>
                  <Td className="pl-6">
                    <Link href={`/products/${product.id}`} className="flex items-center gap-4 group/item">
                      <div className="w-10 h-10 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-[10px] text-content-muted font-bold shrink-0">IMG</div>
                      <span className="font-bold text-content-primary group-hover/item:text-brand-600 transition-colors">{product.name}</span>
                    </Link>
                  </Td>
                  <Td><code className="text-[11px] font-mono text-content-secondary bg-surface-secondary px-2 py-1 rounded">{product.sku}</code></Td>
                  <Td><span className="font-bold text-content-primary">{product.price}</span></Td>
                  <Td>
                    <span className={`font-semibold ${product.inventory === 0 ? 'text-danger-text' : product.inventory < 20 ? 'text-warning-text' : 'text-content-secondary'}`}>
                      {product.inventory}
                    </span>
                  </Td>
                  <Td>
                    <Badge variant={
                      product.status === 'Active' ? 'success' : 
                      product.status === 'Low Stock' ? 'warning' : 
                      product.status === 'Out of Stock' ? 'danger' : 'neutral'
                    }>
                      {product.status}
                    </Badge>
                  </Td>
                  <Td><span className="text-xs font-semibold text-content-secondary">{product.store}</span></Td>
                  <Td><span className="text-xs font-medium text-content-muted">{product.updated}</span></Td>
                  <Td className="text-right pr-6">
                    <button className="text-content-muted hover:text-content-primary p-1.5 rounded-lg hover:bg-surface-secondary transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          
          <div className="p-4 border-t border-border flex items-center justify-between text-[11px] font-bold text-content-secondary bg-surface">
            <div>Showing 1 to 5 of 142 products</div>
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
