'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ArrowLeft,
  Printer,
  Mail,
  Edit,
  ShoppingBag,
  CheckCircle2,
  Truck,
  Globe,
  User,
  Plus,
  MapPin,
  MessageSquare,
  RefreshCcw,
  Ban,
  DollarSign,
  Copy,
  Tag,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderDetailsPage() {
  const orderItems = [
    { name: 'Wireless Earbuds', variant: 'Black', sku: 'WE-001', price: 'PKR 4,500', qty: 1, total: 'PKR 4,500', image: 'WE' },
    { name: 'Smart Watch', variant: 'Black', sku: 'SW-002', price: 'PKR 4,200', qty: 1, total: 'PKR 4,200', image: 'SW' },
    { name: 'LED Desk Lamp', variant: 'White', sku: 'LDL-003', price: 'PKR 3,100', qty: 1, total: 'PKR 3,100', image: 'LL' },
  ];

  const timeline = [
    { title: 'Order Placed', time: 'Aug 28, 2026, 10:24 AM', desc: 'Customer placed the order', completed: true },
    { title: 'Payment Confirmed', time: 'Aug 28, 2026, 10:25 AM', desc: 'Payment received via JazzCash', completed: true },
    { title: 'Order Processing', time: 'Aug 28, 2026, 11:10 AM', desc: 'Items are being prepared', completed: true },
    { title: 'Shipped', time: 'Aug 29, 2026, 09:30 AM', desc: 'Order shipped via TCS', completed: true, action: 'View Tracking' },
    { title: 'Out for Delivery', time: 'Aug 30, 2026, 11:20 AM', desc: 'On the way to customer', completed: true },
    { title: 'Delivered', time: 'Aug 30, 2026, 04:15 PM', desc: 'Order delivered successfully', completed: true, isLast: true },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        {/* Header Navigation */}
        <div>
          <Link href="/orders" className="text-sm font-bold text-slate-500 hover:text-brand-600 flex items-center gap-1 w-fit mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                Order #SZ-7845 
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Delivered
                </span>
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">Placed on Aug 28, 2026 at 10:24 AM</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
                <Printer className="w-4 h-4 text-slate-500" /> Print Invoice
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
                <Mail className="w-4 h-4 text-slate-500" /> Send Email
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors">
                <Edit className="w-4 h-4" /> Edit Order
              </button>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Order Total</p>
              <div className="text-lg font-extrabold text-slate-900 leading-tight">PKR 12,450</div>
              <div className="text-[11px] text-slate-400 font-semibold mt-0.5">3 items</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Payment Status</p>
              <div className="text-lg font-extrabold text-emerald-600 leading-tight">Paid</div>
              <div className="text-[11px] text-slate-400 font-semibold mt-0.5">Aug 28, 2026, 10:25 AM</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Fulfillment Status</p>
              <div className="text-lg font-extrabold text-emerald-600 leading-tight">Delivered</div>
              <div className="text-[11px] text-slate-400 font-semibold mt-0.5">Aug 30, 2026, 04:15 PM</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Channel</p>
              <div className="text-lg font-extrabold text-slate-900 leading-tight">Website</div>
              <div className="text-[11px] text-slate-400 font-semibold mt-0.5">sellzy.com</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Customer Type</p>
              <div className="text-sm font-extrabold text-slate-900 leading-tight mt-1">Returning Customer</div>
              <div className="text-[11px] text-slate-400 font-semibold mt-0.5">5 previous orders</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex gap-8">
          <button className="pb-3 border-b-2 border-brand-600 text-brand-700 font-bold text-sm">Order Details</button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Payment & Invoice</button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Shipping & Tracking</button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Customer</button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Notes</button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Activity Log</button>
        </div>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Top Row: Order Items & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
              
              {/* Order Items */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 text-sm">Order Items</h3>
                  <button className="text-[11px] font-bold text-brand-600 hover:underline px-2 py-1 rounded bg-brand-50">Add Item</button>
                </div>
                
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">SKU</th>
                        <th className="px-4 py-3 text-right">Price</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orderItems.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0 border border-slate-200">
                              {item.image}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{item.name}</div>
                              <div className="text-[11px] font-semibold text-slate-500">{item.variant}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{item.sku}</span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-700">{item.price}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-900">{item.qty}</td>
                          <td className="px-4 py-3 text-right font-bold text-slate-900">{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Footer */}
                <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-500 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-brand-500" /> Discount (WELCOME10)
                      </span>
                      <span className="font-bold text-brand-600">- PKR 1,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-500">Subtotal</span>
                      <span className="font-bold text-slate-900">PKR 11,800</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-500">Shipping (Standard)</span>
                      <span className="font-bold text-slate-900">PKR 650</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                      <span className="font-semibold text-slate-500">Tax</span>
                      <span className="font-bold text-slate-900">PKR 0</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-extrabold text-brand-700 text-base">Total Amount</span>
                      <span className="font-extrabold text-brand-700 text-xl">PKR 12,450</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Order Timeline</h3>
                  <button className="text-[11px] font-bold text-brand-600 hover:underline">View All</button>
                </div>
                
                <div className="relative pl-3 flex-1 overflow-y-auto">
                  {/* Vertical Line */}
                  <div className="absolute left-4 top-2 bottom-6 w-0.5 bg-slate-100"></div>
                  
                  <div className="space-y-4">
                    {timeline.map((step, i) => (
                      <div key={i} className="relative pl-6">
                        <div className={`absolute left-[-5px] top-1 w-3 h-3 rounded-full border-2 border-white ${step.completed ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className={`text-sm font-bold ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>{step.title}</div>
                            <div className="text-[11px] font-medium text-slate-500 mt-0.5">{step.desc}</div>
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 text-right shrink-0 whitespace-nowrap ml-2">
                            {step.time.split(',')[0]}<br/>{step.time.split(',')[1]}
                          </div>
                        </div>
                        {step.action && (
                          <button className="mt-1.5 px-2 py-0.5 border border-slate-200 text-slate-600 rounded text-[10px] font-bold hover:bg-slate-50 transition-colors bg-white z-10 relative">
                            {step.action}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Payment Info & Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Payment Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Payment Information</h3>
                  <button className="text-[11px] font-bold text-brand-600 hover:underline bg-brand-50 px-2 py-1 rounded">Invoice</button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-500">Payment Method</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <div className="w-5 h-3 bg-orange-500 rounded-sm"></div> JazzCash
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-500">Transaction ID</span>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 flex items-center gap-1">
                      JC785236541 <Copy className="w-3 h-3 text-slate-400 cursor-pointer" />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-500">Payment Date</span>
                    <span className="font-bold text-slate-900">Aug 28, 2026, 10:25 AM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-500">Payment Status</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Paid
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-500">Amount Paid</span>
                    <span className="font-extrabold text-slate-900">PKR 12,450</span>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col h-[230px]">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 shrink-0">
                  <h3 className="font-bold text-slate-900 text-sm">Order Notes</h3>
                  <button className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors">Add Note</button>
                </div>
                
                <div className="space-y-4 overflow-y-auto pr-2 flex-1">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold shrink-0">AM</div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-slate-900">Arif Mahmood</span>
                        <span className="text-[10px] font-medium text-slate-400">Aug 28, 2026, 11:15 AM</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium mt-0.5">Customer requested fast delivery.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold shrink-0">SK</div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-slate-900">Sara Khan</span>
                        <span className="text-[10px] font-medium text-slate-400">Aug 29, 2026, 09:45 AM</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium mt-0.5">Order shipped via TCS. Tracking number shared with customer.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold shrink-0">AM</div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-slate-900">Arif Mahmood</span>
                        <span className="text-[10px] font-medium text-slate-400">Aug 30, 2026, 04:20 PM</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium mt-0.5">Order delivered successfully.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column - Context Panels */}
          <div className="space-y-4">
            
            {/* Customer Information */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Customer Information</h3>
                <Link href="/customers/1" className="text-[11px] font-bold text-brand-600 hover:underline px-2 py-1 rounded bg-brand-50">View Customer</Link>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  SA
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">Sana Ahmed</h4>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-0.5 border border-emerald-200">
                      VIP
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> sana.ahmed@gmail.com
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> +92 300 1234567
                  </div>
                  <div className="flex items-start gap-2 text-xs font-semibold text-slate-500 pt-1">
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" /> 5 previous orders
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Shipping Address</h3>
                <button className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors">Edit</button>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-sm font-semibold text-slate-700 leading-relaxed pr-8 relative w-full">
                  <div className="font-bold text-slate-900">Sana Ahmed</div>
                  House # 123, Street 5<br/>
                  DHA Phase 2<br/>
                  Lahore, Punjab 54000<br/>
                  Pakistan
                  <button className="absolute top-0 right-0 p-1.5 text-slate-400 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 border border-slate-200 rounded transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Shipping Details</h3>
                <button className="text-[11px] font-bold text-brand-600 hover:underline px-2 py-1 rounded bg-brand-50">Track Order</button>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-500">Courier</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-red-600 italic font-black text-xs tracking-tighter">TCS</span> TCS
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-500">Tracking Number</span>
                  <span className="font-mono text-xs font-bold text-brand-600 hover:underline cursor-pointer">TCS785236541</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-500">Service Type</span>
                  <span className="font-bold text-slate-900">Standard (2-3 days)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-500">Shipped On</span>
                  <span className="font-bold text-slate-900">Aug 29, 09:30 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-500">Delivered On</span>
                  <span className="font-bold text-slate-900">Aug 30, 04:15 PM</span>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Order Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2.5 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors flex justify-center items-center gap-2">
                  <Mail className="w-4 h-4" /> Send Email
                </button>
                <button className="py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                  <Printer className="w-4 h-4 text-slate-500" /> Print Invoice
                </button>
                <button className="py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                  <RefreshCcw className="w-4 h-4 text-slate-500" /> Create Return
                </button>
                <button className="py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-500" /> Issue Refund
                </button>
                <button className="col-span-2 py-2.5 mt-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold shadow-sm hover:bg-red-100 transition-colors flex justify-center items-center gap-2">
                  <Ban className="w-4 h-4" /> Cancel Order
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
