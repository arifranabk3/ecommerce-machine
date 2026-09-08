'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Download,
  Filter,
  Search,
  ChevronDown,
  Calendar,
  Building,
  RefreshCcw,
  Percent,
  CheckCircle2,
  Clock,
  MoreHorizontal
} from 'lucide-react';

export default function SettlementsPage() {
  const kpis = [
    { title: 'Next Settlement', value: 'PKR 450,000', subtitle: 'Expected Sep 15, 2026', icon: Calendar, bg: 'bg-brand-100', color: 'text-brand-600' },
    { title: 'Pending Reconciliation', value: 'PKR 125,000', subtitle: '3 batches pending', icon: Clock, bg: 'bg-orange-100', color: 'text-orange-600' },
    { title: 'YTD Settled', value: 'PKR 12,450,000', subtitle: 'Across all gateways', icon: CheckCircle2, bg: 'bg-emerald-100', color: 'text-emerald-600' },
    { title: 'Gateway Fees', value: 'PKR 145,000', subtitle: '1.5% average rate', icon: Percent, bg: 'bg-purple-100', color: 'text-purple-600' },
  ];

  const settlements = [
    { id: 'STL-4091', gateway: 'Stripe', date: 'Sep 15, 2026', gross: 'PKR 450,000', fees: 'PKR 12,000', net: 'PKR 438,000', status: 'Scheduled', txnCount: 145 },
    { id: 'STL-4090', gateway: 'JazzCash', date: 'Sep 14, 2026', gross: 'PKR 125,000', fees: 'PKR 2,500', net: 'PKR 122,500', status: 'Processing', txnCount: 42 },
    { id: 'STL-4089', gateway: 'Easypaisa', date: 'Sep 12, 2026', gross: 'PKR 85,000', fees: 'PKR 1,700', net: 'PKR 83,300', status: 'Settled', txnCount: 28 },
    { id: 'STL-4088', gateway: 'Bank Transfer', date: 'Sep 10, 2026', gross: 'PKR 320,000', fees: 'PKR 0', net: 'PKR 320,000', status: 'Settled', txnCount: 5 },
    { id: 'STL-4087', gateway: 'Stripe', date: 'Sep 08, 2026', gross: 'PKR 510,000', fees: 'PKR 14,500', net: 'PKR 495,500', status: 'Settled', txnCount: 180 },
    { id: 'STL-4086', gateway: 'JazzCash', date: 'Sep 07, 2026', gross: 'PKR 95,000', fees: 'PKR 1,900', net: 'PKR 93,100', status: 'Settled', txnCount: 35 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Settled': return 'bg-emerald-100 text-emerald-700';
      case 'Scheduled': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settlements</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage payment gateway payouts and bank reconciliations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
              <RefreshCcw className="w-4 h-4 text-slate-500" /> Sync Gateways
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors">
              <Download className="w-4 h-4" /> Export Report
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
          <button className="pb-3 border-b-2 border-brand-600 text-brand-700 font-bold text-sm">All Batches</button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Scheduled</button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Settled</button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700">Reconciliation</button>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Batch ID..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
            
            <div className="flex gap-3 overflow-x-auto w-full md:w-auto">
              <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap min-w-[140px]">
                Last 30 Days <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap min-w-[140px]">
                All Gateways <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shrink-0">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settlements Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Batch Details</th>
                  <th className="px-6 py-4">Gateway</th>
                  <th className="px-6 py-4 text-right">Gross Amount</th>
                  <th className="px-6 py-4 text-right">Gateway Fees</th>
                  <th className="px-6 py-4 text-right">Net Settlement</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {settlements.map((batch, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-600 hover:underline cursor-pointer">{batch.id}</div>
                      <div className="text-[11px] font-semibold text-slate-500 mt-0.5">{batch.date} • {batch.txnCount} txns</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-slate-700">
                        <Building className="w-4 h-4 text-slate-400" /> {batch.gateway}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-900">{batch.gross}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-semibold text-red-600">-{batch.fees}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-extrabold text-emerald-600">{batch.net}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(batch.status)}`}>
                        {batch.status}
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
              Showing 1 to 6 of 48 batches
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
    </DashboardLayout>
  );
}
