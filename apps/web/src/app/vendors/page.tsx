'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // API integration for vendor list
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Vendors & Suppliers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage vendor profiles, contacts, product cost mappings, and procurement SLA tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/procurement"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition"
          >
            Purchase Orders
          </Link>
          <Link
            href="/vendors/new"
            className="px-4 py-2 text-sm font-medium text-white bg-[#A9C2B9] rounded-lg hover:bg-[#97b2a8] shadow-sm transition"
          >
            + Add Vendor
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Vendors', val: '24', detail: 'Primary suppliers' },
          { label: 'Avg Lead Time', val: '5.2 Days', detail: 'Delivery SLA' },
          { label: 'Mapped Products', val: '412 SKUs', detail: 'Multi-supplier cost matrices' },
          { label: 'Auto-Order Enabled', val: '14 Vendors', detail: 'Threshold reordering' }
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-medium text-gray-500">{card.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{card.val}</p>
            <p className="text-xs text-[#A9C2B9] font-medium mt-1">{card.detail}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search vendors by name, company, email, or VEN number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9] bg-white"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLOCKED">Blocked</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Vendor</th>
              <th className="px-6 py-4">Vendor #</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Payment Terms</th>
              <th className="px-6 py-4">Lead Time</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50/50 transition">
              <td className="px-6 py-4 font-medium text-gray-900">
                Apex Electronics Supplies
                <p className="text-xs text-gray-400">orders@apexsupplies.com</p>
              </td>
              <td className="px-6 py-4 text-gray-500 font-mono text-xs">VEN-001001</td>
              <td className="px-6 py-4 text-gray-600">DISTRIBUTOR</td>
              <td className="px-6 py-4 text-gray-600">NET 30</td>
              <td className="px-6 py-4 text-gray-600">5 Days</td>
              <td className="px-6 py-4 text-amber-500">★★★★★ (5.0)</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">
                  ACTIVE
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link href="/vendors/ven-1" className="text-[#A9C2B9] hover:underline font-medium">
                  View Profile
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
