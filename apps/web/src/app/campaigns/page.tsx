'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  Megaphone,
  Plus,
  BarChart2,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  TrendingUp,
  Target
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function CampaignsDashboardPage() {
  const [campaigns] = useState([
    {
      id: 'cmp_101',
      name: 'Summer Mega Sale 2026',
      channel: 'WHATSAPP',
      status: 'COMPLETED',
      totalRecipients: 1250,
      sentCount: 1240,
      deliveredCount: 1210,
      readCount: 980,
      failedCount: 10,
      createdAt: '2026-09-01',
      conversion: '4.2%',
      revenue: 'PKR 145,000'
    },
    {
      id: 'cmp_102',
      name: 'VIP Customer Retention Promo',
      channel: 'EMAIL',
      status: 'SCHEDULED',
      totalRecipients: 450,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      failedCount: 0,
      createdAt: '2026-09-04',
      conversion: '-',
      revenue: '-'
    },
    {
      id: 'cmp_103',
      name: 'Abandoned Cart Recovery (Auto)',
      channel: 'WHATSAPP',
      status: 'ACTIVE',
      totalRecipients: 85,
      sentCount: 85,
      deliveredCount: 82,
      readCount: 65,
      failedCount: 3,
      createdAt: '2026-09-03',
      conversion: '12.5%',
      revenue: 'PKR 45,200'
    },
    {
      id: 'cmp_104',
      name: 'New Collection Launch',
      channel: 'EMAIL',
      status: 'DRAFT',
      totalRecipients: 5400,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      failedCount: 0,
      createdAt: '2026-09-05',
      conversion: '-',
      revenue: '-'
    },
  ]);

  const chartData = [
    { name: 'Sep 1', sent: 1200, converted: 45 },
    { name: 'Sep 2', sent: 800, converted: 30 },
    { name: 'Sep 3', sent: 1500, converted: 85 },
    { name: 'Sep 4', sent: 2100, converted: 120 },
    { name: 'Sep 5', sent: 900, converted: 40 },
    { name: 'Sep 6', sent: 3500, converted: 210 },
    { name: 'Sep 7', sent: 1800, converted: 95 },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketing</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage campaigns, broadcasts, and audience engagement.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex bg-white">
              <BarChart2 className="w-4 h-4 mr-2 text-slate-400" /> View Reports
            </Button>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" /> Create Campaign
            </Button>
          </div>
        </div>

        {/* Top Content Split */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start">
          
          {/* Main Chart */}
          <Card className="flex flex-col h-full">
            <CardContent className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Campaign Performance</h3>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Sent messages vs conversions</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-500"></div>
                    <span className="text-sm font-semibold text-slate-600">Sent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                    <span className="text-sm font-semibold text-slate-600">Converted</span>
                  </div>
                </div>
              </div>
              <div className="h-[220px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px 16px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#0f172a' }}
                    />
                    <Area type="monotone" dataKey="sent" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSent)" />
                    <Area type="monotone" dataKey="converted" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorConverted)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Sidebar */}
          <div className="flex flex-col gap-4">
            <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Active Campaigns</p>
                  <div className="text-2xl font-extrabold text-slate-900">4</div>
                  <p className="text-xs font-medium text-slate-500 mt-1">1 scheduled for tomorrow</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Avg Conversion</p>
                  <div className="text-2xl font-extrabold text-slate-900">3.8%</div>
                  <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +1.2% vs last month
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Audience Reach</p>
                  <div className="text-2xl font-extrabold text-slate-900">12.4k</div>
                  <p className="text-xs font-medium text-slate-500 mt-1">Total engaged contacts</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filter Bar */}
        <Card className="p-2 flex flex-col md:flex-row gap-2 items-center mt-6">
          <div className="relative w-full md:flex-1 md:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full pl-9 pr-4 py-2 bg-transparent border-none text-sm focus:outline-none focus:ring-0"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <Button variant="outline" size="sm" className="whitespace-nowrap bg-white text-slate-700">
              All Channels <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap bg-white text-slate-700">
              All Statuses <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap bg-white text-slate-700">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" /> Created Date <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card className="!p-0 overflow-hidden">
          <Table>
            <Thead>
              <Tr>
                <Th className="pl-6">Campaign</Th>
                <Th>Status</Th>
                <Th>Recipients</Th>
                <Th>Engagement</Th>
                <Th>Conversion</Th>
                <Th>Revenue</Th>
                <Th className="text-right pr-6"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {campaigns.map((c) => (
                <Tr key={c.id}>
                  <Td className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border
                        ${c.channel === 'WHATSAPP' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}
                      `}>
                        {c.channel === 'WHATSAPP' ? <MessageCircle className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Created: {c.createdAt}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={
                      c.status === 'COMPLETED' ? 'success' : 
                      c.status === 'ACTIVE' ? 'info' : 
                      c.status === 'SCHEDULED' ? 'warning' : 'default'
                    } className="text-[10px]">
                      {c.status}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="font-bold text-slate-900">{c.totalRecipients.toLocaleString()}</div>
                    <div className="text-[11px] font-medium text-slate-500">Total Audience</div>
                  </Td>
                  <Td>
                    <div className="flex flex-col gap-1 w-full max-w-[120px]">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-500">Delivered</span>
                        <span className="font-bold text-slate-900">
                          {c.totalRecipients > 0 ? Math.round((c.deliveredCount / c.totalRecipients) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${c.totalRecipients > 0 ? (c.deliveredCount / c.totalRecipients) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={c.conversion !== '-' ? 'success' : 'default'} className="bg-transparent border-none shadow-none !p-0">
                      {c.conversion}
                    </Badge>
                  </Td>
                  <Td className="font-bold text-slate-900">{c.revenue}</Td>
                  <Td className="text-right pr-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-lg">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>

      </div>
    </DashboardLayout>
  );
}
