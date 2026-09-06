'use client';

import React from 'react';
import Link from 'next/link';

export default function CustomerSegmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-8 text-gray-800">
      <div className="mb-6">
        <Link href="/customers" className="text-xs text-gray-500 hover:text-gray-700">
          ← Back to Customers
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Dynamic Customer Segments</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-bold text-gray-900">Active Segments</h2>
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#A9C2B9] rounded-lg hover:bg-[#97b2a8]">
            + Create Segment
          </button>
        </div>

        <div className="divide-y divide-gray-100 text-sm">
          {[
            { name: 'VIP Spenders ($1,000+)', cond: 'totalSpentMinor >= 100000', count: 48 },
            { name: 'Repeat Buyers', cond: 'totalOrders > 1', count: 412 },
            { name: 'At Risk Customers', cond: 'lifecycleStage == AT_RISK', count: 24 },
          ].map((s, i) => (
            <div key={i} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{s.cond}</p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                  {s.count} Customers
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
