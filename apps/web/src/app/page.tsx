'use client';
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Box,
  CheckCircle2,
  Package
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function DashboardPage() {
  const chartData = [
    { name: 'Mon', revenue: 4000, previous: 2400 },
    { name: 'Tue', revenue: 3000, previous: 1398 },
    { name: 'Wed', revenue: 6000, previous: 9800 },
    { name: 'Thu', revenue: 8780, previous: 3908 },
    { name: 'Fri', revenue: 9890, previous: 4800 },
    { name: 'Sat', revenue: 11390, previous: 3800 },
    { name: 'Sun', revenue: 14490, previous: 4300 },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-12 animate-fade-in">
        
        {/* Header & Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-content-primary tracking-tight">Good morning</h1>
            <p className="text-content-secondary text-base mt-1.5 font-medium">Here's what's happening with your store today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-surface">
              Share Report
            </Button>
            <Button variant="primary">
              View Analytics
            </Button>
          </div>
        </div>

        {/* High-Level KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Revenue', value: '$128,420', trend: '+18.4%', up: true, icon: TrendingUp },
            { label: 'Orders', value: '1,248', trend: '+4.2%', up: true, icon: ShoppingBag },
            { label: 'Customers', value: '842', trend: '+12.1%', up: true, icon: Users },
            { label: 'Avg. Order Value', value: '$102.90', trend: '-1.4%', up: false, icon: CreditCard },
          ].map((stat, i) => (
            <Card key={i} className="hover:border-border-subtle hover:shadow-premium-hover transition-all duration-300">
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[11px] font-bold text-content-muted uppercase tracking-widest">{stat.label}</span>
                  <div className="p-2 bg-surface-secondary rounded-lg">
                    <stat.icon className="w-4 h-4 text-content-secondary" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-content-primary mb-2 tracking-tight">{stat.value}</div>
                  <div className={`flex items-center text-sm font-bold ${stat.up ? 'text-success-text' : 'text-danger-text'}`}>
                    {stat.up ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {stat.trend}
                    <span className="text-content-muted font-medium ml-1.5">vs last 7 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart & Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Revenue Chart */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-content-primary">Revenue Overview</h2>
                    <p className="text-sm font-medium text-content-secondary mt-1">Total store revenue across all channels.</p>
                  </div>
                  <div className="flex bg-surface-secondary p-1 rounded-lg border border-border">
                    {['7D', '30D', '90D', '12M'].map((period, i) => (
                      <button
                        key={period}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                          i === 0 ? 'bg-surface text-content-primary shadow-sm' : 'text-content-muted hover:text-content-primary'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="h-[300px] w-full mt-4 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6D4AFF" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#6D4AFF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#98A2B3', fontSize: 12, fontWeight: 500 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#98A2B3', fontSize: 12, fontWeight: 500 }}
                        tickFormatter={(value) => `$${value/1000}k`}
                      />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                        itemStyle={{ color: '#111827', fontWeight: 600 }}
                        labelStyle={{ color: '#667085', fontWeight: 500, marginBottom: '4px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="previous" 
                        stroke="#06B6D4" 
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        fill="transparent" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#6D4AFF" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity / Tasks */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="p-5 border-b border-border flex justify-between items-center">
                  <h3 className="text-sm font-bold text-content-primary">Action Needed</h3>
                  <Badge variant="warning">3</Badge>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { title: 'Fulfill 12 expedited orders', icon: Package, color: 'text-warning-text', bg: 'bg-warning-subtle' },
                    { title: 'Restock "AirMax Pro" (Low Inv)', icon: Box, color: 'text-brand-600', bg: 'bg-brand-50' },
                    { title: 'Review 2 chargeback disputes', icon: CreditCard, color: 'text-danger-text', bg: 'bg-danger-subtle' },
                  ].map((task, i) => (
                    <div key={i} className="p-4 flex gap-4 hover:bg-surface-hover transition-colors cursor-pointer group">
                      <div className={`w-10 h-10 rounded-lg ${task.bg} ${task.color} flex items-center justify-center shrink-0`}>
                        <task.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-content-primary group-hover:text-brand-600 transition-colors">{task.title}</div>
                        <div className="text-xs text-content-secondary mt-1 font-medium">Due today</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
        
        {/* Secondary Row (Recent Orders) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-0">
              <div className="p-5 border-b border-border flex justify-between items-center">
                <h3 className="text-sm font-bold text-content-primary">Recent Orders</h3>
                <Button variant="ghost" size="sm" className="h-8">View All</Button>
              </div>
              <div className="divide-y divide-border">
                {[1,2,3].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-hover transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center font-bold text-content-secondary text-xs">
                        {['SJ', 'MC', 'ET'][i-1]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-content-primary">Order #SZ-1028{4-i}</div>
                        <div className="text-[11px] text-content-secondary mt-0.5">Placed 2 hours ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-content-primary">${[299, 45, 120][i-1]}.00</div>
                      <Badge variant="success" className="mt-1">Paid</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
