'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function VendorReturnsPage({ params }: { params: { id: string } }) {
  const [loading] = useState(false);
  const [search, setSearch] = useState('');

  // Mock data representing Return/RTO for this vendor
  const mockReturns = [
    {
      id: 'RET-5591',
      rtoNumber: 'RTO-2024-001',
      shipmentId: 'SHP-9921',
      status: 'INITIATED',
      reason: 'Defective Items in Batch',
      itemCount: 15,
      createdAt: '2024-10-10T09:15:00Z',
    },
    {
      id: 'RET-5594',
      rtoNumber: 'RTO-2024-002',
      shipmentId: 'SHP-9955',
      status: 'DELIVERED',
      reason: 'Wrong SKU Supplied',
      itemCount: 2,
      createdAt: '2024-10-12T11:45:00Z',
    }
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
            <span className="text-gray-900 font-medium">Returns & RTO</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                Vendor Returns & RTO
                <Badge variant="success">Active Vendor</Badge>
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage Return to Origin (RTO) and inventory returns for this supplier.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">Export Report</Button>
              <Button variant="primary" className="bg-[#A9C2B9] hover:bg-[#97b2a8]">
                Initiate RTO
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <Link href={`/vendors/${params.id}/ledger`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Overview & Ledger
            </Link>
            <Link href={`/vendors/${params.id}/products`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Products
            </Link>
            <Link href={`/vendors/${params.id}/settlements`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Settlements
            </Link>
            <Link href={`/vendors/${params.id}/payments`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Payments
            </Link>
            <Link href={`/vendors/${params.id}/returns`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-[#A9C2B9] font-medium text-sm text-[#A9C2B9]">
              Returns ({mockReturns.length})
            </Link>
            <Link href={`/vendors/${params.id}/documents`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Documents
            </Link>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by RTO Number or Shipment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <div className="flex items-center gap-3">
             <input type="date" className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]" />
             <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9] bg-white">
              <option value="">All Statuses</option>
              <option value="INITIATED">Initiated</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Returns Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading returns...</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">RTO / Reference</th>
                  <th className="px-6 py-4">Shipment ID</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockReturns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No returns or RTOs found for this vendor.
                    </td>
                  </tr>
                ) : (
                  mockReturns.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-mono text-xs text-gray-900">{item.rtoNumber}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {item.shipmentId}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {item.itemCount} units
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {item.reason}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'DELIVERED' || item.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#A9C2B9] hover:underline font-medium text-sm">
                          View Details
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
        {!loading && mockReturns.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div>Showing 1 to {mockReturns.length} of {mockReturns.length} entries</div>
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
