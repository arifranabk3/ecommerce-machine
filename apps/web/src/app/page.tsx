import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Activity, Users, Database } from 'lucide-react';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-900 tracking-tight">Phase 01 — Platform Control Center</h1>
            <p className="text-sm text-slate-500 mt-1">Multi-Tenant Architecture & Infrastructure Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success">API Online</Badge>
            <Button size="sm" variant="primary">System Status</Button>
          </div>
        </div>

        {/* Infrastructure Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Tenant Isolation</p>
              <h4 className="text-lg font-bold text-brand-900">Enforced</h4>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="p-3 bg-brand-50 text-brand-700 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">MongoDB Database</p>
              <h4 className="text-lg font-bold text-brand-900">Connected</h4>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">RBAC Engine</p>
              <h4 className="text-lg font-bold text-brand-900">Active</h4>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Background Worker</p>
              <h4 className="text-lg font-bold text-brand-900">BullMQ Ready</h4>
            </div>
          </Card>
        </div>

        {/* System Architecture Details */}
        <Card title="Phase 01 Architectural Foundation" subtitle="Monorepo microservices ready modular monolith architecture">
          <div className="space-y-4 text-sm text-slate-600">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-brand-900 mb-2">Locked Technology Stack Verified</h4>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Frontend: Next.js 14 App Router + Tailwind CSS (#A9C2B9 Primary Brand Accent)</li>
                <li>Backend REST API: Express.js + TypeScript (`/api/v1` routes)</li>
                <li>Database: MongoDB (Connection pool, Retry logic, Indexed models)</li>
                <li>Queue System: Redis + BullMQ Background Job Worker</li>
                <li>Real-time Engine: Socket.io Integration</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
