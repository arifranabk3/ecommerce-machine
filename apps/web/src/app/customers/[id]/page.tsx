'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApiQuery } from '@/lib/api-client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'notes' | 'activity'>('overview');

  const { data: customerData, isLoading: isLoadingCustomer } = useApiQuery<any>(`/api/v1/customers/${customerId}`);
  const { data: ordersData, isLoading: isLoadingOrders } = useApiQuery<any>(`/api/v1/customers/${customerId}/orders?limit=5`);

  const customer = customerData?.data;
  const recentOrders = ordersData?.data?.items || [];

  const formatCurrency = (minor: number | undefined) => {
    if (minor === undefined) return 'Rs 0';
    return `Rs ${(minor / 100).toLocaleString()}`;
  };

  if (isLoadingCustomer) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50/50 p-8 text-center py-20 text-content-muted">
          Loading customer details...
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50/50 p-8 text-center py-20 text-danger-text">
          Customer not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50/50 p-8 text-gray-800">
        {/* Top Navigation */}
        <div className="mb-6">
          <Link href="/customers" className="text-xs text-gray-500 hover:text-brand-600 flex items-center gap-1">
            ← Back to Customers
          </Link>
        </div>

        {/* Header Profile */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-600 font-bold text-xl flex items-center justify-center uppercase">
              {customer.displayName ? customer.displayName.substring(0, 2) : 'NA'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{customer.displayName || 'Unknown'}</h1>
                <Badge variant={customer.status === 'ACTIVE' ? 'success' : 'neutral'}>
                  {customer.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Joined {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm">
              Add Note
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-sm">
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
                  ? 'border-brand-600 text-brand-600'
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
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(customer.metrics?.totalSpentMinor)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className="text-lg font-bold text-gray-900">{customer.metrics?.totalOrders || 0}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Average Order Value</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(customer.metrics?.totalOrders > 0 ? customer.metrics.totalSpentMinor / customer.metrics.totalOrders : 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Last Order Date</p>
                    <p className="text-lg font-bold text-gray-900">
                      {customer.metrics?.lastOrderDate ? new Date(customer.metrics.lastOrderDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Orders</h3>
                {isLoadingOrders ? (
                  <div className="text-xs text-gray-500">Loading orders...</div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-3">
                    {recentOrders.map((order: any) => (
                      <div key={order._id} className="flex justify-between items-center text-xs">
                        <Link href={`/orders/${order._id}`} className="font-bold text-brand-600 hover:underline">
                          {order.orderNumber || order._id}
                        </Link>
                        <span className="text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(order.totalMinor)}</span>
                        <Badge variant={order.status === 'DELIVERED' ? 'success' : 'warning'}>{order.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">No orders found for this customer.</div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3 text-xs text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-700 block">Email</span>
                    {customer.email ? (
                      <a href={`mailto:${customer.email}`} className="text-brand-600 hover:underline">{customer.email}</a>
                    ) : 'Not provided'}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 block">Phone</span>
                    {customer.phone ? (
                      <a href={`tel:${customer.phone}`} className="text-brand-600 hover:underline">{customer.phone}</a>
                    ) : 'Not provided'}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700 block">Marketing Consent</span>
                    <span className={customer.marketingConsent ? 'text-emerald-600 font-medium' : 'text-gray-500'}>
                      {customer.marketingConsent ? 'Subscribed' : 'Not Subscribed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Notes */}
        {activeTab === 'notes' && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Customer Notes</h3>
            <div className="space-y-4 max-w-2xl">
              {customer.notes && customer.notes.length > 0 ? (
                <div className="space-y-3">
                  {customer.notes.map((note: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg text-sm text-gray-800 border border-gray-100">
                      {note.content}
                      <div className="text-[10px] text-gray-500 mt-2 font-medium">
                        {new Date(note.createdAt || new Date()).toLocaleString()} {note.authorId ? 'by Staff' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic py-4">No notes added yet.</div>
              )}
              
              <form 
                className="pt-4 border-t border-gray-100 mt-6"
                onSubmit={async (e: any) => {
                  e.preventDefault();
                  const content = e.target.note.value;
                  if (!content.trim()) return;
                  try {
                    const res = await fetch(`/api/v1/customers/${customerId}/notes`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ content })
                    });
                    if (res.ok) {
                      e.target.reset();
                      const { mutate } = require('swr');
                      mutate(`/api/v1/customers/${customerId}`);
                    }
                  } catch (err) {
                    console.error('Failed to add note', err);
                  }
                }}
              >
                <textarea 
                  name="note"
                  placeholder="Add a new internal note..." 
                  className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-lg mb-3 focus:ring-2 focus:ring-brand-500 outline-none"
                  rows={3}
                />
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-sm">
                  Add Note
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {activeTab !== 'overview' && activeTab !== 'notes' && (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center py-20 text-gray-500">
            {activeTab} content coming soon.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
