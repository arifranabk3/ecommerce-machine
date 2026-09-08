'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

export default function AutomationDashboardPage() {
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Automation Engine Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Manage deterministic workflows, triggers, actions, and safety kill switches.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={killSwitchActive ? 'danger' : 'secondary'}
              onClick={() => setKillSwitchActive(!killSwitchActive)}
            >
              {killSwitchActive ? '⚠️ KILL SWITCH ACTIVE' : 'Disable All Automation (Kill Switch)'}
            </Button>
            <Link href="/automation/new">
              <Button variant="primary">+ Create Workflow</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-slate-50 border border-slate-200">
            <div className="text-slate-500 text-sm">Active Workflows</div>
            <div className="text-2xl font-bold mt-1 text-slate-900">12</div>
          </Card>
          <Card className="p-4 bg-slate-50 border border-slate-200">
            <div className="text-slate-500 text-sm">Total Executions (24h)</div>
            <div className="text-2xl font-bold mt-1 text-slate-900">1,420</div>
          </Card>
          <Card className="p-4 bg-slate-50 border border-slate-200">
            <div className="text-slate-500 text-sm">Pending Approvals</div>
            <div className="text-2xl font-bold mt-1 text-amber-600">2</div>
          </Card>
          <Card className="p-4 bg-slate-50 border border-slate-200">
            <div className="text-slate-500 text-sm">Open Exceptions</div>
            <div className="text-2xl font-bold mt-1 text-rose-600">1</div>
          </Card>
        </div>

        <Card className="!p-0 overflow-hidden">
          <div className="p-6 pb-4">
            <h2 className="text-lg font-bold text-slate-900">System Workflows</h2>
          </div>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Trigger</Th>
                <Th>Mode</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td className="font-semibold text-slate-900">Low Stock Procurement Trigger</Td>
                <Td><code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono text-slate-700">INVENTORY_LOW</code></Td>
                <Td><Badge variant="info">AUTO</Badge></Td>
                <Td><span className="text-emerald-600 font-semibold">ACTIVE</span></Td>
                <Td>
                  <Link href="/automation/wf_1" className="text-brand-500 hover:underline mr-3">Edit</Link>
                  <Link href="/automation/wf_1/runs" className="text-slate-500 hover:underline">Runs</Link>
                </Td>
              </Tr>
              <Tr>
                <Td className="font-semibold text-slate-900">High Value Refund Approval</Td>
                <Td><code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono text-slate-700">REFUND_REQUIRED</code></Td>
                <Td><Badge variant="warning">APPROVAL</Badge></Td>
                <Td><span className="text-emerald-600 font-semibold">ACTIVE</span></Td>
                <Td>
                  <Link href="/automation/wf_2" className="text-brand-500 hover:underline mr-3">Edit</Link>
                  <Link href="/automation/wf_2/runs" className="text-slate-500 hover:underline">Runs</Link>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
