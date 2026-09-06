'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState('');

  useEffect(() => {
    // In production web app, fetch from /api/v1/customers
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers & CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer profiles, lifetime metrics, addresses, tags & segment insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/customers/segments"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition"
          >
            Manage Segments
          </Link>
          <Link
            href="/customers/new"
            className="px-4 py-2 text-sm font-medium text-white bg-[#A9C2B9] rounded-lg hover:bg-[#97b2a8] shadow-sm transition"
          >
            + Add Customer
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Customers', val: '1,248', change: '+12% this month' },
          { label: 'Active Buyers', val: '850', change: '68% of base' },
          { label: 'Repeat Customers', val: '412', change: '33% retention' },
          { label: 'VIP Members', val: '48', change: '$5k+ spenders' },
          { label: 'At Risk', val: '24', change: 'Inactive > 90d' },
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-medium text-gray-500">{card.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{card.val}</p>
            <p className="text-xs text-[#A9C2B9] font-medium mt-1">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name, email, phone, customer #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={lifecycleFilter}
            onChange={(e) => setLifecycleFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
          >
            <option value="">All Lifecycles</option>
            <option value="NEW">New</option>
            <option value="ACTIVE">Active</option>
            <option value="REPEAT">Repeat</option>
            <option value="VIP">VIP</option>
            <option value="AT_RISK">At Risk</option>
            <option value="DORMANT">Dormant</option>
          </select>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/75 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Orders</th>
              <th className="py-3.5 px-4">Total Spent</th>
              <th className="py-3.5 px-4">Lifecycle</th>
              <th className="py-3.5 px-4">Source</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              {
                id: 'cus_1',
                number: 'CUS-000001',
                name: 'Eleanor Vance',
                email: 'eleanor@example.com',
                phone: '+1 555-0192',
                orders: 14,
                spent: '$2,850.00',
                lifecycle: 'VIP',
                source: 'WEBSITE',
              },
              {
                id: 'cus_2',
                number: 'CUS-000002',
                name: 'Marcus Brody',
                email: 'marcus@example.com',
                phone: '+1 555-0184',
                orders: 4,
                spent: '$420.00',
                lifecycle: 'REPEAT',
                source: 'MANUAL',
              },
            ].map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition">
                <td className="py-3.5 px-4 font-medium text-gray-900">
                  <Link href={`/customers/${c.id}`} className="hover:text-[#A9C2B9] transition">
                    <div>{c.name}</div>
                    <div className="text-xs text-gray-400 font-mono">{c.number}</div>
                  </Link>
                </td>
                <td className="py-3.5 px-4">
                  <div>{c.email}</div>
                  <div className="text-xs text-gray-400">{c.phone}</div>
                </td>
                <td className="py-3.5 px-4 font-medium text-gray-800">{c.orders} orders</td>
                <td className="py-3.5 px-4 font-semibold text-gray-900">{c.spent}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      c.lifecycle === 'VIP'
                        ? 'bg-[#A9C2B9]/20 text-[#67877c]'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {c.lifecycle}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs font-mono text-gray-500">{c.source}</td>
                <td className="py-3.5 px-4 text-right font-medium">
                  <Link href={`/customers/${c.id}`} className="text-[#A9C2B9] hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
