'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SettlementsPage() {
  const [filterStatus, setFilterStatus] = useState('');

  const settlements = [
    {
      id: 'set-1',
      settlementNumber: 'SET-2026-000014',
      vendorName: 'Apex Wholesalers Ltd',
      vendorNumber: 'VEN-001004',
      period: '2026-08-01 → 2026-08-31',
      grossPayable: 'PKR 1,500,000',
      adjustments: 'PKR -150,000',
      netPayable: 'PKR 1,350,000',
      status: 'APPROVED',
      date: '2026-09-01'
    },
    {
      id: 'set-2',
      settlementNumber: 'SET-2026-000013',
      vendorName: 'Zenith Logistics & Trading',
      vendorNumber: 'VEN-001002',
      period: '2026-08-15 → 2026-08-31',
      grossPayable: 'PKR 820,000',
      adjustments: 'PKR -20,000',
      netPayable: 'PKR 800,000',
      status: 'PAID',
      date: '2026-09-02'
    },
    {
      id: 'set-3',
      settlementNumber: 'SET-2026-000012',
      vendorName: 'Global Distro Corp',
      vendorNumber: 'VEN-001001',
      period: '2026-08-01 → 2026-08-15',
      grossPayable: 'PKR 450,000',
      adjustments: 'PKR 0',
      netPayable: 'PKR 450,000',
      status: 'PENDING_REVIEW',
      date: '2026-09-04'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Vendor Settlements</h1>
          <p className="text-sm text-gray-500 mt-1">
            Automated settlement calculation, eligible entry locking, approval workflows, and reconciliation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/vendor-payments"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition"
          >
            Payment Records
          </Link>
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#A9C2B9] rounded-lg hover:bg-[#97b2a8] shadow-sm transition">
            + Calculate Settlement
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pending Review', val: 'PKR 450,000', count: '1 Batch' },
          { label: 'Pending Approval', val: 'PKR 0', count: '0 Batches' },
          { label: 'Approved Payouts', val: 'PKR 1,350,000', count: '1 Payout' },
          { label: 'Completed Settlements', val: 'PKR 800,000', count: '1 Payout' }
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-medium text-gray-500">{card.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{card.val}</p>
            <p className="text-xs text-[#A9C2B9] font-medium mt-1">{card.count}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Settlement Records</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9] bg-white"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="PAID">Paid</option>
          </select>
        </div>

        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Settlement #</th>
              <th className="px-6 py-4">Vendor</th>
              <th className="px-6 py-4">Period</th>
              <th className="px-6 py-4">Gross Payable</th>
              <th className="px-6 py-4">Adjustments</th>
              <th className="px-6 py-4">Net Payable</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {settlements.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4 font-mono font-medium text-gray-900">{row.settlementNumber}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{row.vendorName}</div>
                  <div className="text-xs text-gray-400">{row.vendorNumber}</div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">{row.period}</td>
                <td className="px-6 py-4 text-gray-700">{row.grossPayable}</td>
                <td className="px-6 py-4 text-amber-700 font-medium">{row.adjustments}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{row.netPayable}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      row.status === 'APPROVED'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : row.status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/settlements/${row.id}`}
                    className="text-xs font-medium text-[#A9C2B9] hover:underline"
                  >
                    View Details →
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
