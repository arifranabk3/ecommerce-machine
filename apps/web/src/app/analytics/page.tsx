'use client';

import React from 'react';
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
  BarChart2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
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
  Bar
} from 'recharts';

export default function AnalyticsDashboardPage() {
  const areaData = [
    { name: 'Mon', revenue: 4000, profit: 2400 },
    { name: 'Tue', revenue: 3000, profit: 1398 },
    { name: 'Wed', revenue: 2000, profit: 9800 },
    { name: 'Thu', revenue: 2780, profit: 3908 },
    { name: 'Fri', revenue: 1890, profit: 4800 },
    { name: 'Sat', revenue: 2390, profit: 3800 },
    { name: 'Sun', revenue: 3490, profit: 4300 },
  ];

  const barData = [
    { name: 'Electronics', sales: 4000 },
    { name: 'Fashion', sales: 3000 },
    { name: 'Home', sales: 2000 },
    { name: 'Beauty', sales: 2780 },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Analyze your store performance and business metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" />
              Last 7 Days
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <Button variant="primary">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Total Revenue</p>
                  <div className="text-3xl font-extrabold text-slate-900">PKR 124.5k</div>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <span className="text-emerald-600 font-bold flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                      <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12.5%
                    </span>
                    <span className="text-slate-400 font-semibold">vs last 7 days</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Total Orders</p>
                  <div className="text-3xl font-extrabold text-slate-900">1,420</div>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <span className="text-emerald-600 font-bold flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                      <ArrowUpRight className="w-3 h-3 mr-0.5" /> 8.2%
                    </span>
                    <span className="text-slate-400 font-semibold">vs last 7 days</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Conversion Rate</p>
                  <div className="text-3xl font-extrabold text-slate-900">3.24%</div>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <span className="text-red-600 font-bold flex items-center bg-red-50 px-1.5 py-0.5 rounded">
                      <ArrowDownRight className="w-3 h-3 mr-0.5" /> 1.1%
                    </span>
                    <span className="text-slate-400 font-semibold">vs last 7 days</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                  <PieChart className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 mb-1">Avg Order Value</p>
                  <div className="text-3xl font-extrabold text-slate-900">PKR 3,450</div>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <span className="text-emerald-600 font-bold flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                      <ArrowUpRight className="w-3 h-3 mr-0.5" /> 4.3%
                    </span>
                    <span className="text-slate-400 font-semibold">vs last 7 days</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Revenue & Profit Over Time</h3>
                  <p className="text-sm text-slate-500 font-medium">Daily breakdown for the selected period.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-500"></div>
                    <span className="text-sm font-semibold text-slate-600">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <span className="text-sm font-semibold text-slate-600">Profit</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px 16px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#0f172a' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="profit" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-base font-bold text-slate-900">Sales by Category</h3>
                <p className="text-sm text-slate-500 font-medium">Top performing product categories.</p>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} width={80} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px 16px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="sales" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="!p-0 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Top Selling Products</h3>
            </div>
            <div className="flex-1 overflow-x-auto">
              <Table>
                <Thead>
                  <Tr>
                    <Th>Product</Th>
                    <Th className="text-right">Units</Th>
                    <Th className="text-right pr-6">Revenue</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[
                    { name: 'Wireless Earbuds Pro', units: 342, rev: 'PKR 1.2M' },
                    { name: 'Smart Watch Series 5', units: 215, rev: 'PKR 850K' },
                    { name: 'Ergonomic Chair', units: 180, rev: 'PKR 2.4M' },
                    { name: 'Mechanical Keyboard', units: 145, rev: 'PKR 435K' },
                    { name: 'USB-C Hub', units: 120, rev: 'PKR 180K' },
                  ].map((item, i) => (
                    <Tr key={i}>
                      <Td className="font-bold text-slate-900">{item.name}</Td>
                      <Td className="text-right font-semibold text-slate-600">{item.units}</Td>
                      <Td className="text-right font-extrabold text-slate-900 pr-6">{item.rev}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </Card>

          <Card className="!p-0 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Top Markets</h3>
            </div>
            <div className="flex-1 overflow-x-auto">
              <Table>
                <Thead>
                  <Tr>
                    <Th>Country / Region</Th>
                    <Th className="text-right">Orders</Th>
                    <Th className="text-right pr-6">Revenue</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[
                    { name: 'Pakistan', units: 1250, rev: 'PKR 4.2M' },
                    { name: 'United Arab Emirates', units: 85, rev: 'PKR 850K' },
                    { name: 'Saudi Arabia', units: 45, rev: 'PKR 450K' },
                    { name: 'United Kingdom', units: 25, rev: 'PKR 350K' },
                    { name: 'United States', units: 15, rev: 'PKR 280K' },
                  ].map((item, i) => (
                    <Tr key={i}>
                      <Td className="font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">
                          <Globe className="w-3 h-3 text-slate-400" />
                        </div>
                        {item.name}
                      </Td>
                      <Td className="text-right font-semibold text-slate-600">{item.units}</Td>
                      <Td className="text-right font-extrabold text-slate-900 pr-6">{item.rev}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
