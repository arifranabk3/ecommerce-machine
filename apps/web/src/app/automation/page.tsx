'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  Zap, 
  Settings2, 
  Play, 
  Pause, 
  AlertTriangle, 
  Clock,
  Activity,
  CheckCircle2,
  MoreHorizontal,
  Plus,
  Box,
  ShoppingCart,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function AutomationDashboardPage() {
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  const workflows = [
    {
      id: 'wf_1',
      name: 'Low Stock Procurement Trigger',
      trigger: 'INVENTORY_LOW',
      mode: 'AUTO',
      status: 'ACTIVE',
      lastRun: '10 mins ago',
      successRate: '100%',
      icon: Box,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      id: 'wf_2',
      name: 'High Value Refund Approval',
      trigger: 'REFUND_REQUIRED',
      mode: 'APPROVAL',
      status: 'ACTIVE',
      lastRun: '2 hours ago',
      successRate: '98.5%',
      icon: ShieldAlert,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100'
    },
    {
      id: 'wf_3',
      name: 'Abandoned Cart Recovery',
      trigger: 'CART_ABANDONED',
      mode: 'AUTO',
      status: 'ACTIVE',
      lastRun: 'Just now',
      successRate: '92.4%',
      icon: ShoppingCart,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-100'
    },
    {
      id: 'wf_4',
      name: 'VIP Customer Tagging',
      trigger: 'ORDER_COMPLETED',
      mode: 'AUTO',
      status: 'PAUSED',
      lastRun: '2 days ago',
      successRate: '100%',
      icon: Zap,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Automation Engine</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage deterministic workflows, triggers, actions, and safety boundaries.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className={`bg-white font-bold ${killSwitchActive ? 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700' : 'text-slate-700 hover:text-red-600 hover:border-red-200'}`}
              onClick={() => setKillSwitchActive(!killSwitchActive)}
            >
              <AlertTriangle className={`w-4 h-4 mr-2 ${killSwitchActive ? 'text-red-600' : 'text-slate-400'}`} />
              {killSwitchActive ? 'KILL SWITCH ACTIVE' : 'Kill Switch'}
            </Button>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" /> Create Workflow
            </Button>
          </div>
        </div>

        {/* Kill Switch Banner */}
        {killSwitchActive && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-800 text-sm">All automations are currently disabled</h3>
                <p className="text-red-700 text-sm mt-1 font-medium">The global kill switch is active. No automated actions, webhooks, or emails will be processed until this is disabled.</p>
              </div>
              <Button size="sm" variant="outline" className="ml-auto bg-white text-red-700 border-red-200 hover:bg-red-100" onClick={() => setKillSwitchActive(false)}>
                Disable Kill Switch
              </Button>
            </div>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">Active Workflows</p>
                <div className="text-2xl font-extrabold text-slate-900">12</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">Executions (24h)</p>
                <div className="text-2xl font-extrabold text-slate-900">1,420</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 99.8% Success
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group cursor-pointer border-amber-200">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-700 mb-1">Pending Approvals</p>
                <div className="text-2xl font-extrabold text-amber-600">2</div>
                <div className="text-[11px] font-bold text-amber-600 mt-1 hover:underline">
                  Review needed &rarr;
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group border-rose-200">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-rose-700 mb-1">Open Exceptions</p>
                <div className="text-2xl font-extrabold text-rose-600">1</div>
                <div className="text-[11px] font-bold text-rose-600 mt-1 hover:underline">
                  Action required &rarr;
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflows Table */}
        <Card className="!p-0 overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">System Workflows</h3>
            <Button variant="outline" size="sm" className="bg-white">
              <Settings2 className="w-4 h-4 mr-2 text-slate-500" /> Manage
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th className="pl-6">Workflow</Th>
                  <Th>Trigger Event</Th>
                  <Th>Mode</Th>
                  <Th>Performance</Th>
                  <Th>Status</Th>
                  <Th className="text-right pr-6"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {workflows.map((wf) => (
                  <Tr key={wf.id}>
                    <Td className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${wf.bg} ${wf.color} ${wf.border}`}>
                          <wf.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{wf.name}</div>
                          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">ID: {wf.id}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <code className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono font-semibold text-slate-700">
                        {wf.trigger}
                      </code>
                    </Td>
                    <Td>
                      <Badge variant={wf.mode === 'AUTO' ? 'info' : 'warning'} className="text-[10px]">
                        {wf.mode}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{wf.successRate}</span>
                        <span className="text-[11px] font-medium text-slate-500">Last run: {wf.lastRun}</span>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${wf.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                        <span className={`text-xs font-bold ${wf.status === 'ACTIVE' ? 'text-emerald-700' : 'text-slate-500'}`}>{wf.status}</span>
                      </div>
                    </Td>
                    <Td className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {wf.status === 'ACTIVE' ? (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50" title="Pause">
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" title="Resume">
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Link href={`/automation/${wf.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-brand-600 hover:bg-brand-50" title="Edit Workflow">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
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
