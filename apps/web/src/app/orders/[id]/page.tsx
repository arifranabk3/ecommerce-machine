'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, CheckCircle2, Clock, Truck, XCircle, PauseCircle, Send, Package, User, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [noteText, setNoteText] = useState('');

  const order = {
    id: params.id,
    orderNumber: 'SZ-2026-000001',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    fulfillmentStatus: 'PENDING',
    source: 'WEBSITE',
    paymentMethod: 'PREPAID',
    currency: 'USD',
    subtotalMinor: 25998,
    discountMinor: 0,
    shippingMinor: 1500,
    taxMinor: 2600,
    totalMinor: 30098,
    customerSnapshot: {
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 234-5678'
    },
    shippingAddressSnapshot: {
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62701',
      country: 'USA'
    },
    items: [
      {
        id: 'item_1',
        productNameSnapshot: 'Wireless Ergonomic Keyboard',
        skuSnapshot: 'KB-WL-001',
        quantity: 2,
        unitPriceMinor: 12999,
        lineTotalMinor: 25998
      }
    ],
    timeline: [
      { id: 'tl_1', event: 'ORDER_CREATED', actor: 'SYSTEM', timestamp: '2026-09-05 14:00:00' },
      { id: 'tl_2', event: 'INVENTORY_RESERVED', actor: 'SYSTEM', timestamp: '2026-09-05 14:00:01' },
      { id: 'tl_3', event: 'ORDER_CONFIRMED', actor: 'Admin User', timestamp: '2026-09-05 14:05:00' }
    ],
    notes: [
      { id: 'n_1', author: 'Support Team', content: 'Customer requested gift wrapping.', createdAt: '2026-09-05 14:02' }
    ]
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/orders">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Orders
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                {order.orderNumber}
                <Badge variant="success">Confirmed</Badge>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Placed on 2026-09-05 • Source: {order.source}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-amber-600 border-amber-200 hover:bg-amber-50">
              <PauseCircle className="w-4 h-4 mr-1.5" /> Hold Order
            </Button>
            <Button variant="outline" size="sm" className="text-rose-600 border-rose-200 hover:bg-rose-50">
              <XCircle className="w-4 h-4 mr-1.5" /> Cancel Order
            </Button>
            <Button variant="primary" size="sm">
              <Truck className="w-4 h-4 mr-1.5" /> Fulfill Order
            </Button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Main Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Line Items Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-600" /> Order Items Snapshot
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Item / SKU</th>
                      <th className="py-2.5 px-3">Unit Price</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-900">{item.productNameSnapshot}</div>
                          <div className="text-xs font-mono text-slate-400">SKU: {item.skuSnapshot}</div>
                        </td>
                        <td className="py-3 px-3">${(item.unitPriceMinor / 100).toFixed(2)}</td>
                        <td className="py-3 px-3">{item.quantity}</td>
                        <td className="py-3 px-3 text-right font-semibold text-slate-900">
                          ${(item.lineTotalMinor / 100).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="mt-6 border-t border-slate-100 pt-4 space-y-2 text-sm text-slate-600 max-w-xs ml-auto">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-slate-900">${(order.subtotalMinor / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className="font-medium text-slate-900">${(order.shippingMinor / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-medium text-slate-900">${(order.taxMinor / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-brand-900">${(order.totalMinor / 100).toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Timeline Activity Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" /> Immutable Activity Timeline
              </h2>
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                {order.timeline.map((evt) => (
                  <div key={evt.id} className="flex items-start gap-4 relative">
                    <div className="w-6 h-6 rounded-full bg-brand-100 border-2 border-brand-500 flex items-center justify-center text-brand-700 z-10">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{evt.event}</p>
                      <p className="text-xs text-slate-400">
                        {evt.timestamp} • Actor: {evt.actor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            {/* Customer Details Card */}
            <Card className="p-6 space-y-4">
              <h2 className="text-md font-semibold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600" /> Customer Information
              </h2>
              <div className="text-sm space-y-1">
                <div className="font-medium text-slate-900">{order.customerSnapshot.name}</div>
                <div className="text-slate-500">{order.customerSnapshot.email}</div>
                <div className="text-slate-500">{order.customerSnapshot.phone}</div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Shipping Address
                </h3>
                <div className="text-xs text-slate-600 leading-relaxed">
                  {order.shippingAddressSnapshot.street}<br />
                  {order.shippingAddressSnapshot.city}, {order.shippingAddressSnapshot.state} {order.shippingAddressSnapshot.postalCode}<br />
                  {order.shippingAddressSnapshot.country}
                </div>
              </div>
            </Card>

            {/* Internal Notes Card */}
            <Card className="p-6 space-y-4">
              <h2 className="text-md font-semibold text-slate-900">Internal Notes</h2>
              <div className="space-y-3">
                {order.notes.map((n) => (
                  <div key={n.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                    <div className="font-medium text-slate-800">{n.content}</div>
                    <div className="text-slate-400">{n.author} • {n.createdAt}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add internal note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <Button variant="outline" size="sm">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
