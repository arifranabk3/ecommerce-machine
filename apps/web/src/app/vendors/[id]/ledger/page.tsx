'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ArrowLeft,
  Download,
  Filter,
  Search,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react';
import Link from 'next/link';

export default function VendorLedgerPage() {
  const kpis = [
    { title: 'Total Payables', value: 'PKR 125,000', subtitle: 'Currently pending', icon: DollarSign, bg: 'bg-brand-100', color: 'text-brand-600', trend: '+12.5%', isUp: true },
    { title: 'Total Paid (YTD)', value: 'PKR 1,450,000', subtitle: 'In 2026', icon: Wallet, bg: 'bg-emerald-100', color: 'text-emerald-600', trend: '+24.2%', isUp: true },
    { title: 'Deductions (RTO)', value: 'PKR 12,450', subtitle: 'From 25 returns', icon: TrendingDown, bg: 'bg-red-100', color: 'text-red-600', trend: '-2.1%', isUp: false },
    { title: 'Next Payout', value: 'PKR 45,000', subtitle: 'Expected Sep 15', icon: FileText, bg: 'bg-blue-100', color: 'text-blue-600', trend: '', isUp: true },
  ];

  const ledgerEntries = [
    { id: 'LDG-9021', date: 'Sep 05, 2026', description: 'Order Fulfillment (42 items)', reference: 'ORD-BATCH-882', type: 'Credit', amount: 'PKR 45,000', balance: 'PKR 125,000', status: 'Pending' },
    { id: 'LDG-9020', date: 'Sep 04, 2026', description: 'RTO Deduction (3 items)', reference: 'RTO-4421', type: 'Debit', amount: 'PKR 3,450', balance: 'PKR 80,000', status: 'Completed' },
    { id: 'LDG-9019', date: 'Sep 02, 2026', description: 'Weekly Payout', reference: 'PAY-7762', type: 'Debit', amount: 'PKR 55,000', balance: 'PKR 83,450', status: 'Completed' },
    { id: 'LDG-9018', date: 'Aug 28, 2026', description: 'Order Fulfillment (65 items)', reference: 'ORD-BATCH-881', type: 'Credit', amount: 'PKR 85,000', balance: 'PKR 138,450', status: 'Completed' },
    { id: 'LDG-9017', date: 'Aug 26, 2026', description: 'Platform Fee Deduction', reference: 'FEE-102', type: 'Debit', amount: 'PKR 1,500', balance: 'PKR 53,450', status: 'Completed' },
    { id: 'LDG-9016', date: 'Aug 20, 2026', description: 'Order Fulfillment (12 items)', reference: 'ORD-BATCH-880', type: 'Credit', amount: 'PKR 15,000', balance: 'PKR 54,950', status: 'Completed' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        {/* Header Navigation */}
        <div>
          <Link href="/vendors" className="text-sm font-bold text-slate-500 hover:text-brand-600 flex items-center gap-1 w-fit mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Vendors
          </Link>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-sm">
                TS
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                  Tech Source <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">Active</span>
                </h1>
                <p className="text-slate-500 text-sm font-medium mt-0.5">Vendor ID: VND-1042 • Joined Jan 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4 text-slate-500" /> Export PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors">
                <DollarSign className="w-4 h-4" /> Make Payout
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex gap-8">
          <Link href="/vendors/1" className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Overview</Link>
          <Link href="/vendors/1/products" className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Products</Link>
          <Link href="/vendors/1/ledger" className="pb-3 border-b-2 border-brand-600 text-brand-700 font-bold text-sm">Ledger & Payouts</Link>
          <Link href="/vendors/1/documents" className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Documents</Link>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                {kpi.trend && (
                  <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${kpi.isUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                    {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">{kpi.title}</p>
                <div className="text-2xl font-extrabold text-slate-900 leading-tight">{kpi.value}</div>
                <div className="text-xs text-slate-400 font-semibold mt-1">{kpi.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-slate-900">Ledger History (Last 30 Days)</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">7D</button>
              <button className="px-3 py-1 bg-brand-50 text-brand-700 rounded text-xs font-bold">30D</button>
              <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">90D</button>
            </div>
          </div>
          <div className="h-48 w-full relative">
            {/* Synthetic Line Chart */}
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="1000" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="150" x2="1000" y2="150" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="200" x2="1000" y2="200" stroke="#f1f5f9" strokeWidth="1" />
              
              {/* Data Area & Line */}
              <path d="M0,180 L100,160 L200,120 L300,150 L400,90 L500,110 L600,40 L700,70 L800,30 L900,50 L1000,20 L1000,200 L0,200 Z" fill="url(#gradient)" />
              <path d="M0,180 L100,160 L200,120 L300,150 L400,90 L500,110 L600,40 L700,70 L800,30 L900,50 L1000,20" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Ledger Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Header/Filters */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-slate-900">Ledger Entries</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by ID or Ref..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shrink-0">
                <Filter className="w-4 h-4 text-slate-400" /> Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Entry ID & Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Balance</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledgerEntries.map((entry, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-600 cursor-pointer hover:underline">{entry.id}</div>
                      <div className="text-[11px] font-semibold text-slate-400">{entry.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{entry.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{entry.reference}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${entry.type === 'Credit' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`font-extrabold ${entry.type === 'Credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {entry.type === 'Credit' ? '+' : '-'}{entry.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-900">{entry.balance}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${entry.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-semibold text-slate-500">
              Showing 1 to 6 of 124 entries
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-1">
                <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-100 disabled:opacity-50" disabled>&lt;</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-sm">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-sm">3</button>
                <span className="text-slate-400 px-1">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-sm">12</button>
                <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-100">&gt;</button>
              </nav>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
