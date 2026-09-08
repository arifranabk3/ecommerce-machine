'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Download,
  Calendar,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  CreditCard,
  Briefcase
} from 'lucide-react';

export default function FinancePage() {
  const kpis = [
    { title: 'Total Revenue', value: 'PKR 14,500,000', subtitle: 'Year to Date', icon: DollarSign, bg: 'bg-brand-100', color: 'text-brand-600', trend: '+15.2%', isUp: true },
    { title: 'Total Expenses', value: 'PKR 4,200,000', subtitle: 'Year to Date', icon: CreditCard, bg: 'bg-red-100', color: 'text-red-600', trend: '-2.4%', isUp: false },
    { title: 'Net Profit', value: 'PKR 10,300,000', subtitle: 'Year to Date', icon: Briefcase, bg: 'bg-emerald-100', color: 'text-emerald-600', trend: '+18.5%', isUp: true },
  ];

  const recentTransactions = [
    { id: 'TRX-1092', date: 'Sep 05, 2026', desc: 'Vendor Payout (Tech Source)', category: 'Cost of Goods Sold', type: 'Expense', amount: '-PKR 125,000' },
    { id: 'TRX-1091', date: 'Sep 04, 2026', desc: 'Stripe Settlement', category: 'Revenue', type: 'Income', amount: '+PKR 450,000' },
    { id: 'TRX-1090', date: 'Sep 02, 2026', desc: 'AWS Hosting', category: 'Software', type: 'Expense', amount: '-PKR 85,000' },
    { id: 'TRX-1089', date: 'Sep 01, 2026', desc: 'Facebook Ads', category: 'Marketing', type: 'Expense', amount: '-PKR 250,000' },
    { id: 'TRX-1088', date: 'Aug 28, 2026', desc: 'JazzCash Settlement', category: 'Revenue', type: 'Income', amount: '+PKR 180,000' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Finance Overview</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Track your revenue, expenses, and overall profitability.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors">
              <Calendar className="w-4 h-4 text-slate-500" /> Year to Date <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors">
              <Download className="w-4 h-4" /> Download Report
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <kpi.icon className="w-24 h-24" />
              </div>
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${kpi.isUp ? 'text-emerald-700 bg-emerald-50' : 'text-emerald-700 bg-emerald-50'}`}>
                  {kpi.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                  <span className={!kpi.isUp ? 'text-red-600' : ''}>{kpi.trend}</span>
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-slate-500 mb-1">{kpi.title}</p>
                <div className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">{kpi.value}</div>
                <div className="text-xs text-slate-400 font-semibold mt-1">{kpi.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Revenue vs Expenses */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-600" />
                <h2 className="font-bold text-slate-900">Revenue vs Expenses (YTD)</h2>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <div className="w-3 h-3 rounded bg-brand-500"></div> Revenue
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <div className="w-3 h-3 rounded bg-orange-400"></div> Expenses
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative flex items-end gap-2 pb-6 pt-4">
              {/* Synthetic Bar Chart */}
              {/* Y-axis Labels */}
              <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-[10px] font-bold text-slate-400 text-right pr-2">
                <span>3M</span>
                <span>2M</span>
                <span>1M</span>
                <span>0</span>
              </div>
              
              {/* Grid Lines */}
              <div className="absolute left-12 right-0 top-0 h-full">
                <div className="absolute top-[0%] w-full border-t border-slate-100"></div>
                <div className="absolute top-[33.3%] w-full border-t border-slate-100"></div>
                <div className="absolute top-[66.6%] w-full border-t border-slate-100"></div>
                <div className="absolute bottom-6 w-full border-t border-slate-200"></div>
              </div>

              {/* Bars container */}
              <div className="relative z-10 w-full h-full ml-12 flex justify-between items-end px-2">
                {[
                  { rev: '40%', exp: '20%', label: 'Jan' },
                  { rev: '45%', exp: '25%', label: 'Feb' },
                  { rev: '60%', exp: '30%', label: 'Mar' },
                  { rev: '55%', exp: '28%', label: 'Apr' },
                  { rev: '75%', exp: '35%', label: 'May' },
                  { rev: '85%', exp: '40%', label: 'Jun' },
                  { rev: '70%', exp: '38%', label: 'Jul' },
                  { rev: '95%', exp: '45%', label: 'Aug' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 w-[8%] h-full justify-end">
                    <div className="flex gap-1 items-end w-full h-[calc(100%-24px)] group">
                      <div className="w-1/2 bg-brand-500 rounded-t hover:bg-brand-600 transition-colors cursor-pointer" style={{ height: item.rev }}></div>
                      <div className="w-1/2 bg-orange-400 rounded-t hover:bg-orange-500 transition-colors cursor-pointer" style={{ height: item.exp }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profit Margin Trend */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h2 className="font-bold text-slate-900">Profit Margin Trend</h2>
              </div>
              <div className="text-2xl font-extrabold text-emerald-600">71.0%</div>
            </div>
            
            <div className="flex-1 w-full relative">
              {/* Synthetic Line Chart */}
              <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-[calc(100%-24px)] mt-2">
                <defs>
                  <linearGradient id="profitGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="75" x2="1000" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="150" x2="1000" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="225" x2="1000" y2="225" stroke="#f1f5f9" strokeWidth="1" />
                
                <path d="M0,250 L140,230 L280,180 L420,200 L560,140 L700,90 L840,110 L1000,40 L1000,300 L0,300 Z" fill="url(#profitGrad)" />
                <path d="M0,250 L140,230 L280,180 L420,200 L560,140 L700,90 L840,110 L1000,40" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Data Points */}
                <circle cx="140" cy="230" r="6" fill="white" stroke="#10b981" strokeWidth="3" />
                <circle cx="280" cy="180" r="6" fill="white" stroke="#10b981" strokeWidth="3" />
                <circle cx="420" cy="200" r="6" fill="white" stroke="#10b981" strokeWidth="3" />
                <circle cx="560" cy="140" r="6" fill="white" stroke="#10b981" strokeWidth="3" />
                <circle cx="700" cy="90" r="6" fill="white" stroke="#10b981" strokeWidth="3" />
                <circle cx="840" cy="110" r="6" fill="white" stroke="#10b981" strokeWidth="3" />
                <circle cx="1000" cy="40" r="6" fill="white" stroke="#10b981" strokeWidth="3" />
              </svg>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-[10px] font-bold text-slate-400 px-2">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">
          
          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                Recent Transactions
              </h2>
              <button className="text-sm font-bold text-brand-600 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Transaction ID & Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTransactions.map((trx, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{trx.id}</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5">{trx.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">{trx.desc}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">
                          {trx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-extrabold ${trx.type === 'Income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {trx.amount}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-slate-700" />
                <h2 className="font-bold text-slate-900">Expense Breakdown</h2>
              </div>
            </div>
            
            <div className="flex items-center justify-center py-6">
              {/* Synthetic Donut Chart */}
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Other 10% */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="0" />
                  {/* Software 15% */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="226.08" />
                  {/* Operations 30% */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="188.4" />
                  {/* Marketing 45% */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#0ea5e9" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="113.04" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">PKR 4.2M</span>
                  <span className="text-xs font-bold text-slate-400 mt-1">Total Expenses</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <div className="w-3 h-3 rounded-full bg-sky-500"></div> Marketing (45%)
                </div>
                <span className="font-extrabold text-slate-900">PKR 1,890,000</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div> Operations (30%)
                </div>
                <span className="font-extrabold text-slate-900">PKR 1,260,000</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div> Software (15%)
                </div>
                <span className="font-extrabold text-slate-900">PKR 630,000</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div> Other (10%)
                </div>
                <span className="font-extrabold text-slate-900">PKR 420,000</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
