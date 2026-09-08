'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Package, Plus, Search, Filter, Warehouse, Tag, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample client data display
  const mockProducts = [
    {
      id: 'prod_1',
      name: 'Wireless Ergonomic Keyboard',
      sku: 'KB-WL-001',
      type: 'SIMPLE',
      status: 'ACTIVE',
      sellingPrice: 12999, // PKR / cents
      costPrice: 7500,
      margin: '42.3%',
      stock: 45,
      category: 'Electronics'
    },
    {
      id: 'prod_2',
      name: 'Pro Gaming Headset - Black',
      sku: 'HS-PRO-BLK',
      type: 'VARIABLE',
      status: 'ACTIVE',
      sellingPrice: 18500,
      costPrice: 11000,
      margin: '40.5%',
      stock: 8,
      category: 'Audio'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Products & Catalog" 
          subtitle="Manage SKUs, variants, cost margins, and catalog items"
          actions={[
            { label: 'Add Product', variant: 'primary', icon: <Plus className="w-4 h-4" />, href: '/products/new' }
          ]}
        />

        {/* Filters & Search */}
        <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, SKU, or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter Status
            </Button>
            <Link href="/settings/categories">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Tag className="w-4 h-4" /> Categories
              </Button>
            </Link>
            <Link href="/inventory">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Warehouse className="w-4 h-4" /> Inventory Ledger
              </Button>
            </Link>
          </div>
        </Card>

        {/* Product Table */}
        <Card className="!p-0 overflow-hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Product Name</Th>
                <Th>SKU</Th>
                <Th>Type</Th>
                <Th>Price</Th>
                <Th>Gross Margin</Th>
                <Th>Total Stock</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockProducts.map((p) => (
                <Tr key={p.id}>
                  <Td className="font-medium text-brand-900 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div>{p.name}</div>
                      <span className="text-xs text-slate-400">{p.category}</span>
                    </div>
                  </Td>
                  <Td className="font-mono text-xs">{p.sku}</Td>
                  <Td>
                    <Badge variant="outline">{p.type}</Badge>
                  </Td>
                  <Td className="font-medium">Rs. {(p.sellingPrice / 100).toLocaleString()}</Td>
                  <Td className="text-emerald-600 font-semibold">{p.margin}</Td>
                  <Td>
                    {p.stock <= 10 ? (
                      <span className="flex items-center gap-1 text-amber-600 font-medium text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" /> {p.stock} units
                      </span>
                    ) : (
                      <span>{p.stock} units</span>
                    )}
                  </Td>
                  <Td>
                    <Badge variant={p.status === 'ACTIVE' ? 'success' : 'neutral'}>{p.status}</Badge>
                  </Td>
                  <Td className="text-right">
                    <Link href={`/products/${p.id}`}>
                      <Button variant="ghost" size="sm">Manage</Button>
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
