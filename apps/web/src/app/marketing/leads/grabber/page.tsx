'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MarketingHeaderNav } from '@/components/marketing/MarketingHeaderNav';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  Globe2, 
  UploadCloud, 
  RefreshCw, 
  Layers, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  History,
  ShieldAlert,
  FolderPlus,
  Play
} from 'lucide-react';
import { useApiQuery } from '@/lib/api-client';

export default function DomainEmailGrabberPage() {
  const [domainInput, setDomainInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [grabberFeedback, setGrabberFeedback] = useState<string | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [targetListId, setTargetListId] = useState('');

  // Fetch Grabbed Leads
  const { data: leadsData, isLoading, mutate: refetchGrabbed } = useApiQuery<any>(
    '/api/v1/leads?limit=50'
  );
  const leads = leadsData?.data?.leads || [];
  const grabbedLeads = leads.filter((l: any) => l.source === 'DOMAIN_GRABBER');

  // Lists for Target Dropdown
  const { data: listsData } = useApiQuery<any>('/api/v1/leads/lists');
  const lists = listsData?.data || [];

  const handleRunGrabber = async () => {
    if (!domainInput.trim()) return;

    setIsProcessing(true);
    setGrabberFeedback(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';

    const domainList = domainInput
      .split('\n')
      .map(d => d.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/grab`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domains: domainList,
          targetListId: targetListId || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setGrabberFeedback(
          `Processed ${data.data.totalDomainsProcessed} domains. Collected ${data.data.collectedCount} official contact emails (${data.data.duplicateCount} duplicates excluded). Initial status: UNVERIFIED.`
        );
        setDomainInput('');
        refetchGrabbed();
      } else {
        setGrabberFeedback(data.error || 'Failed to grab emails from specified domains.');
      }
    } catch (e: any) {
      setGrabberFeedback(e.message || 'Error occurred during domain grabbing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(grabbedLeads.map((l: any) => l._id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLeadIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExportSelected = () => {
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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Domain Email Grabber</h1>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                Stage 1 Discovery
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Extract official published contact emails directly from company websites and domain registries. Never marked deliverable until verified.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" onClick={handleExportSelected}>
              <Download className="w-4 h-4 mr-2" /> Export to CSV
            </Button>
          </div>
        </div>

        {/* Grabber Input Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Domain Input Form */}
          <Card className="lg:col-span-1 shadow-sm border border-slate-200">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-brand-600" />
                Target Company Domains
              </h2>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Enter Domains (one per line)</label>
                <textarea
                  rows={6}
                  value={domainInput}
                  onChange={e => setDomainInput(e.target.value)}
                  placeholder="stripe.com&#10;github.com&#10;shopify.com"
                  className="w-full mt-1 border border-slate-200 rounded-xl p-3 text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Supports domain names, root URLs, and subdomains.</p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Save to List (Optional)</label>
                <select
                  value={targetListId}
                  onChange={e => setTargetListId(e.target.value)}
                  className="w-full mt-1 h-9 text-xs border border-slate-200 rounded-lg px-2 bg-white font-medium"
                >
                  <option value="">Unassigned</option>
                  {lists.map((l: any) => (
                    <option key={l._id} value={l._id}>{l.name} ({l.leadCount || 0})</option>
                  ))}
                </select>
              </div>

              <Button
                variant="primary"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 shadow-sm"
                onClick={handleRunGrabber}
                disabled={!domainInput.trim() || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Querying Domain Registries...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="w-4 h-4 fill-white" />
                    Execute Email Grabber
                  </span>
                )}
              </Button>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] font-medium text-amber-800">
                <strong>Safety Rule:</strong> Grabbed emails are always marked <code>UNVERIFIED</code> on discovery. They must be validated through the Email Verification tab before outreach.
              </div>
            </CardContent>
          </Card>

          {/* Grabbed Leads Table */}
          <div className="lg:col-span-2 space-y-4">
            {grabberFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{grabberFeedback}</span>
                </div>
                <button onClick={() => setGrabberFeedback(null)} className="text-emerald-600 hover:underline">Dismiss</button>
              </div>
            )}

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-0">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Discovered Domain Records
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                      {grabbedLeads.length} leads
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => refetchGrabbed()} className="h-8 text-xs">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <Thead>
                      <Tr className="bg-slate-50/75 border-b border-slate-200">
                        <Th className="pl-4 w-10">
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedLeadIds.length > 0 && selectedLeadIds.length === grabbedLeads.length}
                            className="rounded border-slate-300"
                          />
                        </Th>
                        <Th className="font-bold text-slate-700 text-xs">Domain &amp; Company</Th>
                        <Th className="font-bold text-slate-700 text-xs">Extracted Email</Th>
                        <Th className="font-bold text-slate-700 text-xs">Verification Posture</Th>
                        <Th className="pr-6 font-bold text-slate-700 text-xs">Source URL</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {isLoading ? (
                        <Tr>
                          <Td colSpan={5} className="text-center py-10 text-slate-400 text-xs font-medium">
                            Loading domain contacts...
                          </Td>
                        </Tr>
                      ) : grabbedLeads.length === 0 ? (
                        <Tr>
                          <Td colSpan={5} className="text-center py-10 text-slate-400 text-xs font-medium">
                            No domain leads collected yet. Paste company domains on the left to extract official contact emails.
                          </Td>
                        </Tr>
                      ) : (
                        grabbedLeads.map((lead: any) => (
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
                              <p className="font-bold text-slate-900 text-xs">{lead.companyName}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{lead.website}</p>
                            </Td>
                            <Td>
                              <span className="text-xs font-mono font-medium text-slate-800">{lead.email}</span>
                            </Td>
                            <Td>
                              <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 font-bold">
                                {lead.verificationStatus}
                              </Badge>
                            </Td>
                            <Td className="pr-6">
                              <span className="text-[11px] text-slate-500 font-mono truncate block max-w-[200px]">
                                {lead.sourceUrl}
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
        </div>
      </div>
    </DashboardLayout>
  );
}

