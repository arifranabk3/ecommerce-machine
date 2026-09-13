'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Users,
  Download,
  Calendar,
  ChevronDown,
  RefreshCw,
  Store,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Share2,
  Mail,
  Search,
  Sparkles,
  MousePointerClick,
  ShoppingCart,
  CheckCircle2,
  MoreHorizontal
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line
} from 'recharts';

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState('30D');

  // Realistic mock data
  const revenueData = [
    { name: '1 Oct', revenue: 45000, orders: 120 },
    { name: '5 Oct', revenue: 52000, orders: 145 },
    { name: '10 Oct', revenue: 48000, orders: 130 },
    { name: '15 Oct', revenue: 61000, orders: 180 },
    { name: '20 Oct', revenue: 59000, orders: 165 },
    { name: '25 Oct', revenue: 75000, orders: 210 },
    { name: '30 Oct', revenue: 82000, orders: 235 },
  ];

  const salesByCategory = [
    { name: 'Fashion', sales: 450000 },
    { name: 'Electronics', sales: 380000 },
    { name: 'Beauty', sales: 210000 },
    { name: 'Home', sales: 150000 },
  ];

  const salesByChannel = [
    { name: 'Online Store', value: 65, color: '#4f46e5' },
    { name: 'Social', value: 20, color: '#06b6d4' },
    { name: 'Marketplace', value: 10, color: '#8b5cf6' },
    { name: 'POS', value: 5, color: '#f59e0b' },
  ];

  const customerData = [
    { name: 'W1', new: 400, returning: 240 },
    { name: 'W2', new: 300, returning: 280 },
    { name: 'W3', new: 500, returning: 320 },
    { name: 'W4', new: 450, returning: 390 },
  ];

  const funnelData = [
    { stage: 'Visitors', count: 125000, dropoff: null },
    { stage: 'Product Views', count: 85000, dropoff: '32%' },
    { stage: 'Add to Cart', count: 24000, dropoff: '71%' },
    { stage: 'Checkout', count: 18000, dropoff: '25%' },
    { stage: 'Purchase', count: 14200, dropoff: '21%' },
  ];

  const topProducts = [
    { id: '1', name: 'Premium Wireless Headphones', sku: 'AUDIO-WH-001', cat: 'Electronics', orders: 1240, units: 1350, rev: 'PKR 4.5M', growth: '+12%', stock: 450, status: 'In Stock' },
    { id: '2', name: 'Minimalist Leather Tote', sku: 'BAG-LT-009', cat: 'Fashion', orders: 980, units: 1020, rev: 'PKR 3.2M', growth: '+8%', stock: 120, status: 'Low Stock' },
    { id: '3', name: 'Smart Home Hub', sku: 'SMART-HH-02', cat: 'Electronics', orders: 850, units: 850, rev: 'PKR 2.8M', growth: '-5%', stock: 850, status: 'In Stock' },
    { id: '4', name: 'Hydrating Face Serum', sku: 'BEAUTY-FS-01', cat: 'Beauty', orders: 2100, units: 2400, rev: 'PKR 2.1M', growth: '+24%', stock: 25, status: 'Critical' },
    { id: '5', name: 'Ergonomic Desk Chair', sku: 'HOME-EC-05', cat: 'Home', orders: 340, units: 350, rev: 'PKR 1.8M', growth: '+2%', stock: 65, status: 'In Stock' },
  ];

  const formatCurrency = (val: number) => `PKR ${(val / 1000).toFixed(1)}k`;

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analytics Workspace</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Comprehensive insights and performance metrics for your business.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100">
              <Store className="w-4 h-4 mr-2 text-slate-500" />
              All Stores
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <Button variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100">
              <Calendar className="w-4 h-4 mr-2 text-slate-500" />
              Oct 1 - Oct 31, 2026
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <Button variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hidden sm:flex">
              Compare: Previous Period
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* TOP KPI ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> 18.4%
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Total Revenue</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">PKR 14.2M</div>
              <p className="text-xs font-medium text-slate-400 mt-2">vs PKR 12.0M last period</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> 12.2%
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Total Orders</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">4,820</div>
              <p className="text-xs font-medium text-slate-400 mt-2">vs 4,295 last period</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> 5.5%
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Average Order Value</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">PKR 2,946</div>
              <p className="text-xs font-medium text-slate-400 mt-2">vs PKR 2,793 last period</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:scale-110 transition-transform">
                  <MousePointerClick className="w-5 h-5" />
                </div>
                <Badge variant="danger" className="bg-red-50 text-red-700 border-red-100 flex items-center gap-1">
                  <ArrowDownRight className="w-3 h-3" /> 1.2%
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Conversion Rate</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">3.24%</div>
              <p className="text-xs font-medium text-slate-400 mt-2">vs 3.28% last period</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group md:col-span-3 xl:col-span-1">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> 22.4%
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Total Customers</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">12,450</div>
              <p className="text-xs font-medium text-slate-400 mt-2">vs 10,170 last period</p>
            </CardContent>
          </Card>
        </div>

        {/* REVENUE OVERVIEW & INSIGHTS */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <Card className="xl:col-span-3 shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Revenue Overview</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Daily revenue and order volume analysis</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 mr-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-brand-500"></div>
                      <span className="text-xs font-bold text-slate-600">Revenue</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                      <span className="text-xs font-bold text-slate-600">Orders</span>
                    </div>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['7D', '30D', '90D', '12M'].map(p => (
                      <button 
                        key={p} 
                        onClick={() => setDateRange(p)}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${dateRange === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px 16px' }}
                      itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                      labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '8px' }}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#22d3ee" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#22d3ee' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 bg-gradient-to-b from-brand-900 to-slate-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-brand-300" />
                <h3 className="text-lg font-extrabold tracking-tight text-white">Business Insights</h3>
              </div>
              <div className="space-y-5">
                <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                  <p className="text-sm font-medium leading-relaxed">
                    <strong className="text-white font-bold block mb-1">Revenue Surge</strong>
                    Revenue is up <span className="text-emerald-400 font-bold">18.4%</span> compared with the previous period, primarily driven by Electronics.
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                  <p className="text-sm font-medium leading-relaxed">
                    <strong className="text-white font-bold block mb-1">Customer Retention</strong>
                    Returning customers contributed <span className="text-brand-300 font-bold">42%</span> of total revenue this month.
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                  <p className="text-sm font-medium leading-relaxed">
                    <strong className="text-white font-bold block mb-1">Inventory Warning</strong>
                    Demand is sharply increasing for <span className="text-orange-300 font-bold">Hydrating Face Serum</span> while stock is critically low.
                  </p>
                </div>
              </div>
              <Button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white border-0">
                View All Insights
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* SALES & CUSTOMER ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-base font-extrabold text-slate-900 mb-6">Sales by Channel</h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-[200px] w-[200px] flex-shrink-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesByChannel}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {salesByChannel.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-slate-900">4</span>
                    <span className="text-xs font-bold text-slate-500">Channels</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3 w-full">
                  {salesByChannel.map(channel => (
                    <div key={channel.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }}></div>
                        <span className="text-sm font-semibold text-slate-700">{channel.name}</span>
                      </div>
                      <span className="text-sm font-extrabold text-slate-900">{channel.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6 flex flex-col h-full">
              <h3 className="text-base font-extrabold text-slate-900 mb-6">Customer Acquisition</h3>
              <div className="flex-1 h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                    />
                    <Bar dataKey="new" name="New" stackId="a" fill="#4f46e5" radius={[0, 0, 4, 4]} barSize={32} />
                    <Bar dataKey="returning" name="Returning" stackId="a" fill="#22d3ee" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-base font-extrabold text-slate-900 mb-6">Sales by Category</h3>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByCategory} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} width={80} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value: any) => [`PKR ${Number(value).toLocaleString()}`, 'Sales']}
                    />
                    <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FUNNEL & TRAFFIC */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6">
              <h3 className="text-base font-extrabold text-slate-900 mb-6">Conversion Funnel</h3>
              <div className="space-y-0">
                {funnelData.map((step, idx) => (
                  <div key={step.stage} className="relative">
                    <div className="flex items-center justify-between py-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold border border-slate-200">
                          {idx + 1}
                        </div>
                        <span className="font-bold text-slate-700">{step.stage}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {step.dropoff && (
                          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">-{step.dropoff} drop</span>
                        )}
                        <span className="font-extrabold text-slate-900 w-20 text-right">{step.count.toLocaleString()}</span>
                      </div>
                    </div>
                    {/* Visual Funnel Bar */}
                    <div className="absolute top-1/2 left-10 right-32 h-10 -translate-y-1/2 bg-brand-50 rounded-r-full -z-0 opacity-50" style={{ width: `${(step.count / funnelData[0].count) * 100}%` }}></div>
                    {idx < funnelData.length - 1 && (
                      <div className="h-6 w-px bg-slate-200 absolute left-3 top-9 z-0"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6 flex flex-col h-full">
              <h3 className="text-base font-extrabold text-slate-900 mb-6">Traffic Sources</h3>
              <div className="space-y-5 flex-1">
                {[
                  { name: 'Organic Search', icon: Search, color: 'text-blue-500', bg: 'bg-blue-50', users: '45.2k', rev: 'PKR 4.2M' },
                  { name: 'Direct Traffic', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-50', users: '32.1k', rev: 'PKR 3.8M' },
                  { name: 'Social Media', icon: Share2, color: 'text-purple-500', bg: 'bg-purple-50', users: '28.4k', rev: 'PKR 2.1M' },
                  { name: 'Email Marketing', icon: Mail, color: 'text-orange-500', bg: 'bg-orange-50', users: '12.5k', rev: 'PKR 1.5M' },
                  { name: 'Paid Ads', icon: MousePointerClick, color: 'text-cyan-500', bg: 'bg-cyan-50', users: '6.8k', rev: 'PKR 2.6M' },
                ].map(source => (
                  <div key={source.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${source.bg} ${source.color}`}>
                        <source.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{source.name}</p>
                        <p className="text-xs font-medium text-slate-500">{source.users} visitors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900">{source.rev}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TOP PRODUCTS TABLE */}
        <Card className="!p-0 overflow-hidden shadow-sm border-slate-200">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white">
            <h3 className="text-base font-extrabold text-slate-900">Top Performing Products</h3>
            <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700">View All Products</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th className="pl-6 font-bold text-slate-600">Product</Th>
                  <Th className="font-bold text-slate-600">Category</Th>
                  <Th className="text-right font-bold text-slate-600">Orders</Th>
                  <Th className="text-right font-bold text-slate-600">Units Sold</Th>
                  <Th className="text-right font-bold text-slate-600">Revenue</Th>
                  <Th className="text-right font-bold text-slate-600">Growth</Th>
                  <Th className="text-right pr-6 font-bold text-slate-600">Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {topProducts.map((item) => (
                  <Tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <Td className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                          <ShoppingCart className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-xs font-medium text-slate-500 font-mono mt-0.5">{item.sku}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Badge variant="outline" className="bg-white text-slate-600 font-semibold text-xs border-slate-200">
                        {item.cat}
                      </Badge>
                    </Td>
                    <Td className="text-right font-bold text-slate-700">{item.orders.toLocaleString()}</Td>
                    <Td className="text-right font-bold text-slate-700">{item.units.toLocaleString()}</Td>
                    <Td className="text-right font-extrabold text-slate-900">{item.rev}</Td>
                    <Td className="text-right">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.growth.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {item.growth}
                      </span>
                    </Td>
                    <Td className="text-right pr-6">
                      <Badge 
                        variant={item.status === 'In Stock' ? 'success' : item.status === 'Low Stock' ? 'warning' : 'danger'}
                        className="text-[10px]"
                      >
                        {item.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
