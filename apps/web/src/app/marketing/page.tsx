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
  Download,
  Calendar,
  ChevronDown,
  RefreshCw,
  Store,
  ArrowUpRight,
  ArrowDownRight,
  MousePointerClick,
  Plus,
  Target,
  MessageCircle,
  Mail,
  Smartphone,
  LayoutTemplate,
  Zap,
  Activity,
  Megaphone,
  MoreHorizontal,
  X,
  Search,
  Users,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';

export default function MarketingDashboardPage() {
  const [dateRange, setDateRange] = useState('30D');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignStep, setCampaignStep] = useState(1);

  // Realistic mock data
  const performanceData = [
    { name: '1 Oct', revenue: 15000, spend: 3200, roas: 4.6 },
    { name: '5 Oct', revenue: 18000, spend: 3500, roas: 5.1 },
    { name: '10 Oct', revenue: 14000, spend: 3100, roas: 4.5 },
    { name: '15 Oct', revenue: 22000, spend: 4200, roas: 5.2 },
    { name: '20 Oct', revenue: 19000, spend: 3800, roas: 5.0 },
    { name: '25 Oct', revenue: 25000, spend: 4500, roas: 5.5 },
    { name: '30 Oct', revenue: 28000, spend: 4800, roas: 5.8 },
  ];

  const channelPerformance = [
    { channel: 'Meta Ads', spend: 'PKR 450k', revenue: 'PKR 2.1M', orders: 840, roas: '4.6x', conv: '3.2%' },
    { channel: 'Google Ads', spend: 'PKR 320k', revenue: 'PKR 1.8M', orders: 620, roas: '5.6x', conv: '4.1%' },
    { channel: 'TikTok Ads', spend: 'PKR 180k', revenue: 'PKR 650k', orders: 310, roas: '3.6x', conv: '2.4%' },
    { channel: 'Email Marketing', spend: 'PKR 25k', revenue: 'PKR 420k', orders: 180, roas: '16.8x', conv: '5.8%' },
    { channel: 'WhatsApp', spend: 'PKR 15k', revenue: 'PKR 280k', orders: 110, roas: '18.6x', conv: '8.2%' },
    { channel: 'SMS', spend: 'PKR 12k', revenue: 'PKR 140k', orders: 65, roas: '11.6x', conv: '4.5%' },
  ];

  const campaigns = [
    { id: '1', name: 'Winter Collection Launch', channel: 'Meta Ads', audience: 'All Customers', status: 'Running', budget: 'PKR 100k', spend: 'PKR 45k', revenue: 'PKR 210k', roas: '4.6x', conv: 84, updated: '2 hrs ago' },
    { id: '2', name: 'Black Friday Teaser', channel: 'Email', audience: 'VIP Customers', status: 'Scheduled', budget: '-', spend: '-', revenue: '-', roas: '-', conv: '-', updated: '5 hrs ago' },
    { id: '3', name: 'Abandoned Cart Recovery', channel: 'WhatsApp', audience: 'Cart Abandoners', status: 'Running', budget: 'Automated', spend: 'PKR 12k', revenue: 'PKR 185k', roas: '15.4x', conv: 62, updated: '1 day ago' },
    { id: '4', name: 'Search Brand Terms', channel: 'Google Ads', audience: 'Broad', status: 'Running', budget: 'PKR 5k/day', spend: 'PKR 142k', revenue: 'PKR 850k', roas: '5.9x', conv: 315, updated: '2 days ago' },
    { id: '5', name: 'Summer Clearance', channel: 'TikTok Ads', audience: 'Gen Z Focus', status: 'Completed', budget: 'PKR 50k', spend: 'PKR 50k', revenue: 'PKR 180k', roas: '3.6x', conv: 92, updated: '1 week ago' },
  ];

  const audiences = [
    { name: 'All Customers', size: '45.2k', growth: '+2.4%', engagement: 'Medium', lastActivity: 'Active' },
    { name: 'VIP / High Value', size: '2.8k', growth: '+5.1%', engagement: 'High', lastActivity: 'Active' },
    { name: 'Recent Buyers (30d)', size: '8.4k', growth: '+12.4%', engagement: 'High', lastActivity: 'Active' },
    { name: 'Abandoned Cart (48h)', size: '1.2k', growth: '-1.5%', engagement: 'Very High', lastActivity: 'Active' },
    { name: 'Inactive (>90d)', size: '14.5k', growth: '+0.8%', engagement: 'Low', lastActivity: 'Idle' },
  ];

  const recentActivity = [
    { title: 'Campaign Launched', desc: 'Winter Collection Launch started on Meta Ads', time: '2 hours ago', icon: Megaphone, color: 'text-brand-500', bg: 'bg-brand-50' },
    { title: 'Audience Updated', desc: 'VIP Customers segment grew by 45 profiles', time: '5 hours ago', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Email Delivered', desc: 'Newsletter sent to 24,500 subscribers (98% delivery rate)', time: '1 day ago', icon: Mail, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'WhatsApp Campaign', desc: 'Flash Sale notification completed', time: '2 days ago', icon: MessageCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Conversion Milestone', desc: 'Google Ads crossed PKR 1M in attributed revenue', time: '3 days ago', icon: Target, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const formatCurrency = (val: number | string | undefined) => `PKR ${(Number(val) / 1000).toFixed(1)}k`;

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Marketing</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Create, manage and measure campaigns across every customer channel.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hidden sm:flex">
              <Store className="w-4 h-4 mr-2 text-slate-500" />
              All Stores
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <Button variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100">
              <Calendar className="w-4 h-4 mr-2 text-slate-500" />
              Oct 1 - Oct 31, 2026
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hidden sm:flex">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm" onClick={() => setIsCampaignModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Create Campaign', icon: Megaphone, color: 'text-brand-600', bg: 'bg-brand-50' },
            { label: 'Create Audience', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Create Template', icon: LayoutTemplate, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Send Message', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Automation', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((action, i) => (
            <button key={i} className="flex flex-col items-center justify-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group">
              <div className={`w-12 h-12 rounded-xl ${action.bg} ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-700">{action.label}</span>
            </button>
          ))}
        </div>

        {/* KPI ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> 12.4%
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Total Ad Spend</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">PKR 950k</div>
              <p className="text-xs font-medium text-slate-400 mt-2">vs PKR 845k last period</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> 24.2%
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Revenue Attributed</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">PKR 5.2M</div>
              <p className="text-xs font-medium text-slate-400 mt-2">vs PKR 4.1M last period</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> 8.5%
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Average ROAS</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">5.47x</div>
              <p className="text-xs font-medium text-slate-400 mt-2">vs 5.04x last period</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> 15.2%
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Attributed Orders</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">2,115</div>
              <p className="text-xs font-medium text-slate-400 mt-2">vs 1,835 last period</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group md:col-span-3 xl:col-span-1">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 group-hover:scale-110 transition-transform">
                  <MousePointerClick className="w-5 h-5" />
                </div>
                <Badge variant="danger" className="bg-red-50 text-red-700 border-red-100 flex items-center gap-1">
                  <ArrowDownRight className="w-3 h-3" /> 0.8%
                </Badge>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Conversion Rate</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">4.12%</div>
              <p className="text-xs font-medium text-slate-400 mt-2">vs 4.15% last period</p>
            </CardContent>
          </Card>
        </div>

        {/* MARKETING PERFORMANCE */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Marketing Performance</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Attributed revenue vs ad spend</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 mr-4 hidden sm:flex">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-brand-500"></div>
                    <span className="text-xs font-bold text-slate-600">Revenue</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                    <span className="text-xs font-bold text-slate-600">Spend</span>
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
                <ComposedChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tickFormatter={(val) => formatCurrency(val)} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px 16px' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                    labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '8px' }}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    formatter={(value: any, name: any) => [`PKR ${Number(value).toLocaleString()}`, String(name)]}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
                  <Line yAxisId="left" type="monotone" dataKey="spend" name="Spend" stroke="#fb923c" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0, fill: '#fb923c' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* CHANNEL & AUDIENCE */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-0">
              <div className="p-5 border-b border-slate-200">
                <h3 className="text-base font-extrabold text-slate-900">Channel Performance</h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <Thead>
                    <Tr>
                      <Th className="pl-6 font-bold text-slate-600">Channel</Th>
                      <Th className="text-right font-bold text-slate-600">Spend</Th>
                      <Th className="text-right font-bold text-slate-600">Revenue</Th>
                      <Th className="text-right font-bold text-slate-600">ROAS</Th>
                      <Th className="text-right pr-6 font-bold text-slate-600">Conv %</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {channelPerformance.map((item, i) => (
                      <Tr key={i} className="hover:bg-slate-50/50">
                        <Td className="pl-6 font-bold text-slate-900">{item.channel}</Td>
                        <Td className="text-right font-medium text-slate-600">{item.spend}</Td>
                        <Td className="text-right font-extrabold text-slate-900">{item.revenue}</Td>
                        <Td className="text-right">
                          <Badge variant="outline" className="bg-white font-bold text-emerald-600 border-emerald-200">{item.roas}</Badge>
                        </Td>
                        <Td className="text-right pr-6 font-semibold text-slate-600">{item.conv}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-0">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-base font-extrabold text-slate-900">Audience Overview</h3>
                <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700">Manage</Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <Thead>
                    <Tr>
                      <Th className="pl-6 font-bold text-slate-600">Audience</Th>
                      <Th className="text-right font-bold text-slate-600">Size</Th>
                      <Th className="text-right font-bold text-slate-600">Growth</Th>
                      <Th className="text-right pr-6 font-bold text-slate-600">Engagement</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {audiences.map((item, i) => (
                      <Tr key={i} className="hover:bg-slate-50/50">
                        <Td className="pl-6 font-bold text-slate-900">{item.name}</Td>
                        <Td className="text-right font-bold text-slate-700">{item.size}</Td>
                        <Td className="text-right">
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.growth.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            {item.growth}
                          </span>
                        </Td>
                        <Td className="text-right pr-6">
                          <Badge 
                            variant={item.engagement === 'High' || item.engagement === 'Very High' ? 'success' : item.engagement === 'Medium' ? 'warning' : 'default'}
                            className="text-[10px]"
                          >
                            {item.engagement}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CAMPAIGNS & RECENT ACTIVITY */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <Card className="xl:col-span-3 !p-0 overflow-hidden shadow-sm border-slate-200">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
              <h3 className="text-base font-extrabold text-slate-900">Active & Recent Campaigns</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search campaigns..." 
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-full sm:w-64"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <Thead>
                  <Tr>
                    <Th className="pl-6 font-bold text-slate-600">Campaign</Th>
                    <Th className="font-bold text-slate-600">Channel</Th>
                    <Th className="font-bold text-slate-600">Status</Th>
                    <Th className="text-right font-bold text-slate-600">Spend</Th>
                    <Th className="text-right font-bold text-slate-600">Revenue</Th>
                    <Th className="text-right font-bold text-slate-600">ROAS</Th>
                    <Th className="text-right pr-6 font-bold text-slate-600"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {campaigns.map((item) => (
                    <Tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <Td className="pl-6">
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">{item.audience}</p>
                        </div>
                      </Td>
                      <Td>
                        <span className="font-semibold text-slate-700">{item.channel}</span>
                      </Td>
                      <Td>
                        <Badge 
                          variant={item.status === 'Running' ? 'success' : item.status === 'Scheduled' ? 'info' : item.status === 'Completed' ? 'default' : 'warning'}
                          className="text-[10px]"
                        >
                          {item.status}
                        </Badge>
                      </Td>
                      <Td className="text-right font-semibold text-slate-600">{item.spend}</Td>
                      <Td className="text-right font-extrabold text-slate-900">{item.revenue}</Td>
                      <Td className="text-right">
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded-md">
                          {item.roas}
                        </span>
                      </Td>
                      <Td className="text-right pr-6">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-slate-400" />
                <h3 className="text-base font-extrabold text-slate-900">Recent Activity</h3>
              </div>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-slate-100 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 overflow-hidden">
                      <div className={`w-full h-full flex items-center justify-center ${activity.bg} ${activity.color}`}>
                        <activity.icon className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{activity.title}</h4>
                      </div>
                      <p className="text-xs font-medium text-slate-500 mb-2 leading-relaxed">{activity.desc}</p>
                      <time className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{activity.time}</time>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* CREATE CAMPAIGN MODAL FOUNDATION */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCampaignModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-extrabold text-slate-900">Create New Campaign</h2>
              <button onClick={() => setIsCampaignModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Steps */}
              <div className="w-48 bg-slate-50 border-r border-slate-100 p-4 hidden md:block overflow-y-auto">
                <div className="space-y-2 relative before:absolute before:inset-0 before:ml-[27px] before:h-[calc(100%-40px)] before:top-[20px] before:w-0.5 before:bg-slate-200">
                  {['Campaign Details', 'Audience', 'Channel', 'Content', 'Budget', 'Schedule', 'Review & Launch'].map((step, idx) => {
                    const stepNum = idx + 1;
                    const isActive = campaignStep === stepNum;
                    const isPast = campaignStep > stepNum;
                    return (
                      <div key={step} className="relative flex items-center gap-3 py-2 z-10 cursor-pointer group" onClick={() => setCampaignStep(stepNum)}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          isActive ? 'bg-brand-600 text-white border-2 border-brand-100 ring-4 ring-brand-50' : 
                          isPast ? 'bg-emerald-500 text-white border-2 border-emerald-100' : 'bg-white text-slate-400 border border-slate-200 group-hover:border-brand-300 group-hover:text-brand-500'
                        }`}>
                          {isPast ? <CheckCircle2 className="w-3 h-3" /> : stepNum}
                        </div>
                        <span className={`text-xs font-bold transition-colors ${isActive ? 'text-brand-700' : isPast ? 'text-slate-700' : 'text-slate-500 group-hover:text-brand-500'}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Content Area */}
              <div className="flex-1 p-6 overflow-y-auto bg-white">
                <div className="mb-6">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {['Campaign Details', 'Audience', 'Channel', 'Content', 'Budget', 'Schedule', 'Review & Launch'][campaignStep - 1]}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Configure your campaign settings for this step.</p>
                </div>
                
                <div className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/50 text-center px-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <Megaphone className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-bold">UI Foundation for Step {campaignStep}</p>
                  <p className="text-slate-400 font-medium text-sm mt-1">Backend integration required</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white">
              <Button variant="outline" className="text-slate-600 font-bold bg-white" onClick={() => setCampaignStep(Math.max(1, campaignStep - 1))} disabled={campaignStep === 1}>
                Back
              </Button>
              <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 shadow-sm" onClick={() => {
                if (campaignStep < 7) setCampaignStep(campaignStep + 1);
                else setIsCampaignModalOpen(false);
              }}>
                {campaignStep === 7 ? 'Launch Campaign' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
