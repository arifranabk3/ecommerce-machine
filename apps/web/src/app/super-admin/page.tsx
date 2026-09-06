'use client';

import React, { useState } from 'react';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'tenants' | 'plans' | 'health' | 'queues' | 'flags'>('tenants');

  const mockTenants = [
    { id: 'tn_acme', name: 'Acme Store', plan: 'PRO', status: 'ACTIVE', users: 12, ordersThisMonth: 1420 },
    { id: 'tn_globex', name: 'Globex Corp', plan: 'ENTERPRISE', status: 'ACTIVE', users: 45, ordersThisMonth: 8900 },
    { id: 'tn_stark', name: 'Stark Retail', plan: 'STARTER', status: 'SUSPENDED', users: 3, ordersThisMonth: 120 }
  ];

  const mockHealth = {
    status: 'HEALTHY',
    database: { status: 'HEALTHY', latencyMs: 3 },
    redis: { status: 'HEALTHY', statusText: 'ready' },
    api: { status: 'HEALTHY', uptime: '14 days 6 hours' }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-8 font-sans">
      <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Sellzy Super Admin</h1>
            <span className="px-3 py-1 bg-[#A9C2B9]/20 text-[#4A6B5D] font-semibold text-xs rounded-full uppercase tracking-wider">
              Platform Controls
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Multi-tenant SaaS Administration & System Hardening</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Status: <strong>HEALTHY</strong>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-3">
        {[
          { id: 'tenants', label: 'Tenants Management' },
          { id: 'plans', label: 'SaaS Plans & Entitlements' },
          { id: 'health', label: 'System Health' },
          { id: 'queues', label: 'Queue Monitoring' },
          { id: 'flags', label: 'Feature Flags' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-[#A9C2B9] text-white shadow-sm'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'tenants' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">Registered SaaS Tenants</h2>
          <table className="w-full text-left text-sm text-slate-600 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase text-slate-400">
                <th className="pb-3">Tenant ID</th>
                <th className="pb-3">Tenant Name</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Users</th>
                <th className="pb-3">Monthly Orders</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockTenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 font-mono text-xs font-semibold text-slate-700">{t.id}</td>
                  <td className="py-3.5 font-medium text-slate-900">{t.name}</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold text-xs">
                      {t.plan}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-semibold text-xs ${
                        t.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5">{t.users}</td>
                  <td className="py-3.5">{t.ordersThisMonth}</td>
                  <td className="py-3.5 text-right">
                    <button className="text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1 rounded-lg bg-white hover:bg-slate-50 shadow-2xs">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xs font-semibold uppercase text-slate-400 mb-2">MongoDB Cluster</h3>
            <p className="text-2xl font-bold text-emerald-600">{mockHealth.database.status}</p>
            <p className="text-xs text-slate-500 mt-2">Latency: {mockHealth.database.latencyMs}ms</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xs font-semibold uppercase text-slate-400 mb-2">Redis Cache Engine</h3>
            <p className="text-2xl font-bold text-emerald-600">{mockHealth.redis.status}</p>
            <p className="text-xs text-slate-500 mt-2">Status: {mockHealth.redis.statusText}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xs font-semibold uppercase text-slate-400 mb-2">API Gateway</h3>
            <p className="text-2xl font-bold text-emerald-600">{mockHealth.api.status}</p>
            <p className="text-xs text-slate-500 mt-2">Uptime: {mockHealth.api.uptime}</p>
          </div>
        </div>
      )}
    </div>
  );
}
