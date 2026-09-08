'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function VendorPaymentsPage({ params }: { params: { id: string } }) {
  const [loading] = useState(false);
  const [search, setSearch] = useState('');

  // Mock data for UI structure aligned with VendorPayment model
  const mockPayments = [
    {
      id: 'PAY-8821',
      settlementId: 'STL-9012',
      paymentReference: 'TRX-10293847',
      amountMinor: 1225000,
      currency: 'PKR',
      status: 'PAID',
      provider: 'BANK_TRANSFER',
      providerTransactionId: 'BNK-9928172',
      paidAt: '2024-10-18T14:30:00Z',
    },
    {
      id: 'PAY-8825',
      settlementId: 'STL-9013',
      paymentReference: 'TRX-10293999',
      amountMinor: 1840000,
      currency: 'PKR',
      status: 'PROCESSING',
      provider: 'BANK_TRANSFER',
      providerTransactionId: '',
      paidAt: null,
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        
        {/* Vendor Context Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/vendors" className="hover:text-gray-900 transition">Vendors</Link>
            <span>/</span>
            <Link href={`/vendors/${params.id}`} className="hover:text-gray-900 transition font-mono text-xs">{params.id}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Payments</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                Vendor Payments
                <Badge variant="success">Active Vendor</Badge>
              </h1>
              <p className="text-sm text-gray-500 mt-1">Track payouts and payment history for this vendor.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">Export Data</Button>
              <Button variant="primary" className="bg-[#A9C2B9] hover:bg-[#97b2a8]">
                Record Manual Payment
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <Link href={`/vendors/${params.id}/ledger`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Overview & Ledger
            </Link>
            <Link href={`/vendors/${params.id}/products`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Products
            </Link>
            <Link href={`/vendors/${params.id}/settlements`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Settlements
            </Link>
            <Link href={`/vendors/${params.id}/payments`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-[#A9C2B9] font-medium text-sm text-[#A9C2B9]">
              Payments ({mockPayments.length})
            </Link>
            <Link href={`/vendors/${params.id}/returns`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Returns
            </Link>
            <Link href={`/vendors/${params.id}/documents`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Documents
            </Link>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Payment Ref, Provider Ref, or Settlement ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <div className="flex items-center gap-3">
             <input type="date" className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]" />
             <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9] bg-white">
              <option value="">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading payments...</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Payment Ref</th>
                  <th className="px-6 py-4">Settlement ID</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method / Provider</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Paid At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No payments found for this vendor.
                    </td>
                  </tr>
                ) : (
                  mockPayments.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-mono text-xs text-gray-900">{item.paymentReference}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        <Link href={`/vendors/${params.id}/settlements`} className="hover:text-[#A9C2B9] transition">{item.settlementId}</Link>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.currency} {(item.amountMinor / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{item.provider.replace('_', ' ')}</p>
                        {item.providerTransactionId && <p className="text-xs text-gray-400 font-mono mt-0.5">{item.providerTransactionId}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' :
                          item.status === 'FAILED' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {item.paidAt ? new Date(item.paidAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#A9C2B9] hover:underline font-medium text-sm">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Placeholder */}
        {!loading && mockPayments.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div>Showing 1 to {mockPayments.length} of {mockPayments.length} entries</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
