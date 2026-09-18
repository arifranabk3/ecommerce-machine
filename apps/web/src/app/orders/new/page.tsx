'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApiMutation, useApiQuery } from '@/lib/api-client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus, Trash2, ShoppingBag, User, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function NewOrderPage() {
  const router = useRouter();

  // Customer State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [source, setSource] = useState('MANUAL');
  const [locationId, setLocationId] = useState('loc_wh1');

  // Items State
  const [items, setItems] = useState<any[]>([]);

  // Search State for Products
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults, isLoading: isSearching } = useApiQuery<any>(
    searchQuery ? `/api/v1/products?search=${searchQuery}&limit=5` : null
  );

  const { trigger: createOrder, isMutating, error } = useApiMutation<any, any>('/api/v1/orders');

  const handleAddItem = (product: any) => {
    // Basic deduplication
    if (items.find((item) => item.productId === product._id)) {
      return;
    }

    setItems([
      ...items,
      {
        productId: product._id,
        name: product.name,
        sku: product.sku,
        quantity: 1,
        unitPriceMinor: product.sellingPrice,
      }
    ]);
    setSearchQuery('');
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateQuantity = (idx: number, qty: number) => {
    if (qty < 1) return;
    const newItems = [...items];
    newItems[idx].quantity = qty;
    setItems(newItems);
  };

  // Pricing calculation (Client-side estimate only - backend is authoritative)
  const subtotalMinor = items.reduce((sum, item) => sum + (item.unitPriceMinor || 0) * item.quantity, 0);
  const shippingMinor = 0; 
  const taxMinor = Math.round(subtotalMinor * 0.1); // Estimated 10% tax
  const totalMinor = subtotalMinor + shippingMinor + taxMinor;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }
    if (!customerName) {
      alert('Customer name is required');
      return;
    }
    if (!locationId) {
      alert('Fulfillment location is required');
      return;
    }

    try {
      const orderPayload = {
        source,
        paymentMethod,
        warehouseId: locationId,
        customerSnapshot: {
          name: customerName,
          email: customerEmail || '',
          phone: customerPhone || undefined,
        },
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPriceMinor: item.unitPriceMinor
        })),
        shippingMinor: shippingMinor,
      };

      const res = await createOrder({
        method: 'POST',
        body: orderPayload
      });

      if (res && res.order) {
        router.push(`/orders/${res.order._id}`);
      } else {
        router.push('/orders');
      }
    } catch (err) {
      console.error('Failed to create order', err);
    }
  };

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

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error.message || 'Failed to create order'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products to add..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              
              {searchQuery && searchResults?.items && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-sm text-slate-500">Searching...</div>
                  ) : searchResults.items.length === 0 ? (
                    <div className="p-3 text-sm text-slate-500">No products found</div>
                  ) : (
                    searchResults.items.map((prod: any) => (
                      <div 
                        key={prod._id} 
                        onClick={() => handleAddItem(prod)}
                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium text-sm text-slate-900">{prod.name}</div>
                          <div className="text-xs text-slate-500">SKU: {prod.sku}</div>
                        </div>
                        <div className="font-medium text-sm">
                          ${(prod.sellingPrice / 100).toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3 mt-4">
              {items.length === 0 && (
                <div className="text-center py-6 text-sm text-slate-500 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                  No items added yet. Search above to add products.
                </div>
              )}
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
                      onChange={(e) => updateQuantity(idx, parseInt(e.target.value, 10))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-center text-sm"
                    />
                  </div>
                  <div className="w-28 text-right font-semibold text-sm text-slate-900">
                    ${((item.unitPriceMinor * item.quantity) / 100).toFixed(2)}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeItem(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Summary & Submit */}
          <Card className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-sm">
              <div className="text-slate-500">
                Subtotal: <span className="font-medium text-slate-800">${(subtotalMinor / 100).toFixed(2)}</span> | Est. Tax: <span className="font-medium text-slate-800">${(taxMinor / 100).toFixed(2)}</span>
              </div>
              <div className="text-lg font-bold text-slate-900">
                Est. Total Amount: <span className="text-brand-900">${(totalMinor / 100).toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-400 italic">Final pricing will be securely calculated by the backend.</p>
            </div>
            <Button variant="primary" size="lg" type="submit" disabled={isMutating} className="w-full sm:w-auto px-8">
              <CheckCircle2 className="w-5 h-5 mr-2" /> {isMutating ? 'Placing Order...' : 'Place & Confirm Order'}
            </Button>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
