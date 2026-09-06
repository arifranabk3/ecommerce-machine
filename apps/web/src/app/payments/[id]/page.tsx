'use client';

import React from 'react';

export default function PaymentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payment Detail</h1>
            <p className="text-sm text-gray-500 font-mono mt-1">ID: {params.id}</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-xs">
            CAPTURED
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Financial Breakdown</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400 block text-xs uppercase font-medium">Gross Amount</span>
              <span className="font-bold text-gray-900 text-lg">PKR 10,000.00</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs uppercase font-medium">Provider Fee</span>
              <span className="font-bold text-amber-600 text-lg">-PKR 250.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
