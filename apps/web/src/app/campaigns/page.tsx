'use client';

import { MarketingHeaderNav } from '@/components/marketing/MarketingHeaderNav';
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  Megaphone,
  Plus,
  BarChart2,
  Mail,
  MessageCircle,
  Play,
  XCircle,
  Globe2,
  Download,
  Filter,
  CheckCircle2,
  Layers,
  Send,
  Users
} from 'lucide-react';
import { useApiQuery } from '@/lib/api-client';

export default function CampaignsDashboardPage() {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'RECIPIENT_BUILDER'>('CAMPAIGNS');
  
  // Campaigns list query
  const { data: campaignsData, mutate: refetchCampaigns, isLoading } = useApiQuery<any>('/api/v1/communication/campaigns');
  const campaigns = campaignsData?.data || [];
  
  // Execution states
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  // Recipient Builder State
  const [builderCountry, setBuilderCountry] = useState('US');
  const [builderIndustry, setBuilderIndustry] = useState('');
  const [builderState, setBuilderState] = useState('');
  const [builderCity, setBuilderCity] = useState('');
  const [builderListId, setBuilderListId] = useState('');
  const [builderFeedback, setBuilderFeedback] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);

  // Supported countries query
  const { data: countriesData } = useApiQuery<any>('/api/v1/leads/countries');
  const countries = countriesData?.data || [];

  // Saved lists query
  const { data: listsData, mutate: refetchLists } = useApiQuery<any>('/api/v1/leads/lists');
  const lists = listsData?.data || [];

  // Leads preview query for builder
  const countryQuery = builderCountry ? `&country=${builderCountry}` : '';
  const listQuery = builderListId ? `&listId=${builderListId}` : '';
  const { data: leadsData, mutate: refetchLeads } = useApiQuery<any>(
    `/api/v1/leads?limit=25${countryQuery}${listQuery}`
  );
  const recipientLeads = leadsData?.data?.leads || [];

  const handleExecute = async (id: string) => {
    setIsExecuting(id);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
    const storeId = typeof window !== 'undefined' ? localStorage.getItem('sellzy_store_id') : '';
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/communication/campaigns/${id}/execute`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'x-store-id': storeId || '' }
      });
      refetchCampaigns();
    } catch (e) {} finally { setIsExecuting(null); }
  };

  const handleCancel = async (id: string) => {
    setIsCancelling(id);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
    const storeId = typeof window !== 'undefined' ? localStorage.getItem('sellzy_store_id') : '';
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/communication/campaigns/${id}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'x-store-id': storeId || '' }
      });
      refetchCampaigns();
    } catch (e) {} finally { setIsCancelling(null); }
  };

  const handleStartRecipientDiscovery = async () => {
    setIsBuilding(true);
    setBuilderFeedback(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/jobs/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          country: builderCountry,
          industry: builderIndustry || undefined,
          state: builderState || undefined,
          city: builderCity || undefined,
          targetListId: builderListId || undefined,
          maxRecords: 25
        })
      });

      const data = await res.json();
      if (data.success) {
        setBuilderFeedback(
          data.data.status === 'FAILED'
            ? `Notice: ${data.data.errorDetails}`
            : `Recipient discovery job started for ${builderCountry}. Audience contacts will persist in your recipient pool.`
        );
        refetchLeads();
        refetchLists();
      } else {
        setBuilderFeedback(data.error || 'Failed to start recipient discovery.');
      }
    } catch (e: any) {
      setBuilderFeedback(e.message || 'Error occurred.');
    } finally {
      setIsBuilding(false);
    }
  };

  const handleExportBuilderCsv = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
    let query = `?country=${builderCountry}&token=${token}`;
    if (builderListId) query += `&listId=${builderListId}`;
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/export-csv${query}`, '_blank');
  };

  const activeCampaigns = campaigns.filter((c: any) => c.status === 'RUNNING' || c.status === 'ACTIVE').length;

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        <MarketingHeaderNav />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Email Sender &amp; Campaigns</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Discover audience contacts by country, assemble segmented lists, and schedule authorized broadcasts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-slate-200 p-1 bg-slate-50">
              <button
                onClick={() => setActiveTab('CAMPAIGNS')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'CAMPAIGNS' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Campaigns
              </button>
              <button
                onClick={() => setActiveTab('RECIPIENT_BUILDER')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  activeTab === 'RECIPIENT_BUILDER' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Country Recipient Builder
              </button>
            </div>
            {activeTab === 'RECIPIENT_BUILDER' && (
              <Button variant="outline" className="bg-white border-slate-200 text-slate-700" onClick={handleExportBuilderCsv}>
                <Download className="w-4 h-4 mr-2" /> Export Audience CSV
              </Button>
            )}
          </div>
        </div>

        {/* Tab 1: Campaigns Management */}
        {activeTab === 'CAMPAIGNS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm border border-slate-200">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Active Campaigns</p>
                    <div className="text-2xl font-extrabold text-slate-900">{activeCampaigns}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-slate-200">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Total Recipients</p>
                    <div className="text-2xl font-extrabold text-slate-900">
                      {campaigns.reduce((acc: number, c: any) => acc + (c.totalRecipients || 0), 0).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-slate-200">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Total Broadcasts</p>
                    <div className="text-2xl font-extrabold text-slate-900">{campaigns.length}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaigns Table */}
            <Card className="shadow-sm border border-slate-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <Thead>
                      <Tr className="bg-slate-50/75 border-b border-slate-200">
                        <Th className="pl-6 font-bold text-slate-700 text-xs">Campaign</Th>
                        <Th className="font-bold text-slate-700 text-xs">Status</Th>
                        <Th className="font-bold text-slate-700 text-xs">Audience</Th>
                        <Th className="font-bold text-slate-700 text-xs">Engagement</Th>
                        <Th className="text-right pr-6 font-bold text-slate-700 text-xs">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {isLoading ? (
                        <Tr><Td colSpan={5} className="text-center py-10 text-slate-500 font-medium text-xs">Loading campaigns...</Td></Tr>
                      ) : campaigns.length === 0 ? (
                        <Tr><Td colSpan={5} className="text-center py-10 text-slate-500 font-medium text-xs">No campaigns found. Switch to &apos;Country Recipient Builder&apos; to prepare an audience.</Td></Tr>
                      ) : (
                        campaigns.map((c: any) => (
                          <Tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                            <Td className="pl-6">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                                  c.channel === 'WHATSAPP' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                  {c.channel === 'WHATSAPP' ? <MessageCircle className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                                  <div className="text-[11px] font-semibold text-slate-500">
                                    Created: {new Date(c.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </Td>
                            <Td>
                              <Badge variant={
                                c.status === 'COMPLETED' ? 'success' : 
                                c.status === 'RUNNING' || c.status === 'ACTIVE' ? 'info' : 
                                c.status === 'DRAFT' || c.status === 'SCHEDULED' ? 'warning' : 'default'
                              } className="text-[10px]">
                                {c.status}
                              </Badge>
                            </Td>
                            <Td className="text-xs font-bold text-slate-900">
                              {(c.totalRecipients || 0).toLocaleString()} recipients
                            </Td>
                            <Td>
                              <div className="flex flex-col gap-1 w-full max-w-[120px]">
                                <div className="flex justify-between text-[11px]">
                                  <span className="font-semibold text-slate-500">Sent</span>
                                  <span className="font-bold text-slate-900">
                                    {c.totalRecipients > 0 ? Math.round(((c.sentCount || 0) / c.totalRecipients) * 100) : 0}%
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                  <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${c.totalRecipients > 0 ? ((c.sentCount || 0) / c.totalRecipients) * 100 : 0}%` }}></div>
                                </div>
                              </div>
                            </Td>
                            <Td className="text-right pr-6">
                              {(c.status === 'DRAFT' || c.status === 'SCHEDULED') && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleExecute(c._id)}
                                  disabled={isExecuting === c._id}
                                  className="h-8 bg-white text-xs font-bold"
                                >
                                  <Play className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Execute
                                </Button>
                              )}
                              {(c.status === 'RUNNING' || c.status === 'ACTIVE') && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleCancel(c._id)}
                                  disabled={isCancelling === c._id}
                                  className="h-8 bg-white text-xs font-bold"
                                >
                                  <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" /> Cancel
                                </Button>
                              )}
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
        )}

        {/* Tab 2: Country Recipient List Builder (Shared Engine) */}
        {activeTab === 'RECIPIENT_BUILDER' && (
          <div className="space-y-6">
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
              <Globe2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Shared Engine Recipient Discovery</p>
                <p className="text-slate-600 mt-0.5 font-medium">
                  This workflow uses the exact same country provider registry, deduplication engine, and suppression database as the Email Grabber. Recipient discovery never dispatches emails automatically.
                </p>
              </div>
            </div>

            {builderFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{builderFeedback}</span>
                </div>
                <button onClick={() => setBuilderFeedback(null)} className="text-emerald-600 hover:underline">Dismiss</button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Filter Configuration */}
              <Card className="lg:col-span-1 shadow-sm border border-slate-200">
                <CardContent className="p-5 space-y-3">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-brand-600" />
                    Target Audience Filters
                  </h2>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase">Country</label>
                    <select
                      value={builderCountry}
                      onChange={e => setBuilderCountry(e.target.value)}
                      className="w-full mt-1 h-9 text-xs font-bold border border-slate-200 rounded-lg px-2 bg-white"
                    >
                      {countries.map((c: any) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name} ({c.code}) {c.isSupported ? '' : '— [No Provider]'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase">Industry</label>
                    <Input
                      placeholder="e.g. Technology, Clean Energy"
                      value={builderIndustry}
                      onChange={e => setBuilderIndustry(e.target.value)}
                      className="mt-1 h-9 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase">State / Prov</label>
                      <Input
                        placeholder="e.g. CA, ON"
                        value={builderState}
                        onChange={e => setBuilderState(e.target.value)}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 uppercase">City</label>
                      <Input
                        placeholder="e.g. Toronto"
                        value={builderCity}
                        onChange={e => setBuilderCity(e.target.value)}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase">Assign to Saved List</label>
                    <select
                      value={builderListId}
                      onChange={e => setBuilderListId(e.target.value)}
                      className="w-full mt-1 h-9 text-xs border border-slate-200 rounded-lg px-2 bg-white"
                    >
                      <option value="">All Saved Recipients (Unassigned)</option>
                      {lists.map((l: any) => (
                        <option key={l._id} value={l._id}>{l.name} ({l.leadCount || 0})</option>
                      ))}
                    </select>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2 shadow-sm"
                    onClick={handleStartRecipientDiscovery}
                    disabled={isBuilding}
                  >
                    {isBuilding ? 'Discovering Recipients...' : 'Run Audience Discovery'}
                  </Button>
                </CardContent>
              </Card>

              {/* Recipient Audience Table */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="border border-slate-200 shadow-sm">
                  <CardContent className="p-0">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                          Audience Candidates ({builderCountry})
                        </h2>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                          {recipientLeads.length} leads
                        </span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => refetchLeads()} className="h-8 text-xs">
                        Refresh
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <Thead>
                          <Tr className="bg-slate-50/75 border-b border-slate-200">
                            <Th className="pl-6 font-bold text-slate-700 text-xs">Organization</Th>
                            <Th className="font-bold text-slate-700 text-xs">Contact Email</Th>
                            <Th className="font-bold text-slate-700 text-xs">Location</Th>
                            <Th className="pr-6 font-bold text-slate-700 text-xs">Verification</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {recipientLeads.length === 0 ? (
                            <Tr>
                              <Td colSpan={4} className="text-center py-10 text-slate-400 font-medium text-xs">
                                No recipients found for selected filters. Click &apos;Run Audience Discovery&apos; to populate.
                              </Td>
                            </Tr>
                          ) : (
                            recipientLeads.map((lead: any) => (
                              <Tr key={lead._id} className="hover:bg-slate-50/50">
                                <Td className="pl-6 font-bold text-slate-900 text-xs">{lead.companyName}</Td>
                                <Td className="text-xs font-mono font-medium text-slate-800">{lead.email}</Td>
                                <Td className="text-xs text-slate-600 font-medium">{lead.city || '—'}, {lead.country}</Td>
                                <Td className="pr-6">
                                  <Badge variant="outline" className="text-[10px] font-bold bg-slate-100">
                                    {lead.verificationStatus}
                                  </Badge>
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
        )}
      </div>
    </DashboardLayout>
  );
}
