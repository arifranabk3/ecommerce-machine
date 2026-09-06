'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, DollarSign, Tag, Layers, Truck } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);

  const marginAmount = Math.max(0, sellingPrice - costPrice);
  const marginPercentage = sellingPrice > 0 ? ((marginAmount / sellingPrice) * 100).toFixed(2) : '0';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-brand-900">Create New Product</h1>
              <p className="text-xs text-slate-500">Define product details, SKUs, pricing, and supplier mappings</p>
            </div>
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Product
          </Button>
        </div>

        {/* Form Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-brand-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-600" /> Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Ergonomic Wireless Mouse"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">SKU Code</label>
                    <input
                      type="text"
                      placeholder="MS-ERG-01"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Barcode / EAN</label>
                    <input
                      type="text"
                      placeholder="890123456789"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    placeholder="Detailed item description..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  ></textarea>
                </div>
              </div>
            </Card>

            {/* Financials & Margins */}
            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-brand-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Cost & Pricing (Integer Minor Units / Cents)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Cost Price (Rs)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Selling Price (Rs)</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Realtime Calculated Margin Display */}
              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Calculated Gross Margin</span>
                  <div className="text-sm font-bold text-emerald-700">Rs. {marginAmount.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium">Margin Percentage</span>
                  <div className="text-sm font-bold text-emerald-700">{marginPercentage}%</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Config */}
          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-brand-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" /> Catalog Settings
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none">
                    <option value="SIMPLE">Simple Product</option>
                    <option value="VARIABLE">Variable Product</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-brand-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-600" /> Supplier Mapping
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Supplier SKU"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Supplier Cost (Rs)"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
