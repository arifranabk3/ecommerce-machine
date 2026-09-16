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
  MoreHorizontal,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useApiQuery } from '@/lib/api-client';

export default function AutomationDashboardPage() {
  const [killSwitchActive, setKillSwitchActive] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const { data: workflowsData, mutate: refetchWorkflows, isLoading } = useApiQuery<any>('/api/v1/automation');
  const workflows = workflowsData?.data || [];
  
  const activeWorkflowsCount = workflows.filter((w: any) => w.status === 'ACTIVE').length;

  const handleToggleKillSwitch = async () => {
    const token = localStorage.getItem('sellzy_token');
    const storeId = localStorage.getItem('sellzy_store_id');
    try {
      const newState = !killSwitchActive;
      setKillSwitchActive(newState);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/automation/kill-switch`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'x-store-id': storeId || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: newState })
      });
    } catch (e) {
      // Revert on error
      setKillSwitchActive(!killSwitchActive);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdatingStatus(id);
    const token = localStorage.getItem('sellzy_token');
    const storeId = localStorage.getItem('sellzy_store_id');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/automation/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'x-store-id': storeId || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      refetchWorkflows();
    } catch (e) {} finally { setIsUpdatingStatus(null); }
  };

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
              onClick={handleToggleKillSwitch}
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
              <Button size="sm" variant="outline" className="ml-auto bg-white text-red-700 border-red-200 hover:bg-red-100" onClick={handleToggleKillSwitch}>
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
                <div className="text-2xl font-extrabold text-slate-900">{activeWorkflowsCount}</div>
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
                  <Th className="pl-6">Workflow Name</Th>
                  <Th>Trigger Event</Th>
                  <Th>Mode</Th>
                  <Th>Status</Th>
                  <Th className="text-right pr-6">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={5} className="text-center py-10 text-slate-500 font-medium">Loading workflows...</Td>
                  </Tr>
                ) : workflows.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} className="text-center py-10 text-slate-500 font-medium">No workflows found.</Td>
                  </Tr>
                ) : (
                  workflows.map((wf: any) => (
                    <Tr key={wf._id}>
                      <Td className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border bg-brand-50 text-brand-600 border-brand-100`}>
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{wf.name}</div>
                            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Created: {new Date(wf.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <code className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono font-semibold text-slate-700">
                          {wf.triggerType || 'MANUAL'}
                        </code>
                      </Td>
                      <Td>
                        <Badge variant={wf.mode === 'AUTO' ? 'info' : 'warning'} className="text-[10px]">
                          {wf.mode || 'AUTO'}
                        </Badge>
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
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50" 
                              title="Pause"
                              disabled={isUpdatingStatus === wf._id}
                              onClick={() => handleUpdateStatus(wf._id, 'PAUSED')}
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" 
                              title="Resume"
                              disabled={isUpdatingStatus === wf._id}
                              onClick={() => handleUpdateStatus(wf._id, 'ACTIVE')}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                          <Link href={`/automation/${wf._id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-brand-600 hover:bg-brand-50" title="Edit Workflow">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
