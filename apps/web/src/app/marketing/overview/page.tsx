'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MarketingHeaderNav } from '@/components/marketing/MarketingHeaderNav';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FolderKanban, 
  FileSpreadsheet, 
  Search, 
  Globe2, 
  RefreshCw, 
  ArrowRight,
  ShieldAlert,
  ArrowUpRight,
  Layers,
  History
} from 'lucide-react';
import { useApiQuery } from '@/lib/api-client';

export default function LeadGenerationOverviewPage() {
  const { data: overviewData, isLoading, error, mutate: refetchOverview } = useApiQuery<any>('/api/v1/leads/overview');
  const overview = overviewData?.data || null;

  const metrics = overview?.metrics || {
    totalCollected: 0,
    verifiedDeliverable: 0,
    pendingVerification: 0,
    invalidOrRisky: 0,
    suppressedCount: 0,
    savedLists: 0
  };

  const sourceBreakdown = overview?.sourceBreakdown || [];
  const recentImports = overview?.recentImports || [];
  const recentActivity = overview?.recentActivity || [];

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Navigation Tab Bar */}
        <MarketingHeaderNav />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lead Generation Overview</h1>
              <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200 text-xs">
                Real-Time Telemetry
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Real-time audit intelligence, verification posture, source breakdowns, and CRM pipeline health.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={() => refetchOverview()}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh Metrics
            </Button>
            <Link href="/marketing/leads/finder">
              <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm">
                <Search className="w-4 h-4 mr-2" /> Find US Leads
              </Button>
            </Link>
          </div>
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <p className="text-sm font-semibold text-rose-800">
                Failed to load lead analytics: {error?.message || 'Connection timeout.'}
              </p>
            </div>
            <Button size="sm" variant="outline" className="bg-white text-rose-700 border-rose-200" onClick={() => refetchOverview()}>
              Retry
            </Button>
          </div>
        )}

        {/* 6 Key Telemetry Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Collected */}
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Leads</span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-2xl font-black text-slate-900">
                {isLoading ? '...' : metrics.totalCollected.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Tenant repository</p>
            </CardContent>
          </Card>

          {/* Verified Deliverable */}
          <Card className="border border-emerald-200 shadow-sm bg-emerald-50/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-emerald-700 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Deliverable</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-800">
                {isLoading ? '...' : metrics.verifiedDeliverable.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Ready for outreach</p>
            </CardContent>
          </Card>

          {/* Pending Verification */}
          <Card className="border border-amber-200 shadow-sm bg-amber-50/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-amber-700 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Pending Audit</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-amber-800">
                {isLoading ? '...' : metrics.pendingVerification.toLocaleString()}
              </p>
              <p className="text-[11px] text-amber-600 font-medium mt-1">Unverified contacts</p>
            </CardContent>
          </Card>

          {/* Invalid or Risky */}
          <Card className="border border-orange-200 shadow-sm bg-orange-50/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-orange-700 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Invalid / Risky</span>
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-2xl font-black text-orange-800">
                {isLoading ? '...' : metrics.invalidOrRisky.toLocaleString()}
              </p>
              <p className="text-[11px] text-orange-600 font-medium mt-1">No MX / Bad syntax</p>
            </CardContent>
          </Card>

          {/* Suppressed */}
          <Card className="border border-rose-200 shadow-sm bg-rose-50/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-rose-700 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Suppressed</span>
                <ShieldAlert className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl font-black text-rose-800">
                {isLoading ? '...' : metrics.suppressedCount.toLocaleString()}
              </p>
              <p className="text-[11px] text-rose-600 font-medium mt-1">Do-not-contact</p>
            </CardContent>
          </Card>

          {/* Saved Lists */}
          <Card className="border border-indigo-200 shadow-sm bg-indigo-50/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-indigo-700 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Saved Lists</span>
                <FolderKanban className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-black text-indigo-800">
                {isLoading ? '...' : metrics.savedLists.toLocaleString()}
              </p>
              <p className="text-[11px] text-indigo-600 font-medium mt-1">Segmented lists</p>
            </CardContent>
          </Card>
        </div>

        {/* Mid-Row: Quick Action Hub & Source Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions Panel */}
          <Card className="lg:col-span-1 shadow-sm border border-slate-200">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" />
                Quick Actions
              </h2>

              <div className="space-y-2">
                <Link href="/marketing/leads/finder" className="block">
                  <div className="p-3 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-slate-50 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Search className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Discover USA Business Leads</p>
                        <p className="text-[11px] text-slate-500">Query state registries &amp; chambers</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>

                <Link href="/marketing/leads/grabber" className="block">
                  <div className="p-3 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-slate-50 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <Globe2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Domain Email Grabber</p>
                        <p className="text-[11px] text-slate-500">Extract authorized public emails from URLs</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>

                <Link href="/marketing/leads/verification" className="block">
                  <div className="p-3 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-slate-50 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Email Verification Studio</p>
                        <p className="text-[11px] text-slate-500">Run syntax, MX, &amp; deliverability checks</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>

                <Link href="/marketing/match" className="block">
                  <div className="p-3 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-slate-50 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Excel / CSV Match Engine</p>
                        <p className="text-[11px] text-slate-500">8-way cross-comparison &amp; deduplication</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Lead Source Breakdown */}
          <Card className="lg:col-span-2 shadow-sm border border-slate-200">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-600" />
                  Lead Source Distribution
                </h2>
                <span className="text-xs font-semibold text-slate-500">
                  {sourceBreakdown.reduce((acc: number, s: any) => acc + s.count, 0)} total leads
                </span>
              </div>

              {sourceBreakdown.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-medium">
                  No source data recorded yet. Collect leads or grab emails to build your attribution graph.
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {sourceBreakdown.map((s: any) => {
                    const total = sourceBreakdown.reduce((acc: number, cur: any) => acc + cur.count, 0) || 1;
                    const percent = Math.round((s.count / total) * 100);
                    return (
                      <div key={s.source} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span className="font-mono">{s.source}</span>
                          <span>{s.count} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className="bg-brand-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: Recent Imports & Audit Trail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Imports */}
          <Card className="shadow-sm border border-slate-200">
            <CardContent className="p-0">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-brand-600" />
                  Recent Spreadsheet Imports
                </h2>
                <Link href="/marketing/match" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <Thead>
                    <Tr className="bg-slate-50/75 border-b border-slate-200">
                      <Th className="pl-6 font-bold text-slate-600 text-xs">Filename</Th>
                      <Th className="font-bold text-slate-600 text-xs">Total Rows</Th>
                      <Th className="font-bold text-slate-600 text-xs">Exact Matches</Th>
                      <Th className="pr-6 font-bold text-slate-600 text-xs">Date</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {recentImports.length === 0 ? (
                      <Tr>
                        <Td colSpan={4} className="text-center py-8 text-slate-400 text-xs font-medium">
                          No spreadsheet import jobs recorded yet.
                        </Td>
                      </Tr>
                    ) : (
                      recentImports.map((job: any) => (
                        <Tr key={job._id} className="hover:bg-slate-50/50">
                          <Td className="pl-6 font-semibold text-slate-900 text-xs font-mono">{job.fileName}</Td>
                          <Td className="text-xs text-slate-700 font-medium">{job.totalRows}</Td>
                          <Td className="text-xs text-emerald-700 font-bold">{job.exactMatchRows || 0}</Td>
                          <Td className="pr-6 text-xs text-slate-500 font-medium">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Audit Activity Trail */}
          <Card className="shadow-sm border border-slate-200">
            <CardContent className="p-0">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-brand-600" />
                  Lead Security &amp; Activity Trail
                </h2>
                <Badge variant="outline" className="text-[10px] bg-slate-100 font-bold">
                  Immutable Audit Log
                </Badge>
              </div>

              <div className="divide-y divide-slate-100">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs font-medium">
                    No lead system activity logged yet.
                  </div>
                ) : (
                  recentActivity.map((log: any) => (
                    <div key={log._id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/50">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 font-mono text-[11px]">{log.action}</span>
                          <Badge variant="outline" className="text-[10px] bg-slate-100 font-medium">
                            {log.resourceType}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Actor: <span className="font-semibold text-slate-700">{log.actorUserId}</span>
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

