'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

import { useApiQuery } from '@/lib/api-client';
import { useParams } from 'next/navigation';

export default function VendorSettlementsPage() {
  const params = useParams();
  const { data: settlementsData, isLoading } = useApiQuery<any>(`/api/v1/settlements?vendorId=${params.id}`);
  
  const settlements = settlementsData?.items || settlementsData?.data?.items || settlementsData?.data || settlementsData || [];

  const formatCurrency = (minor: number | undefined) => {
    if (minor === undefined) return 'PKR 0';
    return `PKR ${(minor / 100).toLocaleString()}`;
  };

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
            <span className="text-gray-900 font-medium">Settlements</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                Vendor Settlements
                <Badge variant="success">Active Vendor</Badge>
              </h1>
              <p className="text-sm text-gray-500 mt-1">View and manage settlement history for this vendor.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">Export CSV</Button>
              <Button variant="primary" className="bg-[#A9C2B9] hover:bg-[#97b2a8]">
                Generate Settlement
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Placeholder */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <Link href={`/vendors/${params.id}/ledger`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Overview & Ledger
            </Link>
            <Link href={`/vendors/${params.id}/products`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Products
            </Link>
            <Link href={`/vendors/${params.id}/settlements`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-[#A9C2B9] font-medium text-sm text-[#A9C2B9]">
              Settlements ({settlements.length})
            </Link>
          </nav>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Unsettled Balance</p>
            <p className="text-xl font-bold text-gray-900 mt-1">$4,250.00</p>
            <p className="text-xs text-gray-400 mt-1">Pending next cycle</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Last Settlement</p>
            <p className="text-xl font-bold text-gray-900 mt-1">$12,250.00</p>
            <p className="text-xs text-gray-400 mt-1">Paid on Oct 18, 2024</p>
          </div>
           <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Total YTD Settled</p>
            <p className="text-xl font-bold text-gray-900 mt-1">$145,800.00</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Active</p>
          </div>
        </div>

        {/* Settlements Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
             <div className="p-8 text-center text-gray-500">Loading settlements...</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Settlement ID</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Eligible Amount</th>
                  <th className="px-6 py-4">Deductions</th>
                  <th className="px-6 py-4 font-bold text-gray-900">Net Payable</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {settlements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No settlements found for this vendor.
                    </td>
                  </tr>
                ) : (
                  settlements.map((item: any) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{item._id.substring(0,8).toUpperCase()}</td>
                      <td className="px-6 py-4">{new Date(item.periodStart).toLocaleDateString()} - {new Date(item.periodEnd).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{formatCurrency(item.totalSalesMinor)}</td>
                      <td className="px-6 py-4 text-red-500">-{formatCurrency(item.totalDeductionsMinor)}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(item.netPayableMinor)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 
                          item.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#A9C2B9] hover:underline font-medium text-sm">
                          View Details
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
        {!isLoading && settlements.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div>Showing 1 to {settlements.length} of {settlements.length} entries</div>
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
