'use client';

import React from 'react';

export default function PaymentReconciliationPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payment Reconciliation</h1>
          <p className="text-sm text-gray-500 mt-1">
            Compare internal payment records against provider settlements to catch mismatches.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Matched Records</span>
            <div className="text-2xl font-bold text-emerald-600">138</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Mismatches / Flagged</span>
            <div className="text-2xl font-bold text-rose-600">1</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase">Pending Verification</span>
            <div className="text-2xl font-bold text-amber-600">3</div>
          </div>
        </div>
      </div>
    </div>
  );
}
