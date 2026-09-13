'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  ShieldCheck,
  Building2,
  Activity,
  Server,
  Zap,
  Flag,
  Database,
  ArrowRight,
  LogOut,
  Users,
  CreditCard,
  Settings,
  MoreHorizontal,
  CheckCircle2
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'tenants' | 'health'>('tenants');

  const mockTenants = [
    { id: 'tn_acme', name: 'Acme Store', plan: 'Professional', status: 'ACTIVE', users: 12, ordersThisMonth: 1420 },
    { id: 'tn_globex', name: 'Globex Corp', plan: 'Enterprise', status: 'ACTIVE', users: 45, ordersThisMonth: 8900 },
    { id: 'tn_stark', name: 'Stark Retail', plan: 'Starter', status: 'SUSPENDED', users: 3, ordersThisMonth: 120 },
    { id: 'tn_wayne', name: 'Wayne Tech', plan: 'Growth', status: 'ACTIVE', users: 8, ordersThisMonth: 430 },
  ];

  const mockHealth = {
    status: 'HEALTHY',
    database: { status: 'HEALTHY', latencyMs: 3, load: '24%' },
    redis: { status: 'HEALTHY', statusText: 'ready', hitRate: '98.2%' },
    api: { status: 'HEALTHY', uptime: '14d 6h', reqPerSec: 1240 }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold tracking-tight text-lg">Sellzy Admin</span>
            </div>
            <div className="h-6 w-px bg-slate-700 mx-2"></div>
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('tenants')}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                  activeTab === 'tenants' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Tenants
              </button>
              <button
                onClick={() => setActiveTab('health')}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                  activeTab === 'health' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                System Health
              </button>
              <button className="px-3 py-1.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                Queues
              </button>
              <button className="px-3 py-1.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
                Feature Flags
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400">All Systems Operational</span>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 md:p-8 animate-fade-in space-y-6">
        
        {activeTab === 'tenants' && (
          <>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tenants & Subscriptions</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Manage all organizations running on the Sellzy Commerce Engine.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white">Export</Button>
                <Button variant="primary">Provision Tenant</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-0.5">Total Tenants</p>
                    <div className="text-2xl font-extrabold text-slate-900">4,284</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-0.5">Active Stores</p>
                    <div className="text-2xl font-extrabold text-slate-900">5,102</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-0.5">MRR</p>
                    <div className="text-2xl font-extrabold text-slate-900">$2.4M</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-0.5">Platform GMV</p>
                    <div className="text-2xl font-extrabold text-slate-900">$48.5M</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="!p-0 overflow-hidden">
              <Table>
                <Thead>
                  <Tr>
                    <Th className="pl-6">Tenant Name</Th>
                    <Th>Tenant ID</Th>
                    <Th>Plan</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Users</Th>
                    <Th className="text-right">Monthly Orders</Th>
                    <Th className="text-right pr-6"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mockTenants.map((t) => (
                    <Tr key={t.id}>
                      <Td className="pl-6 font-bold text-slate-900">{t.name}</Td>
                      <Td>
                        <code className="px-2 py-1 bg-slate-100 rounded text-xs font-mono font-semibold text-slate-600">
                          {t.id}
                        </code>
                      </Td>
                      <Td>
                        <Badge variant={t.plan === 'Enterprise' ? 'warning' : 'info'} className="text-[10px]">
                          {t.plan}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge variant={t.status === 'ACTIVE' ? 'success' : 'danger'} className="text-[10px]">
                          {t.status}
                        </Badge>
                      </Td>
                      <Td className="text-right font-semibold text-slate-600">{t.users}</Td>
                      <Td className="text-right font-semibold text-slate-600">{t.ordersThisMonth.toLocaleString()}</Td>
                      <Td className="text-right pr-6">
                        <Button variant="outline" size="sm" className="bg-white">Manage</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Card>
          </>
        )}

        {activeTab === 'health' && (
          <>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Health & Infrastructure</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Real-time metrics for Sellzy core services.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" /> Healthy
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">MongoDB Cluster</h3>
                      <p className="text-xs font-medium text-slate-500">Primary database</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-sm text-slate-500 font-medium">Status</span>
                      <Badge variant="success">Operational</Badge>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-sm text-slate-500 font-medium">Latency</span>
                      <span className="text-sm font-bold text-slate-900">{mockHealth.database.latencyMs}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500 font-medium">CPU Load</span>
                      <span className="text-sm font-bold text-slate-900">{mockHealth.database.load}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                      <Server className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Redis Cache Engine</h3>
                      <p className="text-xs font-medium text-slate-500">In-memory datastore</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-sm text-slate-500 font-medium">Status</span>
                      <Badge variant="success">Operational</Badge>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-sm text-slate-500 font-medium">Connection</span>
                      <span className="text-sm font-bold text-slate-900">{mockHealth.redis.statusText}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500 font-medium">Cache Hit Rate</span>
                      <span className="text-sm font-bold text-emerald-600">{mockHealth.redis.hitRate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">API Gateway</h3>
                      <p className="text-xs font-medium text-slate-500">Edge routing</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-sm text-slate-500 font-medium">Status</span>
                      <Badge variant="success">Operational</Badge>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-sm text-slate-500 font-medium">Uptime</span>
                      <span className="text-sm font-bold text-slate-900">{mockHealth.api.uptime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500 font-medium">Traffic</span>
                      <span className="text-sm font-bold text-slate-900">{mockHealth.api.reqPerSec} req/s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
