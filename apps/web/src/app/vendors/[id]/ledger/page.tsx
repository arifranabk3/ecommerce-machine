'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function VendorLedgerPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'LEDGER' | 'SETTLEMENTS'>('LEDGER');

  const summary = {
    vendorName: 'Apex Wholesalers Ltd',
    vendorNumber: 'VEN-001004',
    currentPayable: 'PKR 1,450,000',
    totalCredits: 'PKR 2,800,000',
    totalAdjustments: 'PKR 350,000',
    settled: 'PKR 1,000,000',
    outstanding: 'PKR 1,450,000'
  };

  const ledgerEntries = [
    {
      id: 'led-1',
      entryNumber: 'LED-000104',
      date: '2026-09-05',
      type: 'ORDER_PAYABLE',
      direction: 'CREDIT',
      amount: 'PKR 850,000',
      source: 'Sales Order #ORD-10492',
      status: 'POSTED',
      runningBalance: 'PKR 1,450,000'
    },
    {
      id: 'led-2',
      entryNumber: 'LED-000103',
      date: '2026-09-04',
      type: 'RETURN_ADJUSTMENT',
      direction: 'DEBIT',
      amount: 'PKR 150,000',
      source: 'Return Request #RET-842',
      status: 'POSTED',
      runningBalance: 'PKR 600,000'
    },
    {
      id: 'led-3',
      entryNumber: 'LED-000102',
      date: '2026-09-02',
      type: 'SETTLEMENT',
      direction: 'DEBIT',
      amount: 'PKR 500,000',
      source: 'Settlement #SET-2026-000012',
      status: 'POSTED',
      runningBalance: 'PKR 750,000'
    },
    {
      id: 'led-4',
      entryNumber: 'LED-000101',
      date: '2026-09-01',
      type: 'ORDER_PAYABLE',
      direction: 'CREDIT',
      amount: 'PKR 1,250,000',
      source: 'Sales Order #ORD-10410',
      status: 'POSTED',
      runningBalance: 'PKR 1,250,000'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 text-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/vendors" className="text-xs text-[#A9C2B9] hover:underline">
              ← Vendors
            </Link>
            <span className="text-xs text-gray-400">/</span>
            <span className="text-xs text-gray-500">{summary.vendorNumber}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
            {summary.vendorName} — Financial Ledger
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Immutable vendor subledger, payable balances, adjustments, and settlement history.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/settlements"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition"
          >
            Settlements Engine
          </Link>
        </div>
      </div>

      {/* Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Current Payable', val: summary.currentPayable, highlight: true },
          { label: 'Total Credits', val: summary.totalCredits, highlight: false },
          { label: 'Total Adjustments', val: summary.totalAdjustments, highlight: false },
          { label: 'Total Settled', val: summary.settled, highlight: false },
          { label: 'Outstanding Balance', val: summary.outstanding, highlight: true }
        ].map((card, i) => (
          <div
            key={i}
            className={`p-5 rounded-xl border shadow-sm ${
              card.highlight ? 'bg-white border-[#A9C2B9]/40' : 'bg-white border-gray-100'
            }`}
          >
            <p className="text-xs font-medium text-gray-500">{card.label}</p>
            <p
              className={`text-xl font-bold mt-1 ${
                card.highlight ? 'text-[#A9C2B9]' : 'text-gray-900'
              }`}
            >
              {card.val}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs & Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/50 px-6 pt-4 gap-6">
          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`pb-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'LEDGER'
                ? 'border-[#A9C2B9] text-[#A9C2B9]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Ledger Entries
          </button>
          <button
            onClick={() => setActiveTab('SETTLEMENTS')}
            className={`pb-3 text-sm font-medium border-b-2 transition ${
              activeTab === 'SETTLEMENTS'
                ? 'border-[#A9C2B9] text-[#A9C2B9]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Settlement History
          </button>
        </div>

        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/30 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Entry #</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Direction</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Source Reference</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Running Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ledgerEntries.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4 font-mono font-medium text-gray-900">{row.entryNumber}</td>
                <td className="px-6 py-4 text-gray-500">{row.date}</td>
                <td className="px-6 py-4 font-medium text-gray-700">{row.type}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      row.direction === 'CREDIT'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {row.direction}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">{row.amount}</td>
                <td className="px-6 py-4 text-gray-600">{row.source}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                  {row.runningBalance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
