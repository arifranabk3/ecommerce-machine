'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus, Trash2, ShoppingBag, User, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function NewOrderPage() {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [source, setSource] = useState('MANUAL');
  const [locationId, setLocationId] = useState('loc_wh1');

  const [items, setItems] = useState([
    { productId: 'prod_1', name: 'Wireless Ergonomic Keyboard', sku: 'KB-WL-001', quantity: 1, unitPriceMinor: 12999 }
  ]);

  const subtotalMinor = items.reduce((sum, item) => sum + item.unitPriceMinor * item.quantity, 0);
  const shippingMinor = 1500; // $15.00
  const taxMinor = Math.round(subtotalMinor * 0.1); // 10%
  const totalMinor = subtotalMinor + shippingMinor + taxMinor;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Manual Order</h1>
            <p className="text-sm text-slate-500 mt-0.5">Build a backend order with automatic server pricing and inventory reservation</p>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Customer & Location */}
          <Card className="p-6 space-y-4">
            <h2 className="text-md font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" /> Customer & Channel Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="PREPAID">Prepaid Card / Gateway</option>
                  <option value="OTHER">Other / Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Order Source Channel</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="MANUAL">Manual Admin Entry</option>
                  <option value="WHATSAPP">WhatsApp Business</option>
                  <option value="WEBSITE">Website</option>
                  <option value="API">API Integration</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Fulfillment Location *</label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="loc_wh1">Main Warehouse (Location 1)</option>
                  <option value="loc_wh2">Secondary Store (Location 2)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Items Selector */}
          <Card className="p-6 space-y-4">
            <h2 className="text-md font-semibold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-600" /> Order Items & Quantities
            </h2>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-400 font-mono">SKU: {item.sku}</div>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value, 10) || 1;
                        setItems(items.map((it, i) => i === idx ? { ...it, quantity: newQty } : it));
                      }}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-center text-sm"
                    />
                  </div>
                  <div className="w-28 text-right font-semibold text-sm text-slate-900">
                    ${((item.unitPriceMinor * item.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full py-2 border-dashed flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Item from Catalog
            </Button>
          </Card>

          {/* Summary & Submit */}
          <Card className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-sm">
              <div className="text-slate-500">
                Subtotal: <span className="font-medium text-slate-800">${(subtotalMinor / 100).toFixed(2)}</span> | Tax: <span className="font-medium text-slate-800">${(taxMinor / 100).toFixed(2)}</span>
              </div>
              <div className="text-lg font-bold text-slate-900">
                Total Amount: <span className="text-brand-900">${(totalMinor / 100).toFixed(2)}</span>
              </div>
            </div>
            <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
              <CheckCircle2 className="w-5 h-5 mr-2" /> Place & Confirm Order
            </Button>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
