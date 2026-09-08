'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function VendorProductsPage({ params }: { params: { id: string } }) {
  const [search, setSearch] = useState('');
  const [loading] = useState(false); // Set to true when integrating API

  // Mock data for UI structure
  const mockProducts = [
    { id: 'PROD-1', sku: 'ELEC-001', name: 'Wireless Headphones', cost: 45.00, sellingPrice: 89.99, status: 'ACTIVE', mapped: true },
    { id: 'PROD-2', sku: 'ELEC-002', name: 'Bluetooth Speaker', cost: 25.50, sellingPrice: 49.99, status: 'ACTIVE', mapped: true },
    { id: 'PROD-3', sku: 'ELEC-003', name: 'Smart Watch', cost: 120.00, sellingPrice: 199.99, status: 'OUT_OF_STOCK', mapped: false },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        
        {/* Vendor Context Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/vendors" className="hover:text-gray-900 transition">Vendors</Link>
            <span>/</span>
            <Link href={`/vendors/${params.id}`} className="hover:text-gray-900 transition font-mono text-xs">{params.id}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Products</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                Vendor Products
                <Badge variant="success">Active Vendor</Badge>
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage and map products supplied by this vendor.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">Import Catalog</Button>
              <Button variant="primary" className="bg-[#A9C2B9] hover:bg-[#97b2a8]">
                + Map Product
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Placeholder (if there is a vendor layout later, this can be moved) */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <Link href={`/vendors/${params.id}/ledger`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Overview & Ledger
            </Link>
            <Link href={`/vendors/${params.id}/products`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-[#A9C2B9] font-medium text-sm text-[#A9C2B9]">
              Products ({mockProducts.length})
            </Link>
            <Link href={`/vendors/${params.id}/settlements`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Settlements
            </Link>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by SKU or product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <div className="flex items-center gap-3">
             <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9] bg-white">
              <option value="">All Statuses</option>
              <option value="mapped">Mapped</option>
              <option value="unmapped">Unmapped</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading products...</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Product / SKU</th>
                  <th className="px-6 py-4">Vendor Cost</th>
                  <th className="px-6 py-4">Selling Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Mapping</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No products found for this vendor.
                    </td>
                  </tr>
                ) : (
                  mockProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{product.sku}</p>
                      </td>
                      <td className="px-6 py-4 font-medium">${product.cost.toFixed(2)}</td>
                      <td className="px-6 py-4">${product.sellingPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          product.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {product.mapped ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Mapped
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Unmapped
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#A9C2B9] hover:underline font-medium text-sm">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Placeholder */}
        {!loading && mockProducts.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div>Showing 1 to {mockProducts.length} of {mockProducts.length} entries</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
