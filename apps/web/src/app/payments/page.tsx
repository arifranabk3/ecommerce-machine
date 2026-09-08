'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Download,
  Filter,
  Search,
  ChevronDown,
  DollarSign,
  Clock,
  Percent,
  RefreshCcw,
  MoreHorizontal,
  CreditCard,
  Building,
  Smartphone,
  Banknote
} from 'lucide-react';

export default function PaymentsPage() {
  const kpis = [
    { title: 'Total Received', value: 'PKR 2,450,000', subtitle: '+12% vs last month', icon: DollarSign, bg: 'bg-brand-100', color: 'text-brand-600' },
    { title: 'Pending Clearance', value: 'PKR 450,000', subtitle: '15 transactions', icon: Clock, bg: 'bg-orange-100', color: 'text-orange-600' },
    { title: 'Processing Fees', value: 'PKR 45,000', subtitle: '1.8% average fee', icon: Percent, bg: 'bg-purple-100', color: 'text-purple-600' },
    { title: 'Refunded', value: 'PKR 12,500', subtitle: '3 transactions', icon: RefreshCcw, bg: 'bg-red-100', color: 'text-red-600' },
  ];

  const transactions = [
    { id: 'TXN-8942', date: 'Sep 05, 2026', order: 'ORD-7845', customer: 'Sana Ahmed', method: 'JazzCash', methodIcon: Smartphone, methodColor: 'text-orange-600', amount: 'PKR 12,450', fee: 'PKR 150', net: 'PKR 12,300', status: 'Completed' },
    { id: 'TXN-8941', date: 'Sep 05, 2026', order: 'ORD-7844', customer: 'Ali Raza', method: 'Credit Card', methodIcon: CreditCard, methodColor: 'text-blue-600', amount: 'PKR 8,500', fee: 'PKR 170', net: 'PKR 8,330', status: 'Completed' },
    { id: 'TXN-8940', date: 'Sep 04, 2026', order: 'ORD-7843', customer: 'Usman Khan', method: 'Easypaisa', methodIcon: Smartphone, methodColor: 'text-emerald-600', amount: 'PKR 4,200', fee: 'PKR 0', net: 'PKR 4,200', status: 'Pending' },
    { id: 'TXN-8939', date: 'Sep 04, 2026', order: 'ORD-7842', customer: 'Ayesha Malik', method: 'Bank Transfer', methodIcon: Building, methodColor: 'text-slate-600', amount: 'PKR 45,000', fee: 'PKR 500', net: 'PKR 44,500', status: 'Completed' },
    { id: 'TXN-8938', date: 'Sep 03, 2026', order: 'ORD-7841', customer: 'Bilal Ahmed', method: 'Cash on Delivery', methodIcon: Banknote, methodColor: 'text-brand-600', amount: 'PKR 2,100', fee: 'PKR 0', net: 'PKR 2,100', status: 'Processing' },
    { id: 'TXN-8937', date: 'Sep 02, 2026', order: 'ORD-7840', customer: 'Zara Ali', method: 'Credit Card', methodIcon: CreditCard, methodColor: 'text-blue-600', amount: '-PKR 3,500', fee: 'PKR 0', net: '-PKR 3,500', status: 'Refunded' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'Pending': return 'bg-orange-100 text-orange-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Refunded': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage incoming payments, settlements, and refunds.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4 text-slate-500" /> Export CSV
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">{kpi.title}</p>
                <div className="text-2xl font-extrabold text-slate-900 leading-tight">{kpi.value}</div>
                <div className="text-[11px] text-slate-400 font-semibold mt-1">{kpi.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex gap-8 px-2">
          <button className="pb-3 border-b-2 border-brand-600 text-brand-700 font-bold text-sm">All Transactions</button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700 flex items-center gap-2">
            Incoming <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">1,240</span>
          </button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Outgoing</button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Refunds</button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Disputes</button>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Txn ID, Order ID..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
            
            <div className="flex gap-3 overflow-x-auto w-full md:w-auto">
              <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap min-w-[140px]">
                Last 30 Days <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap min-w-[120px]">
                All Status <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap min-w-[120px]">
                All Methods <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shrink-0">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Transaction Details</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Fee</th>
                  <th className="px-6 py-4 text-right">Net</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((txn, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{txn.id}</div>
                      <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-2 mt-0.5">
                        {txn.date} • <Link href={`/orders/${txn.order.replace('ORD-', '')}`} className="text-brand-600 hover:underline">{txn.order}</Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-700">{txn.customer}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-semibold text-slate-700">
                        <txn.methodIcon className={`w-4 h-4 ${txn.methodColor}`} /> {txn.method}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`font-extrabold ${txn.amount.includes('-') ? 'text-red-600' : 'text-slate-900'}`}>{txn.amount}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-semibold text-slate-500">{txn.fee}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`font-bold ${txn.amount.includes('-') ? 'text-red-600' : 'text-emerald-600'}`}>{txn.net}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(txn.status)}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
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
          <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-semibold text-slate-500">
              Showing 1 to 6 of 1,240 transactions
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
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 font-bold text-sm">124</button>
                <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-100">&gt;</button>
              </nav>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
