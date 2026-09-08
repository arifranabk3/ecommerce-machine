'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown,
  Upload,
  Download,
  User,
  Crown,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  MessageSquare,
  FileText,
  UserCircle
} from 'lucide-react';
import Image from 'next/image';

export default function CustomersPage() {
  const kpis = [
    { title: 'Total Customers', value: '2,843', change: '+12.4%', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: User, changeColor: 'text-emerald-500', subtitle: 'vs last month' },
    { title: 'New Customers', value: '186', change: '+18.2%', color: 'text-blue-600', bg: 'bg-blue-100', icon: User, changeColor: 'text-emerald-500', subtitle: 'vs last month' },
    { title: 'Repeat Customers', value: '1,048', change: '36.8%', color: 'text-purple-600', bg: 'bg-purple-100', icon: User, changeColor: 'text-emerald-500', subtitle: 'of total' },
    { title: 'VIP Customers', value: '86', change: '3.0%', color: 'text-orange-600', bg: 'bg-orange-100', icon: Crown, changeColor: 'text-emerald-500', subtitle: 'of total' },
  ];

  const customers = [
    { id: 1, name: 'Ali Khan', email: 'ali.khan@email.com', phone: '+92 300 1234567', orders: 12, spent: 'PKR 24,980', lastOrder: 'Sep 4, 2026', status: 'Active', tag: 'VIP', avatar: 'AK' },
    { id: 2, name: 'Sara Ahmed', email: 'sara.ahmed@email.com', phone: '+92 301 9876543', orders: 8, spent: 'PKR 16,450', lastOrder: 'Sep 3, 2026', status: 'Active', tag: 'Repeat', avatar: 'SA' },
    { id: 3, name: 'Usman Raza', email: 'usman.raza@email.com', phone: '+92 333 1122334', orders: 5, spent: 'PKR 9,990', lastOrder: 'Sep 3, 2026', status: 'Active', tag: 'New', avatar: 'UR' },
    { id: 4, name: 'Ayesha Noor', email: 'ayesha.noor@email.com', phone: '+92 321 7654321', orders: 14, spent: 'PKR 32,450', lastOrder: 'Sep 4, 2026', status: 'Active', tag: 'VIP', avatar: 'AN' },
    { id: 5, name: 'Hamza Ali', email: 'hamza.ali@email.com', phone: '+92 300 4567890', orders: 3, spent: 'PKR 4,990', lastOrder: 'Sep 2, 2026', status: 'Inactive', tag: 'Old', avatar: 'HA' },
    { id: 6, name: 'Fatima Malik', email: 'fatima.malik@email.com', phone: '+92 302 3344556', orders: 7, spent: 'PKR 13,500', lastOrder: 'Sep 1, 2026', status: 'Active', tag: 'Repeat', avatar: 'FM' },
    { id: 7, name: 'Bilal Hussain', email: 'bilal.hussain@email.com', phone: '+92 322 9988776', orders: 2, spent: 'PKR 3,998', lastOrder: 'Aug 29, 2026', status: 'Active', tag: 'New', avatar: 'BH' },
    { id: 8, name: 'Zainab Tariq', email: 'zainab.tariq@email.com', phone: '+92 334 6677889', orders: 11, spent: 'PKR 21,300', lastOrder: 'Sep 4, 2026', status: 'Active', tag: 'Repeat', avatar: 'ZT' },
    { id: 9, name: 'Hassan Raza', email: 'hassan.raza@email.com', phone: '+92 311 4455667', orders: 4, spent: 'PKR 7,450', lastOrder: 'Aug 31, 2026', status: 'Inactive', tag: 'Old', avatar: 'HR' },
    { id: 10, name: 'Iqra Saleem', email: 'iqra.saleem@email.com', phone: '+92 305 7766554', orders: 9, spent: 'PKR 18,990', lastOrder: 'Sep 3, 2026', status: 'Active', tag: 'VIP', avatar: 'IS' },
  ];

  const getTagBadge = (tag: string) => {
    switch(tag) {
      case 'VIP': return 'bg-orange-50 text-orange-600 border border-orange-200 flex items-center gap-1';
      case 'Repeat': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'New': return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'Old': return 'bg-slate-100 text-slate-600 border border-slate-200';
      default: return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customers</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage your customers, view their orders, and build stronger relationships.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
              <Upload className="w-4 h-4 text-slate-500" /> Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4 text-slate-500" /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Customer
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="flex gap-3 items-start">
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
              
              {/* Synthetic Sparkline Placholder */}
              <div className="absolute -bottom-2 -right-2 w-32 h-16 opacity-30">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M0,25 C20,20 30,10 50,15 C70,20 80,5 100,10" fill="none" stroke={
                    i === 0 ? '#10b981' : i === 1 ? '#3b82f6' : i === 2 ? '#8b5cf6' : '#f97316'
                  } strokeWidth="3" strokeLinecap="round" />
                </svg>
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
              <div className="relative w-full md:flex-1 md:max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                  All Customers <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                  All Locations <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                  All Tags <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                  <Calendar className="w-4 h-4 text-slate-400" /> Join Date <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 ml-auto shrink-0">
                <button className="flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors">
                  <Filter className="w-4 h-4" /> Filter
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
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3 text-center">Orders</th>
                      <th className="px-4 py-3">Total Spent</th>
                      <th className="px-4 py-3">Last Order</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Tags</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map((c, i) => (
                      <tr key={i} className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${i === 0 ? 'bg-slate-50/50' : ''}`}>
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-500">{c.id}</td>
                        <td className="px-4 py-3 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                            ${i === 0 ? 'bg-slate-800 text-white' : i === 1 ? 'bg-brand-600 text-white' : i === 2 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'}
                          `}>
                            {c.avatar}
                          </div>
                          <div className="font-bold text-slate-900">{c.name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-700">{c.phone}</div>
                          <div className="text-[11px] font-semibold text-slate-400">{c.email}</div>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 text-center">{c.orders}</td>
                        <td className="px-4 py-3 font-semibold text-slate-600">{c.spent}</td>
                        <td className="px-4 py-3 font-semibold text-slate-600">{c.lastOrder}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${getTagBadge(c.tag)}`}>
                            {c.tag === 'VIP' && <Crown className="w-3 h-3" />}
                            {c.tag}
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
                  Showing 1 to 10 of 2,843 customers
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
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-sm">285</button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-100">&gt;</button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Customer Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                  AK
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">Ali Khan</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Active</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 mt-0.5">Customer since Mar 2026</p>
                </div>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Tabs */}
            <div className="border-b border-slate-200 mt-6 flex gap-6">
              <button className="pb-3 border-b-2 border-brand-600 text-brand-700 font-bold text-sm">Overview</button>
              <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Orders</button>
              <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Addresses</button>
              <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Activity</button>
            </div>

            {/* Info Details */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <Phone className="w-4 h-4 text-slate-400" /> +92 300 1234567
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <Mail className="w-4 h-4 text-slate-400" /> ali.khan@email.com
              </div>
              <div className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> 
                <span>House 12, Street 5, DHA Phase 6,<br/>Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <Calendar className="w-4 h-4 text-slate-400" /> Customer Since Mar 12, 2026
              </div>
            </div>

            {/* Tags section */}
            <div className="mt-5 flex items-center gap-3">
              <Tag className="w-4 h-4 text-slate-400" />
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-orange-50 text-orange-600 border border-orange-200 text-xs font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3" /> VIP
                </span>
                <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
                  COD Buyer
                </span>
              </div>
            </div>

            {/* Stats Block */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-xl font-extrabold text-slate-900">12</div>
                <div className="text-[11px] font-bold text-slate-500 mt-1">Total Orders</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-sm font-extrabold text-slate-900">PKR 24,980</div>
                <div className="text-[11px] font-bold text-slate-500 mt-1">Total Spent</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="text-sm font-extrabold text-slate-900">PKR 2,499</div>
                <div className="text-[11px] font-bold text-slate-500 mt-1">Avg. Order Value</div>
              </div>
            </div>

            {/* Recent Orders inside Panel */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Recent Orders</h3>
                <Link href="#" className="text-brand-600 text-[11px] font-bold hover:underline flex items-center gap-1">
                  View All &rarr;
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white border border-slate-100 p-2.5 rounded-lg shadow-sm">
                  <div>
                    <div className="font-bold text-sm text-slate-900">SZ-10482</div>
                    <div className="text-xs font-semibold text-slate-500">Wireless Earbuds</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Delivered</span>
                    <div className="text-xs font-semibold text-slate-500 mt-1">Sep 4, 2026</div>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-white border border-slate-100 p-2.5 rounded-lg shadow-sm">
                  <div>
                    <div className="font-bold text-sm text-slate-900">SZ-10421</div>
                    <div className="text-xs font-semibold text-slate-500">Smart Watch Pro</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">Shipped</span>
                    <div className="text-xs font-semibold text-slate-500 mt-1">Aug 28, 2026</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Actions */}
            <div className="mt-6 space-y-2">
              <button className="w-full py-2.5 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors flex justify-center items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Send Message
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" /> Add Note
                </button>
                <button className="py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                  <UserCircle className="w-4 h-4 text-slate-400" /> View Profile
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
