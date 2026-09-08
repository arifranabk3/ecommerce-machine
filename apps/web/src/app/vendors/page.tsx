'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Tag,
  CreditCard,
  FileText,
  UserCircle
} from 'lucide-react';
import Link from 'next/link';

export default function VendorsPage() {
  const kpis = [
    { title: 'Total Vendors', value: '42', change: '+2', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: Truck, changeColor: 'text-emerald-500', subtitle: 'new this month' },
    { title: 'Active Vendors', value: '38', change: '90%', color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircle2, changeColor: 'text-blue-500', subtitle: 'of total' },
    { title: 'Pending Payouts', value: 'PKR 450k', change: '12', color: 'text-orange-600', bg: 'bg-orange-100', icon: Clock, changeColor: 'text-slate-500', subtitle: 'vendors waiting' },
    { title: 'Avg. Fulfillment', value: '2.4 days', change: '-12%', color: 'text-purple-600', bg: 'bg-purple-100', icon: Package, changeColor: 'text-emerald-500', subtitle: 'vs last month' },
  ];

  const vendors = [
    { id: 1, name: 'Tech Source', email: 'tech@source.com', phone: '+92 300 1111111', products: 142, orders: '1,240', fulfillment: '98%', fulfillmentColor: 'text-emerald-600', outstanding: 'PKR 125,000', status: 'Active', avatar: 'TS', bg: 'bg-blue-600' },
    { id: 2, name: 'Home Essentials', email: 'hello@home.com', phone: '+92 301 2222222', products: 85, orders: '840', fulfillment: '94%', fulfillmentColor: 'text-emerald-600', outstanding: 'PKR 45,000', status: 'Active', avatar: 'HE', bg: 'bg-emerald-600' },
    { id: 3, name: 'Mobile World', email: 'sales@mobile.com', phone: '+92 333 3333333', products: 210, orders: '2,100', fulfillment: '88%', fulfillmentColor: 'text-orange-600', outstanding: 'PKR 210,000', status: 'Active', avatar: 'MW', bg: 'bg-purple-600' },
    { id: 4, name: 'Style Hub', email: 'contact@style.com', phone: '+92 321 4444444', products: 45, orders: '120', fulfillment: '75%', fulfillmentColor: 'text-red-600', outstanding: 'PKR 0', status: 'Inactive', avatar: 'SH', bg: 'bg-slate-400' },
    { id: 5, name: 'Mega Electronics', email: 'info@mega.com', phone: '+92 300 5555555', products: 320, orders: '4,500', fulfillment: '99%', fulfillmentColor: 'text-emerald-600', outstanding: 'PKR 550,000', status: 'Active', avatar: 'ME', bg: 'bg-orange-500' },
    { id: 6, name: 'Fashion Plus', email: 'sales@fashionplus.pk', phone: '+92 302 6666666', products: 110, orders: '950', fulfillment: '92%', fulfillmentColor: 'text-emerald-600', outstanding: 'PKR 85,000', status: 'Active', avatar: 'FP', bg: 'bg-pink-500' },
    { id: 7, name: 'Kitchen King', email: 'orders@kitchenking.pk', phone: '+92 345 7777777', products: 65, orders: '420', fulfillment: '95%', fulfillmentColor: 'text-emerald-600', outstanding: 'PKR 32,000', status: 'Active', avatar: 'KK', bg: 'bg-indigo-500' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vendors</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage your suppliers, payouts, and performance metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Vendor
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-0.5">{kpi.title}</p>
                <div className="text-2xl font-extrabold text-slate-900 leading-tight">{kpi.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-[11px] font-bold ${kpi.changeColor}`}>{kpi.change}</span>
                  <span className="text-[11px] text-slate-400 font-semibold">{kpi.subtitle}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
          
          {/* Left Column - Table */}
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2 items-center">
              <div className="relative w-full md:flex-1 md:max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                  All Status <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                  All Categories <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                  Sort by: Performance <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Filter className="w-4 h-4" />
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
                      <th className="px-4 py-3">Vendor</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3 text-center">Products</th>
                      <th className="px-4 py-3 text-center">Total Orders</th>
                      <th className="px-4 py-3">Fulfillment Rate</th>
                      <th className="px-4 py-3">Outstanding</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vendors.map((v, i) => (
                      <tr key={i} className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${i === 0 ? 'bg-slate-50/50' : ''}`}>
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                        </td>
                        <td className="px-4 py-3 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 ${v.bg}`}>
                            {v.avatar}
                          </div>
                          <div className="font-bold text-slate-900">{v.name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-700">{v.email}</div>
                          <div className="text-[11px] font-semibold text-slate-400">{v.phone}</div>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 text-center">{v.products}</td>
                        <td className="px-4 py-3 font-semibold text-slate-600 text-center">{v.orders}</td>
                        <td className="px-4 py-3">
                          <div className={`font-bold ${v.fulfillmentColor}`}>{v.fulfillment}</div>
                        </td>
                        <td className="px-4 py-3 font-extrabold text-slate-900">{v.outstanding}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${v.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {v.status}
                          </span>
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
              
              {/* Pagination */}
              <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm font-semibold text-slate-500">
                  Showing 1 to 7 of 42 vendors
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
                    <span className="text-slate-400 px-1">...</span>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-sm">5</button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-100">&gt;</button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Vendor Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                  TS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">Tech Source</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Active</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 mt-0.5">Since Jan 2024</p>
                </div>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Tabs */}
            <div className="border-b border-slate-200 mt-6 flex gap-6">
              <button className="pb-3 border-b-2 border-brand-600 text-brand-700 font-bold text-sm">Overview</button>
              <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Products</button>
              <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Ledger</button>
              <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Settings</button>
            </div>

            {/* Info Details */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <Phone className="w-4 h-4 text-slate-400" /> +92 300 1111111
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <Mail className="w-4 h-4 text-slate-400" /> tech@source.com
              </div>
              <div className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> 
                <span>Warehouse 4, Korangi Industrial Area,<br/>Karachi, Pakistan</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-brand-600 hover:underline cursor-pointer">
                <LinkIcon className="w-4 h-4 text-slate-400" /> techsource.com
              </div>
            </div>

            {/* Tags section */}
            <div className="mt-5 flex items-center gap-3">
              <Tag className="w-4 h-4 text-slate-400" />
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold">
                  Electronics
                </span>
                <span className="px-2 py-1 rounded bg-orange-50 text-orange-600 border border-orange-200 text-xs font-bold">
                  Premium
                </span>
                <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold">
                  Fast Shipping
                </span>
              </div>
            </div>

            {/* Stats Block */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-xl font-extrabold text-slate-900">142</div>
                <div className="text-[11px] font-bold text-slate-500 mt-1">Active Products</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-xl font-extrabold text-emerald-600">98%</div>
                <div className="text-[11px] font-bold text-slate-500 mt-1">Fulfillment Rate</div>
              </div>
              <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl">
                <div className="text-sm font-extrabold text-brand-700">PKR 125k</div>
                <div className="text-[11px] font-bold text-brand-600/80 mt-1">Pending Payout</div>
              </div>
            </div>

            {/* Performance Block */}
            <div className="mt-6 border border-slate-100 rounded-xl p-4 bg-white shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Performance Score <span className="text-emerald-600">9.4/10</span></h3>
              <div className="flex gap-4 items-center">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-500" strokeDasharray="94, 100" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-extrabold text-slate-900">94%</span>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-500">Orders Completed</span>
                    <span className="font-bold text-slate-900">1,215</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-500">Returns/RTO</span>
                    <span className="font-bold text-red-600">25 (2%)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-500">Late Shipments</span>
                    <span className="font-bold text-orange-600">12 (1%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Payouts */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Recent Payouts</h3>
                <Link href="#" className="text-brand-600 text-[11px] font-bold hover:underline flex items-center gap-1">
                  View Ledger &rarr;
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white border border-slate-100 p-2.5 rounded-lg shadow-sm">
                  <div>
                    <div className="font-bold text-sm text-slate-900">TXN-8942</div>
                    <div className="text-xs font-semibold text-slate-500">Sep 1, 2026</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-slate-900">PKR 45,000</div>
                    <span className="text-[10px] font-bold text-emerald-600">Completed</span>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-white border border-slate-100 p-2.5 rounded-lg shadow-sm">
                  <div>
                    <div className="font-bold text-sm text-slate-900">TXN-8810</div>
                    <div className="text-xs font-semibold text-slate-500">Aug 15, 2026</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-slate-900">PKR 52,000</div>
                    <span className="text-[10px] font-bold text-emerald-600">Completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Actions */}
            <div className="mt-6 space-y-2">
              <button className="w-full py-2.5 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors flex justify-center items-center gap-2">
                <CreditCard className="w-4 h-4" /> Make Payment
              </button>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/vendors/1/ledger" className="py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" /> View Ledger
                </Link>
                <button className="py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                  <UserCircle className="w-4 h-4 text-slate-400" /> Edit Profile
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
