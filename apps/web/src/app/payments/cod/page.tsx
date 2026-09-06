'use client';

import React from 'react';

export default function CODPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">COD Cash Collections</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track pending courier cash collections, physical deliveries, and cash handover reconciliation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Pending Cash Collections</h2>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-400 text-xs font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Payment #</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 px-4 font-mono">PAY-2026-000090</td>
                <td className="py-3 px-4 font-mono">ord_1002</td>
                <td className="py-3 px-4 font-bold text-gray-900">PKR 450.00</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs font-medium">PENDING</span></td>
                <td className="py-3 px-4">
                  <button className="px-3 py-1 bg-[#A9C2B9] text-gray-900 rounded font-semibold text-xs hover:bg-[#97b3a9]">
                    Confirm Cash Collection
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
