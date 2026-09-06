'use client';

import React, { useState, useEffect } from 'react';

export default function FinanceDashboardPage() {
  const [summary, setSummary] = useState<any>({
    grossRevenueMinor: 12500000,
    refundsMinor: 450000,
    paymentFeesMinor: 312500,
    netCollectionsMinor: 11737500,
    codPendingMinor: 1850000,
    currency: 'PKR',
    totalTransactions: 142
  });

  const formatMoney = (amountMinor: number) => {
    return `PKR ${(amountMinor / 100).toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Finance & Cash Flow</h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time cash flow, gross revenue, provider fee deductions, and net collections.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button className="px-4 py-2 bg-[#A9C2B9] hover:bg-[#97b3a9] text-gray-900 font-semibold rounded-lg shadow-sm transition-all text-sm">
              Export Statement
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gross Revenue</span>
            <div className="text-2xl font-bold text-gray-900">{formatMoney(summary.grossRevenueMinor)}</div>
            <p className="text-xs text-emerald-600 font-medium">↑ 12.4% vs last period</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer Refunds</span>
            <div className="text-2xl font-bold text-rose-600">-{formatMoney(summary.refundsMinor)}</div>
            <p className="text-xs text-gray-400">3.6% of gross sales</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Provider Fees</span>
            <div className="text-2xl font-bold text-amber-600">-{formatMoney(summary.paymentFeesMinor)}</div>
            <p className="text-xs text-gray-400">Average 2.5% rate</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-2 border-l-4 border-l-[#A9C2B9]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Net Collections</span>
            <div className="text-2xl font-bold text-gray-900">{formatMoney(summary.netCollectionsMinor)}</div>
            <p className="text-xs text-gray-500 font-medium">Available for settlement</p>
          </div>
        </div>

        {/* Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Financial Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase">
                    <th className="py-3 px-2">Tx Number</th>
                    <th className="py-3 px-2">Type</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Direction</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 px-2 font-mono font-medium text-gray-900">FIN-2026-000104</td>
                    <td className="py-3 px-2"><span className="px-2 py-0.5 text-xs rounded bg-emerald-50 text-emerald-700 font-medium">PAYMENT</span></td>
                    <td className="py-3 px-2 font-semibold text-gray-900">PKR 10,000.00</td>
                    <td className="py-3 px-2 text-xs font-bold text-emerald-600">CREDIT</td>
                    <td className="py-3 px-2"><span className="text-xs text-gray-500 font-medium">POSTED</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 px-2 font-mono font-medium text-gray-900">FIN-2026-000103</td>
                    <td className="py-3 px-2"><span className="px-2 py-0.5 text-xs rounded bg-rose-50 text-rose-700 font-medium">REFUND</span></td>
                    <td className="py-3 px-2 font-semibold text-rose-600">PKR 3,000.00</td>
                    <td className="py-3 px-2 text-xs font-bold text-rose-600">DEBIT</td>
                    <td className="py-3 px-2"><span className="text-xs text-gray-500 font-medium">POSTED</span></td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-3 px-2 font-mono font-medium text-gray-900">FIN-2026-000102</td>
                    <td className="py-3 px-2"><span className="px-2 py-0.5 text-xs rounded bg-amber-50 text-amber-700 font-medium">FEE</span></td>
                    <td className="py-3 px-2 font-semibold text-amber-600">PKR 250.00</td>
                    <td className="py-3 px-2 text-xs font-bold text-rose-600">DEBIT</td>
                    <td className="py-3 px-2"><span className="text-xs text-gray-500 font-medium">POSTED</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900">COD Cash Pending</h2>
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg space-y-2">
              <span className="text-xs font-medium text-amber-700">Uncollected Delivery Cash</span>
              <div className="text-xl font-bold text-amber-900">{formatMoney(summary.codPendingMinor)}</div>
              <p className="text-xs text-amber-700/80">Pending physical courier cash handover</p>
            </div>
            <a href="/payments/cod" className="block text-center w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm rounded-lg transition-all">
              Manage COD Collections →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
