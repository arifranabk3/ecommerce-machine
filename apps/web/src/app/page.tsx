import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ChevronDown, 
  Plus, 
  TrendingUp, 
  AlertCircle, 
  MessageSquare, 
  Box, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck,
  Sparkles,
  ArrowRight,
  Settings,
  Users
} from 'lucide-react';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        {/* Header Row */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Good morning, Arif! 👋</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Here&apos;s what&apos;s happening with your business today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
              Today (Sep 4, 2026)
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-600 transition-colors">
              <Plus className="w-4 h-4" />
              Create New
              <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Total Revenue', value: 'PKR 482,000', change: '+12.4%', color: 'text-emerald-600', bg: 'bg-emerald-50', svgFill: 'fill-emerald-100', stroke: 'stroke-emerald-500' },
            { title: 'Total Orders', value: '96', change: '+8.2%', color: 'text-blue-600', bg: 'bg-blue-50', svgFill: 'fill-blue-100', stroke: 'stroke-blue-500' },
            { title: 'Contribution Profit', value: 'PKR 74,000', change: '+15.3%', color: 'text-purple-600', bg: 'bg-purple-50', svgFill: 'fill-purple-100', stroke: 'stroke-purple-500' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                    <div className={`w-4 h-4 ${kpi.color} rounded bg-current opacity-75`} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-600">{kpi.title}</h3>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{kpi.value}</div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={`font-bold ${kpi.color} flex items-center`}>
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    {kpi.change}
                  </span>
                  <span className="text-slate-400 font-medium">vs yesterday</span>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-16 opacity-80">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M0,30 L0,15 Q10,25 20,10 T40,20 T60,5 T80,15 T100,0 L100,30 Z" className={kpi.svgFill} />
                  <path d="M0,15 Q10,25 20,10 T40,20 T60,5 T80,15 T100,0" fill="none" strokeWidth="2" className={kpi.stroke} />
                </svg>
              </div>
            </div>
          ))}
          {/* Available Cash Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <div className="w-4 h-4 text-indigo-600 rounded bg-current opacity-75" />
                </div>
                <h3 className="text-sm font-semibold text-slate-600">Available Cash</h3>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">PKR 1,840,000</div>
              <div className="flex items-center gap-1.5 text-xs mt-3 border-t border-slate-100 pt-3">
                <span className="text-slate-500 font-medium">Vendor Payable: <strong className="text-slate-900">PKR 4,810,000</strong></span>
              </div>
              <div className="absolute bottom-10 right-4 w-24 h-8 opacity-80">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M0,15 L20,15 L40,5 L60,20 L80,10 L100,10" fill="none" strokeWidth="2" className="stroke-orange-400" />
                </svg>
              </div>
          </div>
        </div>

        {/* Middle Row (Trend + Alerts + Health) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Chart */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Revenue & Profit Trend</h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-500" /> Revenue
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-200" /> Profit
                  </div>
                </div>
              </div>
              <div className="flex items-center p-1 bg-slate-50 rounded-lg border border-slate-200">
                <button className="px-3 py-1 text-xs font-bold bg-brand-500 text-white rounded shadow-sm">Daily</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-900">Weekly</button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-900">Monthly</button>
              </div>
            </div>
            <div className="flex-1 relative w-full min-h-[220px]">
              {/* Decorative Chart Placeholder */}
              <div className="absolute inset-0 border-b border-l border-slate-100 flex items-end">
                <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  {[0, 50, 100, 150, 200].map(y => (
                    <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  ))}
                  {/* Revenue Area/Line */}
                  <path d="M0,150 Q100,120 200,100 T400,90 T600,40 T800,90 T1000,100" fill="none" stroke="#718c82" strokeWidth="4" />
                  <path d="M0,150 Q100,120 200,100 T400,90 T600,40 T800,90 T1000,100 L1000,200 L0,200 Z" fill="rgba(169,194,185,0.1)" />
                  {/* Profit Line */}
                  <path d="M0,180 Q100,160 200,140 T400,145 T600,110 T800,140 T1000,145" fill="none" stroke="#c5dcd3" strokeWidth="3" />
                  {/* Data Points */}
                  <circle cx="600" cy="40" r="6" fill="white" stroke="#718c82" strokeWidth="3" />
                  <circle cx="600" cy="110" r="5" fill="white" stroke="#c5dcd3" strokeWidth="3" />
                </svg>
                {/* Tooltip Overlay */}
                <div className="absolute top-10 left-[55%] bg-white border border-slate-200 shadow-lg rounded-lg p-3 w-40 z-10">
                  <p className="text-xs font-bold text-slate-900 mb-2">4 Sep 2026</p>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-600"><span className="w-2 h-2 rounded-full bg-brand-500"></span> Revenue</span>
                    <span className="font-bold text-slate-900">482,000</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-600"><span className="w-2 h-2 rounded-full bg-brand-200"></span> Profit</span>
                    <span className="font-bold text-slate-900">74,000</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] font-bold text-slate-400">
                <span>28 Aug</span><span>29 Aug</span><span>30 Aug</span><span>31 Aug</span><span>1 Sep</span><span>2 Sep</span><span>3 Sep</span><span>4 Sep</span>
              </div>
            </div>
          </div>

          {/* Needs Attention */}
          <div className="col-span-12 lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-bold text-slate-900">Needs Your Attention</h2>
              <a href="#" className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">View all <ArrowRight className="w-3 h-3" /></a>
            </div>
            <div className="space-y-4 flex-1">
              {[
                { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', title: 'Payment reconciliation mismatch', desc: '2 transactions • PKR 84,000', time: '12 mins ago' },
                { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', title: 'Vendor settlement awaiting approval', desc: 'HHC • PKR 555,000', time: '28 mins ago' },
                { icon: Truck, color: 'text-orange-500', bg: 'bg-orange-50', title: '14 orders have incomplete addresses', desc: 'Customer response required', time: '1 hour ago' },
                { icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50', title: 'Product X margin dropped below target', desc: 'Current: 11.8% (Target: 20%)', time: '2 hours ago' },
                { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50', title: 'HHC delivery rate decreased', desc: '8.3% → 11.2%', time: '3 hours ago' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-3 items-start group cursor-pointer">
                  <div className={`w-8 h-8 rounded-full ${alert.bg} ${alert.color} flex items-center justify-center shrink-0`}>
                    <alert.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">{alert.title}</p>
                      <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">{alert.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automation Health */}
          <div className="col-span-12 lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">Automation Health</h2>
            </div>
            
            {/* Gauge Placeholder */}
            <div className="flex justify-center mb-6 relative">
              <div className="w-28 h-28 rounded-full border-[12px] border-brand-500 border-b-slate-100 flex items-center justify-center transform -rotate-45">
                <div className="transform rotate-45 text-center">
                  <p className="text-xl font-extrabold text-slate-900">98.7%</p>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-sm font-bold text-emerald-600">Healthy</p>
              <p className="text-[11px] font-semibold text-slate-500">All systems operational</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 1,482</div>
                <span className="text-slate-500">Automated</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-slate-800" /> 97</div>
                <span className="text-slate-500">Waiting</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 12</div>
                <span className="text-slate-500">Human Approval</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-semibold text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> 3</div>
                <span className="text-slate-500">Failed</span>
              </div>
            </div>

            <button className="w-full mt-auto py-2.5 bg-brand-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-brand-600 transition-colors flex items-center justify-center gap-1.5">
              View Automation <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Lists Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Order Status */}
          <div className="col-span-12 lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-bold text-slate-900">Order Status</h2>
              <a href="#" className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">View all <ArrowRight className="w-3 h-3" /></a>
            </div>
            <div className="space-y-4">
              {[
                { name: 'New', count: 18, color: 'text-blue-500', bg: 'bg-blue-50', icon: Box },
                { name: 'Processing', count: 24, color: 'text-slate-500', bg: 'bg-slate-100', icon: Clock },
                { name: 'Vendor Assigned', count: 17, color: 'text-amber-500', bg: 'bg-amber-50', icon: Users },
                { name: 'Shipped', count: 41, color: 'text-emerald-500', bg: 'bg-emerald-50', icon: Truck },
                { name: 'Delivered', count: 71, color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle2 },
                { name: 'RTO', count: 8, color: 'text-red-500', bg: 'bg-red-50', icon: AlertCircle, countColor: 'text-red-500' },
                { name: 'Cancelled', count: 3, color: 'text-slate-400', bg: 'bg-slate-50', icon: XCircle, countColor: 'text-red-500' },
              ].map((status, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded ${status.bg} ${status.color} flex items-center justify-center`}>
                      <status.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">{status.name}</span>
                  </div>
                  <span className={`text-sm font-bold ${status.countColor || 'text-slate-900'}`}>{status.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Vendors */}
          <div className="col-span-12 lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-bold text-slate-900">Top Vendors (Outstanding)</h2>
              <a href="#" className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">View all <ArrowRight className="w-3 h-3" /></a>
            </div>
            <div className="space-y-4 flex-1">
              {[
                { name: 'HHC Dropshipping', value: 'PKR 1,580,000', icon: 'HHC', color: 'text-emerald-700', bg: 'bg-emerald-100' },
                { name: 'Markaz App', value: 'PKR 920,000', icon: 'M', color: 'text-blue-700', bg: 'bg-blue-100' },
                { name: 'Local Vendors', value: 'PKR 2,310,000', icon: 'LV', color: 'text-indigo-700', bg: 'bg-indigo-100' },
              ].map((vendor, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer border-b border-slate-50 pb-4 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${vendor.bg} ${vendor.color} flex items-center justify-center text-[10px] font-bold`}>
                      {vendor.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{vendor.name}</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">{vendor.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">Total Outstanding</span>
              <span className="text-base font-extrabold text-emerald-600">PKR 4,810,000</span>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
              <a href="#" className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">View all <ArrowRight className="w-3 h-3" /></a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="pb-3 font-semibold">#</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { id: 'SZ-10482', name: 'Ali Khan', amt: 'PKR 2,499', status: 'Delivered', statusBg: 'bg-emerald-100', statusText: 'text-emerald-700', time: '2 mins ago' },
                    { id: 'SZ-10481', name: 'Sara Ahmed', amt: 'PKR 3,199', status: 'Shipped', statusBg: 'bg-blue-100', statusText: 'text-blue-700', time: '8 mins ago' },
                    { id: 'SZ-10480', name: 'Usman Raza', amt: 'PKR 1,899', status: 'Processing', statusBg: 'bg-amber-100', statusText: 'text-amber-700', time: '14 mins ago' },
                    { id: 'SZ-10479', name: 'Ayesha Noor', amt: 'PKR 2,299', status: 'Delivered', statusBg: 'bg-emerald-100', statusText: 'text-emerald-700', time: '21 mins ago' },
                    { id: 'SZ-10478', name: 'Hamza Ali', amt: 'PKR 1,999', status: 'Shipped', statusBg: 'bg-blue-100', statusText: 'text-blue-700', time: '28 mins ago' },
                  ].map((order, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="py-3 font-bold text-slate-900">{order.id}</td>
                      <td className="py-3 font-semibold text-slate-600">{order.name}</td>
                      <td className="py-3 font-semibold text-slate-500">{order.amt}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.statusBg} ${order.statusText}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-slate-400 text-right">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Copilot Widget */}
          <div className="col-span-12 lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <h2 className="text-sm font-bold text-slate-900">AI Copilot <span className="text-[10px] font-semibold text-slate-400 font-normal ml-1">(Beta)</span></h2>
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed mb-4">
                Your RTO rate increased 2.1% this week, mainly from Lahore COD orders.
              </p>
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Recommended Action:</p>
                <p className="text-[11px] font-semibold text-emerald-900 leading-tight">Review 3 products responsible for 64% of the increase.</p>
              </div>
            </div>
            
            <div className="mt-4 relative">
              <input 
                type="text" 
                placeholder="Ask Sellzy anything..." 
                className="w-full pl-8 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <Sparkles className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-brand-500 rounded text-white flex items-center justify-center hover:bg-brand-600 transition-colors">
                 <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Chart Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sales by Channel Donut */}
          <div className="col-span-12 lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-900 mb-6">Sales by Channel</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {/* Website - 45% */}
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="45 55" />
                  {/* WhatsApp - 28% */}
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#3b82f6" strokeWidth="6" strokeDasharray="28 72" strokeDashoffset="-45" />
                  {/* Facebook - 18% */}
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="6" strokeDasharray="18 82" strokeDashoffset="-73" />
                  {/* Instagram & Other - Remaining */}
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#8b5cf6" strokeWidth="6" strokeDasharray="9 91" strokeDashoffset="-91" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-slate-500">PKR</span>
                  <span className="text-lg font-extrabold text-slate-900 leading-none">482K</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Total Sales</span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {[
                  { name: 'Website', pct: '45%', color: 'bg-emerald-500' },
                  { name: 'WhatsApp', pct: '28%', color: 'bg-blue-500' },
                  { name: 'Facebook', pct: '18%', color: 'bg-amber-500' },
                  { name: 'Instagram', pct: '6%', color: 'bg-purple-500' },
                  { name: 'Other', pct: '3%', color: 'bg-slate-300' },
                ].map((ch, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${ch.color}`} />
                      <span className="font-semibold text-slate-600">{ch.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{ch.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Sales Bar Chart */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-slate-900">Today&apos;s Sales</h2>
              <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-600 flex items-center gap-1 cursor-pointer">
                Today <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="flex-1 flex items-end gap-1.5 h-32 pt-4 relative">
              {/* Y Axis Labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] font-semibold text-slate-400 w-6 pb-6">
                <span>60K</span><span>40K</span><span>20K</span><span>0</span>
              </div>
              <div className="ml-8 flex-1 flex items-end justify-between h-full pb-6 border-b border-slate-100">
                {[12, 15, 22, 18, 10, 8, 14, 25, 30, 45, 55, 60, 40, 45, 30, 20, 15, 10, 12, 10, 8, 6].map((h, i) => (
                  <div key={i} className="w-full mx-0.5 bg-brand-200 hover:bg-brand-400 transition-colors rounded-t-sm" style={{ height: `${(h/60)*100}%` }}></div>
                ))}
              </div>
              <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] font-bold text-slate-400">
                <span>12 AM</span><span>4 AM</span><span>8 AM</span><span>12 PM</span><span>4 PM</span><span>8 PM</span>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-bold text-slate-900">Top Products</h2>
              <a href="#" className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:underline">View all <ArrowRight className="w-3 h-3" /></a>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="pb-3 w-8">#</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3 text-right">Sales</th>
                  <th className="pb-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: 1, name: 'Wireless Earbuds', sales: 24, rev: 'PKR 59,976' },
                  { id: 2, name: 'Smart Watch Pro', sales: 18, rev: 'PKR 50,382' },
                  { id: 3, name: 'Air Purifier', sales: 12, rev: 'PKR 35,988' },
                  { id: 4, name: 'Neck Massager', sales: 10, rev: 'PKR 31,990' },
                  { id: 5, name: 'LED Ring Light', sales: 8, rev: 'PKR 19,992' },
                ].map((prod, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-2.5 text-slate-400 font-semibold">{prod.id}</td>
                    <td className="py-2.5 font-bold text-slate-700 group-hover:text-slate-900">{prod.name}</td>
                    <td className="py-2.5 font-semibold text-slate-600 text-right">{prod.sales}</td>
                    <td className="py-2.5 font-bold text-slate-900 text-right">{prod.rev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
