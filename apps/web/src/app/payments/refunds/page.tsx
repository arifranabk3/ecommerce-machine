'use client';

import React from 'react';

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Refunds</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer refund requests, remaining refundable calculators, and approval step-ups.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Refunds</h2>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-400 text-xs font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Refund #</th>
                <th className="py-3 px-4">Payment ID</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 font-mono">REF-2026-000012</td>
                <td className="py-3 px-4 font-mono">pay_001</td>
                <td className="py-3 px-4 font-bold text-rose-600">PKR 3,000.00</td>
                <td className="py-3 px-4">Customer Order Return</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-medium">SUCCEEDED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
