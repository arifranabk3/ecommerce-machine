'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp,
  ShoppingBag,
  Download,
  ChevronDown,
  Store,
  ArrowUpRight,
  ArrowDownRight,
  MousePointerClick,
  Plus,
  MessageCircle,
  Mail,
  Zap,
  Activity,
  MoreHorizontal,
  Search,
  Filter,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  GitBranch,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  Settings
} from 'lucide-react';

export default function AutomationsDashboardPage() {
  const [view, setView] = useState<'list' | 'builder'>('list');

  // Realistic mock data
  const kpis = [
    { title: 'Active Automations', value: '24', trend: '+3', trendUp: true, icon: Zap, color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-100' },
    { title: 'Runs This Month', value: '142.5k', trend: '+12.4%', trendUp: true, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { title: 'Customers Reached', value: '84.2k', trend: '+8.1%', trendUp: true, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { title: 'Conversion Rate', value: '4.8%', trend: '+0.5%', trendUp: true, icon: MousePointerClick, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
    { title: 'Revenue Generated', value: 'PKR 4.2M', trend: '-2.1%', trendUp: false, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  ];

  const automations = [
    { id: '1', name: 'Abandoned Cart Recovery', trigger: 'Cart Abandoned', actions: 3, audience: 'All', runs: '45.2k', success: '98.5%', revenue: 'PKR 1.2M', status: 'Active', lastRun: '2 mins ago' },
    { id: '2', name: 'Welcome New Customer', trigger: 'Customer Created', actions: 2, audience: 'New', runs: '12.4k', success: '99.9%', revenue: 'PKR 850k', status: 'Active', lastRun: '15 mins ago' },
    { id: '3', name: 'VIP Customer Journey', trigger: 'Order Value > 50k', actions: 5, audience: 'High Value', runs: '2.1k', success: '100%', revenue: 'PKR 2.1M', status: 'Active', lastRun: '1 hr ago' },
    { id: '4', name: 'Low Stock Alert (Internal)', trigger: 'Inventory < 10', actions: 1, audience: 'Staff', runs: '840', success: '100%', revenue: '-', status: 'Paused', lastRun: '2 days ago' },
    { id: '5', name: 'Post Purchase Follow-up', trigger: 'Order Fulfilled', actions: 4, audience: 'Buyers', runs: '8.5k', success: '85.2%', revenue: 'PKR 420k', status: 'Failed', lastRun: '5 mins ago' },
    { id: '6', name: 'Birthday Campaign', trigger: 'Date = Birthday', actions: 2, audience: 'All', runs: '0', success: '-', revenue: '-', status: 'Draft', lastRun: '-' },
  ];

  const templates = [
    { name: 'Welcome Series', desc: 'Onboard new customers with a 3-part email series.', trigger: 'Customer Created', steps: 4, impact: 'High', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Abandoned Cart', desc: 'Recover lost sales with multi-channel reminders.', trigger: 'Cart Abandoned', steps: 5, impact: 'Very High', icon: ShoppingBag, color: 'text-brand-500', bg: 'bg-brand-50' },
    { name: 'Win Back', desc: 'Re-engage customers who haven\'t purchased in 90 days.', trigger: 'Schedule (90d inactive)', steps: 3, impact: 'Medium', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'VIP Journey', desc: 'Reward high-value customers with exclusive offers.', trigger: 'Order Value Threshold', steps: 6, impact: 'High', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const renderBuilderView = () => (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50 rounded-2xl border border-slate-200 shadow-inner overflow-hidden relative">
      {/* Builder Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setView('list')}>
            ← Back
          </Button>
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              Abandoned Cart Recovery 
              <Badge variant="success" className="bg-emerald-50 text-emerald-700 text-[10px]">Active</Badge>
            </h2>
            <p className="text-xs text-slate-500 font-medium">Last edited 2 hours ago by Arif</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white">Test Flow</Button>
          <Button variant="primary" size="sm" className="bg-brand-600 hover:bg-brand-700">Publish Changes</Button>
        </div>
      </div>

      {/* Builder Canvas Area */}
      <div className="flex-1 overflow-auto p-8 relative flex justify-center">
        <div className="max-w-3xl w-full flex flex-col items-center pb-32">
          
          {/* Node: Trigger */}
          <div className="w-80 bg-white border border-brand-200 shadow-sm rounded-xl overflow-hidden group hover:border-brand-400 transition-colors cursor-pointer z-10 relative">
            <div className="bg-brand-50 p-3 border-b border-brand-100 flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-brand-100 text-brand-600 flex items-center justify-center">
                <Zap className="w-3 h-3" />
              </div>
              <span className="font-bold text-brand-900 text-sm">TRIGGER</span>
            </div>
            <div className="p-4">
              <p className="font-extrabold text-slate-900">Customer abandons checkout</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Fires when a checkout is abandoned for 1 hour.</p>
            </div>
            {/* Connector Line out */}
            <div className="absolute -bottom-6 left-1/2 w-0.5 h-6 bg-slate-300"></div>
          </div>

          {/* Add Node Button */}
          <div className="h-6 w-0.5 bg-slate-300 relative">
            <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border border-slate-300 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-400 transition-colors z-20">
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Node: Condition */}
          <div className="w-80 bg-white border border-blue-200 shadow-sm rounded-xl overflow-hidden group hover:border-blue-400 transition-colors cursor-pointer z-10 relative">
            <div className="bg-blue-50 p-3 border-b border-blue-100 flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                <GitBranch className="w-3 h-3" />
              </div>
              <span className="font-bold text-blue-900 text-sm">CONDITION</span>
            </div>
            <div className="p-4">
              <p className="font-extrabold text-slate-900">Cart Value &gt; PKR 10,000</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Check if cart total exceeds 10k.</p>
            </div>
          </div>

          {/* Branching Logic */}
          <div className="relative w-[320px] h-12 flex justify-between z-0">
            {/* Horizontal connection */}
            <div className="absolute top-0 left-10 right-10 h-6 border-b-2 border-r-2 border-l-2 border-slate-300 rounded-b-xl border-t-0"></div>
            {/* Vertical drop down left */}
            <div className="absolute top-6 left-10 w-0.5 h-6 bg-slate-300"></div>
            {/* Vertical drop down right */}
            <div className="absolute top-6 right-10 w-0.5 h-6 bg-slate-300"></div>
          </div>

          <div className="flex w-[480px] justify-between z-10">
            {/* LEFT BRANCH (YES) */}
            <div className="flex flex-col items-center">
              <Badge variant="success" className="bg-emerald-50 text-emerald-700 mb-2 border border-emerald-200 font-bold z-10 bg-white shadow-sm">YES</Badge>
              {/* Node: Action (WhatsApp) */}
              <div className="w-64 bg-white border border-emerald-200 shadow-sm rounded-xl overflow-hidden group hover:border-emerald-400 transition-colors cursor-pointer">
                <div className="bg-emerald-50 p-3 border-b border-emerald-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <MessageCircle className="w-3 h-3" />
                  </div>
                  <span className="font-bold text-emerald-900 text-sm">ACTION</span>
                </div>
                <div className="p-4">
                  <p className="font-extrabold text-slate-900">Send WhatsApp Message</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Template: High Value Abandon</p>
                </div>
              </div>
              <div className="h-6 w-0.5 bg-slate-300"></div>
              {/* Node: End */}
              <div className="w-16 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">End</div>
            </div>

            {/* RIGHT BRANCH (NO) */}
            <div className="flex flex-col items-center">
              <Badge variant="default" className="bg-slate-100 text-slate-700 mb-2 border border-slate-200 font-bold z-10 bg-white shadow-sm">NO</Badge>
              {/* Node: Action (Email) */}
              <div className="w-64 bg-white border border-purple-200 shadow-sm rounded-xl overflow-hidden group hover:border-purple-400 transition-colors cursor-pointer">
                <div className="bg-purple-50 p-3 border-b border-purple-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Mail className="w-3 h-3" />
                  </div>
                  <span className="font-bold text-purple-900 text-sm">ACTION</span>
                </div>
                <div className="p-4">
                  <p className="font-extrabold text-slate-900">Send Email</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Template: Standard Abandon</p>
                </div>
              </div>
              <div className="h-6 w-0.5 bg-slate-300"></div>
              {/* Node: End */}
              <div className="w-16 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">End</div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        <div className="flex bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <button className="px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold border-r border-slate-200">-</button>
          <button className="px-3 py-2 text-slate-900 text-sm font-bold bg-slate-50">100%</button>
          <button className="px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold border-l border-slate-200">+</button>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Automations</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Automate customer journeys, marketing campaigns, and commerce workflows.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hidden sm:flex">
              <Store className="w-4 h-4 mr-2 text-slate-500" />
              All Stores
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search automations..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-64"
              />
            </div>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hidden sm:flex">
              <Download className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm" onClick={() => setView('builder')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Automation
            </Button>
          </div>
        </div>

        {view === 'builder' ? renderBuilderView() : (
          <>
            {/* KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {kpis.map((kpi, i) => (
                <Card key={i} className={`hover:shadow-md transition-shadow duration-300 border-slate-200/60 group`}>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center border ${kpi.border} group-hover:scale-110 transition-transform`}>
                        <kpi.icon className="w-5 h-5" />
                      </div>
                      <Badge variant={kpi.trendUp ? 'success' : 'danger'} className={`${kpi.trendUp ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'} flex items-center gap-1`}>
                        {kpi.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {kpi.trend}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-1">{kpi.title}</p>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AUTOMATION HEALTH */}
            <Card className="shadow-sm border-slate-200 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-l-red-500">
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Action Required: Post Purchase Follow-up</h3>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">Failed to send 12 emails in the last hour. Error: SMTP connection timeout.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="text-right hidden sm:block mr-4">
                    <p className="text-xs font-bold text-slate-500">Next Retry</p>
                    <p className="text-sm font-extrabold text-slate-900">in 5 mins</p>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white border-red-200 text-red-700 hover:bg-red-50 w-full sm:w-auto">View Logs</Button>
                  <Button variant="primary" size="sm" className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-white">Retry Failed</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* AUTOMATION LIST */}
              <Card className="xl:col-span-3 !p-0 overflow-hidden shadow-sm border-slate-200">
                <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white">
                  <h3 className="text-base font-extrabold text-slate-900">Your Automations</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-500"><Filter className="w-4 h-4 mr-2"/>Filter</Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th className="pl-6 font-bold text-slate-600">Automation</Th>
                        <Th className="font-bold text-slate-600">Trigger</Th>
                        <Th className="font-bold text-slate-600">Status</Th>
                        <Th className="text-right font-bold text-slate-600">Runs</Th>
                        <Th className="text-right font-bold text-slate-600">Success</Th>
                        <Th className="text-right font-bold text-slate-600">Revenue</Th>
                        <Th className="text-right pr-6 font-bold text-slate-600"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {automations.map((item) => (
                        <Tr key={item.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setView('builder')}>
                          <Td className="pl-6">
                            <div>
                              <p className="font-bold text-slate-900">{item.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-medium text-slate-500">{item.audience}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-xs font-medium text-slate-500">{item.actions} actions</span>
                              </div>
                            </div>
                          </Td>
                          <Td>
                            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">{item.trigger}</span>
                          </Td>
                          <Td>
                            <Badge 
                              variant={item.status === 'Active' ? 'success' : item.status === 'Paused' ? 'warning' : item.status === 'Failed' ? 'danger' : 'default'}
                              className="text-[10px]"
                            >
                              {item.status}
                            </Badge>
                          </Td>
                          <Td className="text-right font-semibold text-slate-600">{item.runs}</Td>
                          <Td className="text-right font-semibold text-slate-600">
                            {item.success !== '-' && (
                              <span className={parseFloat(item.success) < 90 ? 'text-red-500' : 'text-emerald-500'}>{item.success}</span>
                            )}
                            {item.success === '-' && '-'}
                          </Td>
                          <Td className="text-right font-extrabold text-slate-900">{item.revenue}</Td>
                          <Td className="text-right pr-6">
                            <div className="flex items-center justify-end gap-1" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                              {item.status === 'Active' ? (
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-orange-500"><Pause className="w-4 h-4" /></Button>
                              ) : (
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-500"><Play className="w-4 h-4" /></Button>
                              )}
                              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-700"><MoreHorizontal className="w-4 h-4" /></Button>
                            </div>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </Card>

              {/* TEMPLATES */}
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 px-2">Automation Templates</h3>
                <div className="grid grid-cols-1 gap-4">
                  {templates.map((tpl, i) => (
                    <Card key={i} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow cursor-pointer group">
                      <CardContent className="p-4 flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl ${tpl.bg} ${tpl.color} flex items-center justify-center shrink-0`}>
                            <tpl.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">{tpl.name}</h4>
                            <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-2">{tpl.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{tpl.steps} Steps</span>
                          </div>
                          <span className="text-xs font-bold text-brand-600 group-hover:underline">Use Template &rarr;</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
