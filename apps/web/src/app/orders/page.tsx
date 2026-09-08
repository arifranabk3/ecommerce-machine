'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ChevronDown, 
  Plus, 
  Search, 
  Filter, 
  Box, 
  FileText,
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  MoreHorizontal,
  Calendar,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const tabs = [
    { name: 'All Orders', active: true },
    { name: 'New', active: false },
    { name: 'Processing', active: false },
    { name: 'Vendor Assigned', active: false },
    { name: 'Shipped', active: false },
    { name: 'Delivered', active: false },
    { name: 'RTO', active: false },
    { name: 'Cancelled', active: false },
  ];

  const kpis = [
    { title: 'Total Orders', value: '7,037', change: '+8.2%', color: 'text-slate-600', bg: 'bg-slate-100', icon: Box, changeColor: 'text-emerald-500' },
    { title: 'New Orders', value: '128', change: '+12.5%', color: 'text-blue-600', bg: 'bg-blue-100', icon: FileText, changeColor: 'text-emerald-500' },
    { title: 'Processing', value: '246', change: '+6.1%', color: 'text-orange-600', bg: 'bg-orange-100', icon: Clock, changeColor: 'text-emerald-500' },
    { title: 'Shipped', value: '1,842', change: '+10.3%', color: 'text-purple-600', bg: 'bg-purple-100', icon: Truck, changeColor: 'text-emerald-500' },
    { title: 'Delivered', value: '4,512', change: '+9.7%', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle2, changeColor: 'text-emerald-500' },
    { title: 'RTO', value: '186', change: '+2.1%', color: 'text-red-600', bg: 'bg-red-100', icon: RotateCcw, changeColor: 'text-red-500' },
    { title: 'Cancelled', value: '123', change: '+1.4%', color: 'text-red-600', bg: 'bg-red-100', icon: XCircle, changeColor: 'text-red-500' },
  ];

  const orders = [
    { id: 'SZ-10482', customer: 'Ali Khan', phone: '+92 300 1234567', product: 'Wireless Earbuds', items: '1 item', amount: 'PKR 2,499', payment: 'COD', status: 'Delivered', vendor: 'HHC Dropshipping', courier: 'Leopards', date: 'Sep 4, 2026', time: '10:24 AM' },
    { id: 'SZ-10481', customer: 'Sara Ahmed', phone: '+92 301 9876543', product: 'Smart Watch Pro', items: '1 item', amount: 'PKR 3,199', payment: 'Card', status: 'Shipped', vendor: 'Markaz App', courier: 'TCS', date: 'Sep 4, 2026', time: '09:48 AM' },
    { id: 'SZ-10480', customer: 'Usman Raza', phone: '+92 333 1122334', product: 'Air Purifier', items: '1 item', amount: 'PKR 1,899', payment: 'COD', status: 'Processing', vendor: 'Local Vendor', courier: 'M&P', date: 'Sep 4, 2026', time: '09:12 AM' },
    { id: 'SZ-10479', customer: 'Ayesha Noor', phone: '+92 321 7654321', product: 'Neck Massager', items: '2 items', amount: 'PKR 2,299', payment: 'COD', status: 'Delivered', vendor: 'HHC Dropshipping', courier: 'Leopards', date: 'Sep 4, 2026', time: '08:46 AM' },
    { id: 'SZ-10478', customer: 'Hamza Ali', phone: '+92 300 4567890', product: 'LED Ring Light', items: '1 item', amount: 'PKR 1,999', payment: 'JazzCash', status: 'Shipped', vendor: 'Markaz App', courier: 'BlueEx', date: 'Sep 4, 2026', time: '08:33 AM' },
    { id: 'SZ-10477', customer: 'Fatima Malik', phone: '+92 302 3344556', product: 'Hair Dryer', items: '3 items', extra: '+2 more', amount: 'PKR 4,799', payment: 'COD', status: 'New', vendor: 'Local Vendor', courier: 'M&P', date: 'Sep 4, 2026', time: '07:58 AM' },
    { id: 'SZ-10476', customer: 'Bilal Hussain', phone: '+92 322 9988776', product: 'Sneakers', items: '1 item', amount: 'PKR 3,499', payment: 'Card', status: 'Processing', vendor: 'HHC Dropshipping', courier: 'TCS', date: 'Sep 3, 2026', time: '11:12 PM' },
    { id: 'SZ-10475', customer: 'Zainab Tariq', phone: '+92 334 6677889', product: 'Backpack', items: '1 item', amount: 'PKR 2,199', payment: 'Easypaisa', status: 'Shipped', vendor: 'Markaz App', courier: 'Leopards', date: 'Sep 3, 2026', time: '10:41 PM' },
    { id: 'SZ-10474', customer: 'Hassan Raza', phone: '+92 311 4455667', product: 'T-shirt', items: '2 items', extra: '+1 more', amount: 'PKR 2,799', payment: 'COD', status: 'Delivered', vendor: 'Local Vendor', courier: 'BlueEx', date: 'Sep 3, 2026', time: '09:22 PM' },
    { id: 'SZ-10473', customer: 'Iqra Saleem', phone: '+92 305 7766554', product: 'Skin Care Set', items: '1 item', amount: 'PKR 5,299', payment: 'Card', status: 'Cancelled', vendor: 'HHC Dropshipping', courier: 'TCS', date: 'Sep 3, 2026', time: '08:11 PM' },
  ];

  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case 'COD': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'Card': return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'JazzCash': return 'text-purple-600 border-purple-200 bg-purple-50';
      case 'Easypaisa': return 'text-red-600 border-red-200 bg-red-50';
      default: return 'text-slate-600 border-slate-200 bg-slate-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-orange-100 text-orange-700';
      case 'New': return 'bg-slate-200 text-slate-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage and track all your orders in one place.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors">
            <Plus className="w-4 h-4" />
            Create Order
            <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`
                  whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors
                  ${tab.active 
                    ? 'border-brand-600 text-brand-700' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* KPI Cards */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1 min-w-[160px] flex gap-4 items-center">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-0.5">{kpi.title}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-slate-900">{kpi.value}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`text-[10px] font-bold ${kpi.changeColor}`}>↑ {kpi.change}</span>
                  {i === 0 && <span className="text-[10px] text-slate-400 font-semibold">vs last month</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2 items-center">
          <div className="relative w-full md:flex-1 md:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search orders by ID, customer, phone..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
            <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 whitespace-nowrap hover:bg-slate-50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                Sep 1, 2026 - Sep 4, 2026
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 whitespace-nowrap hover:bg-slate-50">
              All Status <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 whitespace-nowrap hover:bg-slate-50">
              All Payment Methods <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 whitespace-nowrap hover:bg-slate-50">
              All Couriers <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 whitespace-nowrap hover:bg-slate-50">
              All Vendors <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-200 ml-auto shrink-0">
            <button className="flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button className="text-sm font-bold text-brand-600 hover:underline">
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white border-b border-slate-200 text-xs font-bold text-slate-500">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                  </th>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Product(s)</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Courier</th>
                  <th className="px-4 py-3">Order Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{ord.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{ord.customer}</div>
                      <div className="text-[11px] font-semibold text-slate-400">{ord.phone}</div>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-700 flex items-center gap-1">
                          {ord.product}
                          {ord.extra && <span className="text-[10px] font-semibold text-slate-400">{ord.extra}</span>}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-400">{ord.items}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-extrabold text-slate-900">{ord.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPaymentBadge(ord.payment)}`}>
                        {ord.payment}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-600">{ord.vendor}</td>
                    <td className="px-4 py-3 font-semibold text-slate-600">{ord.courier}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-700">{ord.date}</div>
                      <div className="text-[11px] font-semibold text-slate-400">{ord.time}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-semibold text-slate-500">
              Showing 1 to 10 of 7,037 results
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                10 per page <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <nav className="flex items-center gap-1">
                <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-100 disabled:opacity-50" disabled>&lt;</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-sm">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-sm">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-sm">4</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-sm">5</button>
                <span className="text-slate-400 px-1">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-sm">704</button>
                <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-100">&gt;</button>
              </nav>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
