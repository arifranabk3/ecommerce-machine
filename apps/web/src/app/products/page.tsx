'use client';
import React, { useState } from 'react';
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
import { useApiQuery } from '@/lib/api-client';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useApiQuery<{ items: { _id: string, name: string, sku: string, costPrice: number, sellingPrice: number, grossMarginPercentage?: number, status: string, updatedAt: string, images: string[] }[], total: number, totalPages: number }>(`/api/v1/products?page=${page}&limit=20${searchTerm ? `&search=${searchTerm}` : ''}`);

  const products = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
  };

  const getMarginDisplay = (product: { costPrice: number; sellingPrice: number; grossMarginPercentage?: number }) => {
    const cost = product.costPrice;
    const price = product.sellingPrice;
    const margin = product.grossMarginPercentage;
    
    if (price == null || price <= 0) return '0.00%';
    if (margin != null && !isNaN(margin) && isFinite(margin)) {
      return `${Number(margin).toFixed(2)}%`;
    }
    
    // Fallback if backend didn't supply it
    const calcMargin = ((price - (cost || 0)) / price) * 100;
    return `${calcMargin.toFixed(2)}%`;
  };

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
            <Button variant="outline" className="hidden sm:flex bg-surface">
              <Upload className="w-4 h-4 mr-2" /> Import
            </Button>
            <Button variant="outline" className="hidden sm:flex bg-surface">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Link href="/products/new">
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            </Link>
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
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset page on search
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-surface shadow-none border-border">
              <Filter className="w-3.5 h-3.5 mr-2 text-content-secondary" /> Filters
            </Button>
            <Button variant="outline" size="sm" className="bg-surface shadow-none border-border hidden md:flex">
              View: All Products <ChevronDown className="w-3.5 h-3.5 ml-2 text-content-secondary" />
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
                <Th>Margin</Th>
                <Th>Status</Th>
                <Th>Updated</Th>
                <Th className="text-right pr-6"></Th>
              </tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr><Td colSpan={7} className="text-center py-8 text-content-muted">Loading products...</Td></Tr>
              ) : error ? (
                <Tr><Td colSpan={7} className="text-center py-8 text-danger-text">Failed to load products. {error.message}</Td></Tr>
              ) : products.length === 0 ? (
                <Tr><Td colSpan={7} className="text-center py-8 text-content-muted">No products found matching your criteria.</Td></Tr>
              ) : products.map((product) => (
                <Tr key={product._id}>
                  <Td className="pl-6">
                    <Link href={`/products/${product._id}`} className="flex items-center gap-4 group/item">
                      <div className="w-10 h-10 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-[10px] text-content-muted font-bold shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                        ) : 'IMG'}
                      </div>
                      <span className="font-bold text-content-primary group-hover/item:text-brand-600 transition-colors">{product.name}</span>
                    </Link>
                  </Td>
                  <Td><code className="text-[11px] font-mono text-content-secondary bg-surface-secondary px-2 py-1 rounded border border-border">{product.sku}</code></Td>
                  <Td>
                    <span className="font-bold text-content-primary">{formatPrice(product.sellingPrice)}</span>
                  </Td>
                  <Td>
                    <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs border border-emerald-100">
                      {getMarginDisplay(product)}
                    </span>
                  </Td>
                  <Td>
                    <Badge variant={
                      product.status === 'ACTIVE' ? 'success' : 
                      product.status === 'ARCHIVED' ? 'neutral' : 'warning'
                    }>
                      {product.status}
                    </Badge>
                  </Td>
                  <Td><span className="text-xs font-medium text-content-muted">{new Date(product.updatedAt).toLocaleDateString()}</span></Td>
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
            <div>Showing {products.length} of {total} products (Page {page} of {totalPages})</div>
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
