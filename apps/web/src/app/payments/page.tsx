'use client';

import React, { useState } from 'react';

export default function PaymentsListPage() {
  const [payments] = useState<any[]>([
    {
      id: 'pay_001',
      paymentNumber: 'PAY-2026-000089',
      orderId: 'ord_1001',
      method: 'CARD',
      provider: 'MOCK',
      amountMinor: 100000,
      currency: 'PKR',
      status: 'CAPTURED',
      createdAt: '2026-09-06T08:30:00Z'
    },
    {
      id: 'pay_002',
      paymentNumber: 'PAY-2026-000090',
      orderId: 'ord_1002',
      method: 'COD',
      provider: 'MOCK',
      amountMinor: 45000,
      currency: 'PKR',
      status: 'PENDING',
      createdAt: '2026-09-06T09:00:00Z'
    }
  ]);

  const formatMoney = (amountMinor: number, currency: string) => {
    return `${currency} ${(amountMinor / 100).toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Payments</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and filter all customer transactions, payment states, and payment methods.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase">
              <tr>
                <th className="py-4 px-6">Payment Number</th>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Method</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 cursor-pointer">
                  <td className="py-4 px-6 font-mono font-medium text-gray-900">{p.paymentNumber}</td>
                  <td className="py-4 px-6 text-gray-600 font-mono">{p.orderId}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                      {p.method}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-900">{formatMoney(p.amountMinor, p.currency)}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        p.status === 'CAPTURED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
