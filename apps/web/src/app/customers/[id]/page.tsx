'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'notes' | 'activity'>('overview');

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 text-gray-800">
      {/* Top Navigation */}
      <div className="mb-6">
        <Link href="/customers" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
          ← Back to Customers
        </Link>
      </div>

      {/* Header Profile */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#A9C2B9]/20 text-[#67877c] font-bold text-xl flex items-center justify-center">
            EV
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Eleanor Vance</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#A9C2B9]/20 text-[#67877c]">
                VIP Member
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Customer # CUS-000001 • Joined Sep 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm">
            Add Note
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#A9C2B9] rounded-lg hover:bg-[#97b2a8] shadow-sm">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-8">
        {(['overview', 'orders', 'addresses', 'notes', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium capitalize border-b-2 transition ${
              activeTab === tab
                ? 'border-[#A9C2B9] text-[#67877c]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Customer Lifetime Metrics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Total Spent</p>
                  <p className="text-lg font-bold text-gray-900">$2,850.00</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Total Orders</p>
                  <p className="text-lg font-bold text-gray-900">14</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Average Order Value</p>
                  <p className="text-lg font-bold text-gray-900">$203.57</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Last Order Date</p>
                  <p className="text-lg font-bold text-gray-900">Sep 04, 2026</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Orders</h3>
              <div className="text-xs text-gray-500">Order # SZ-2026-000001 • $150.00 • Delivered</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3 text-xs text-gray-600">
                <div>
                  <span className="font-semibold text-gray-700 block">Email</span>
                  eleanor@example.com
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block">Phone</span>
                  +1 555-0192
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block">Marketing Consent</span>
                  <span className="text-emerald-600 font-medium">Subscribed (Checkout)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
