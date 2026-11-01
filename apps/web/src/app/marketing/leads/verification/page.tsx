'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MarketingHeaderNav } from '@/components/marketing/MarketingHeaderNav';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Download, 
  Layers, 
  Play,
  MailCheck,
  Server
} from 'lucide-react';
import { useApiQuery } from '@/lib/api-client';

export default function EmailVerificationStudioPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyFeedback, setVerifyFeedback] = useState<string | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Query leads
  const filterParam = statusFilter !== 'ALL' ? `&verificationStatus=${statusFilter.toLowerCase()}` : '';
  const { data: leadsData, isLoading, mutate: refetchLeads } = useApiQuery<any>(
    `/api/v1/leads?limit=50${filterParam}`
  );
  const leads = leadsData?.data?.leads || [];
  const totalCount = leadsData?.data?.total || 0;

  const handleRunBatchVerification = async (targetScope: 'SELECTED' | 'ALL_PENDING') => {
    setIsVerifying(true);
    setVerifyFeedback(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';

    try {
      const payload: any = {};
      if (targetScope === 'SELECTED') {
        payload.leadIds = selectedLeadIds;
      } else {
        payload.targetStatus = 'unverified';
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/verify-batch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setVerifyFeedback(`Batch audit finished: Verified ${data.data.totalProcessed} contact records.`);
        setSelectedLeadIds([]);
        refetchLeads();
      } else {
        setVerifyFeedback(data.error || 'Failed to complete batch verification.');
      }
    } catch (e: any) {
      setVerifyFeedback(e.message || 'Error occurred while running verification.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(leads.map((l: any) => l._id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLeadIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExportResults = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/export-csv?token=${token}`, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Navigation Tab Bar */}
        <MarketingHeaderNav />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Email Verification Studio</h1>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                Multi-Layer Audit
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Run RFC syntax validation, disposable address detection, and DNS MX checks to protect sender reputation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" onClick={handleExportResults}>
              <Download className="w-4 h-4 mr-2" /> Export Audit CSV
            </Button>
            <Button
              variant="primary"
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
              onClick={() => handleRunBatchVerification('ALL_PENDING')}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Records...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <MailCheck className="w-4 h-4" /> Verify All Unverified Leads
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Disclaimer / Non-Negotiable Callout */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>
              <strong>Non-Negotiable Rule:</strong> RFC Syntax and DNS MX validation prove address formatting and mailserver availability, but are not treated as 100% proof of final inbox deliverability.
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            {['ALL', 'UNVERIFIED', 'DELIVERABLE', 'UNDELIVERABLE', 'RISKY_OR_UNKNOWN', 'SUPPRESSED'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === status
                    ? 'bg-brand-50 text-brand-600 shadow-sm border border-brand-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">{totalCount} leads matched</span>
            <Button variant="outline" size="sm" onClick={() => refetchLeads()} className="h-8 text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Action / Feedback Banner */}
        {verifyFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{verifyFeedback}</span>
            </div>
            <button onClick={() => setVerifyFeedback(null)} className="text-emerald-600 hover:underline">Dismiss</button>
          </div>
        )}

        {/* Selected Records Action */}
        {selectedLeadIds.length > 0 && (
          <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between shadow-lg animate-fade-in">
            <span className="text-xs font-bold pl-2">{selectedLeadIds.length} records selected</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                className="bg-brand-600 text-white text-xs"
                onClick={() => handleRunBatchVerification('SELECTED')}
                disabled={isVerifying}
              >
                <Play className="w-3.5 h-3.5 mr-1" /> Verify Selected
              </Button>
            </div>
          </div>
        )}

        {/* Verification Results Table */}
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <Thead>
                  <Tr className="bg-slate-50/75 border-b border-slate-200">
                    <Th className="pl-4 w-10">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedLeadIds.length > 0 && selectedLeadIds.length === leads.length}
                        className="rounded border-slate-300"
                      />
                    </Th>
                    <Th className="font-bold text-slate-700 text-xs">Email Address</Th>
                    <Th className="font-bold text-slate-700 text-xs">Company</Th>
                    <Th className="font-bold text-slate-700 text-xs">Status</Th>
                    <Th className="font-bold text-slate-700 text-xs">DNS MX</Th>
                    <Th className="font-bold text-slate-700 text-xs">Disposable Check</Th>
                    <Th className="pr-6 font-bold text-slate-700 text-xs">Audit Details</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {isLoading ? (
                    <Tr>
                      <Td colSpan={7} className="text-center py-12 text-slate-400 font-medium text-xs">
                        Loading verification data...
                      </Td>
                    </Tr>
                  ) : leads.length === 0 ? (
                    <Tr>
                      <Td colSpan={7} className="text-center py-12 text-slate-400 font-medium text-xs">
                        No leads found in category &quot;{statusFilter}&quot;.
                      </Td>
                    </Tr>
                  ) : (
                    leads.map((lead: any) => (
                      <Tr key={lead._id} className="hover:bg-slate-50/50">
                        <Td className="pl-4">
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.includes(lead._id)}
                            onChange={() => handleToggleSelect(lead._id)}
                            className="rounded border-slate-300"
                          />
                        </Td>
                        <Td>
                          <span className="font-mono text-xs font-semibold text-slate-900">{lead.email}</span>
                        </Td>
                        <Td className="text-xs text-slate-700 font-medium">{lead.companyName || '—'}</Td>
                        <Td>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold ${
                              lead.verificationStatus === 'deliverable'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : lead.verificationStatus === 'undeliverable'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : lead.verificationStatus === 'suppressed'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {lead.verificationStatus}
                          </Badge>
                        </Td>
                        <Td className="text-xs">
                          {lead.verificationDetails?.mxFound ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">None</span>
                          )}
                        </Td>
                        <Td className="text-xs">
                          {lead.verificationDetails?.isDisposable ? (
                            <span className="text-rose-600 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Disposable
                            </span>
                          ) : (
                            <span className="text-slate-500 font-medium">Valid Domain</span>
                          )}
                        </Td>
                        <Td className="pr-6">
                          <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[220px]">
                            {lead.verificationDetails?.rawResponse || 'No audit response yet'}
                          </span>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

