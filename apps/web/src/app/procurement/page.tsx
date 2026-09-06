'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ProcurementPage() {
  const [statusFilter, setStatusFilter] = useState('');

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Procurement & Purchase Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage purchase order lifecycles, stock replenishment, vendor acknowledgments, and receiving.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/procurement/new"
            className="px-4 py-2 text-sm font-medium text-white bg-[#A9C2B9] rounded-lg hover:bg-[#97b2a8] shadow-sm transition"
          >
            + Create Purchase Order
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending Approval', val: '3 Orders', detail: '$14,250 Total Value' },
          { label: 'Submitted POs', val: '8 Orders', detail: 'Awaiting Vendor Confirmation' },
          { label: 'In-Transit Replenishment', val: '5 Orders', detail: 'Expected within 48h' },
          { label: 'Exceptions / Holds', val: '0 Issues', detail: 'Clean Procurement Flow' }
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-medium text-gray-500">{card.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{card.val}</p>
            <p className="text-xs text-[#A9C2B9] font-medium mt-1">{card.detail}</p>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">PO Number</th>
              <th className="px-6 py-4">Vendor</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50/50 transition">
              <td className="px-6 py-4 font-mono font-medium text-gray-900">PO-2026-001001</td>
              <td className="px-6 py-4 text-gray-900 font-medium">Apex Electronics Supplies</td>
              <td className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">ORDER_SPLIT</td>
              <td className="px-6 py-4 text-gray-600">45 Units</td>
              <td className="px-6 py-4 font-semibold text-gray-900">$4,500.00</td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                  SUBMITTED
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link href="/procurement/po-1" className="text-[#A9C2B9] hover:underline font-medium">
                  View Order
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
