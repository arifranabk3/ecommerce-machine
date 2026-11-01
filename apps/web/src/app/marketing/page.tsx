'use client';

import { MarketingHeaderNav } from '@/components/marketing/MarketingHeaderNav';
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { 
  Download,
  Calendar,
  ChevronDown,
  RefreshCw,
  Store,
  Plus,
  MessageCircle,
  Mail,
  LayoutTemplate,
  Zap,
  Megaphone,
  MoreHorizontal,
  X,
  Search,
  Users,
  CheckCircle2,
  Play,
  XCircle,
  Building2,
  ShieldCheck,
  ListPlus,
  Send,
  AlertTriangle
} from 'lucide-react';
import { useApiQuery } from '@/lib/api-client';

export default function MarketingDashboardPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'lead_collection'>('campaigns');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [isDraftCampaignModalOpen, setIsDraftCampaignModalOpen] = useState(false);

  // Lead Collection State
  const [stateFilter, setStateFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [keywordsFilter, setKeywordsFilter] = useState('');
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectMessage, setCollectMessage] = useState<string | null>(null);

  // Campaign Draft from Leads State
  const [draftName, setDraftName] = useState('');
  const [draftSubject, setDraftSubject] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftAddress, setDraftAddress] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftResult, setDraftResult] = useState<any>(null);

  // Fetch real campaigns
  const { data: campaignsData, mutate: refetchCampaigns, isLoading: isLoadingCampaigns } = useApiQuery<any>('/api/v1/communication/campaigns');
  const campaigns = campaignsData?.data || [];

  // Fetch real saved leads
  const { data: leadsData, mutate: refetchLeads, isLoading: isLoadingLeads } = useApiQuery<any>('/api/v1/leads');
  const leads = leadsData?.data?.leads || [];
  const leadsTotal = leadsData?.data?.total || 0;

  // Fetch real saved lead lists
  const { data: listsData, mutate: refetchLists } = useApiQuery<any>('/api/v1/leads/lists');
  const leadLists = listsData?.data || [];

  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState<string | null>(null);

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

  const handleApprove = async (id: string) => {
    setIsApproving(id);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/campaigns/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      refetchCampaigns();
    } catch (e) {} finally { setIsApproving(null); }
  };

  const handleCollectLeads = async () => {
    setIsCollecting(true);
    setCollectMessage(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/collect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          state: stateFilter || undefined,
          industry: industryFilter || undefined,
          keywords: keywordsFilter || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setCollectMessage(`Collected ${data.data.savedCount} new verified leads (${data.data.duplicateCount} duplicates excluded). Zero emails sent.`);
        refetchLeads();
        refetchLists();
      } else {
        setCollectMessage(data.error || 'Failed to collect leads');
      }
    } catch (e: any) {
      setCollectMessage(e.message || 'Error executing collection');
    } finally {
      setIsCollecting(false);
    }
  };

  const handleCreateCampaignDraft = async () => {
    setIsDrafting(true);
    setDraftResult(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/campaigns/draft`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: draftName,
          subject: draftSubject,
          content: draftContent,
          physicalPostalAddress: draftAddress,
          leadIds: leads.map((l: any) => l._id)
        })
      });
      const data = await res.json();
      if (data.success) {
        setDraftResult(data.data);
        refetchCampaigns();
      } else {
        alert(data.error || 'Failed to create campaign draft');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleExportCsv = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/export-csv?token=${token}`, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        <MarketingHeaderNav />
        
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Marketing & Outreach</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Create compliant outreach campaigns and discover authorized US business leads.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-slate-200 p-1 bg-slate-50">
              <button 
                onClick={() => setActiveTab('campaigns')} 
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'campaigns' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Campaigns
              </button>
              <button 
                onClick={() => setActiveTab('lead_collection')} 
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'lead_collection' ? 'bg-white shadow text-brand-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                USA Business Leads & Lists
              </button>
            </div>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" size="icon" onClick={() => { refetchCampaigns(); refetchLeads(); }}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            {activeTab === 'lead_collection' && (
              <>
                <Button variant="outline" className="bg-white border-slate-200 text-slate-700" onClick={handleExportCsv}>
                  <Download className="w-4 h-4 mr-2" /> Export CSV
                </Button>
                <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm" onClick={() => setIsCollectModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Collect US Leads
                </Button>
                <Button variant="outline" className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100" onClick={() => setIsDraftCampaignModalOpen(true)}>
                  <Send className="w-4 h-4 mr-2" /> Create Campaign Draft
                </Button>
              </>
            )}
          </div>
        </div>

        {/* TAB 1: CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Create Campaign', icon: Megaphone, color: 'text-brand-600', bg: 'bg-brand-50' },
                { label: 'Lead Discovery', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', onClick: () => setActiveTab('lead_collection') },
                { label: 'Create Template', icon: LayoutTemplate, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Send Message', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Automation', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((action, i) => (
                <button key={i} onClick={action.onClick} className="flex flex-col items-center justify-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group">
                  <div className={`w-12 h-12 rounded-xl ${action.bg} ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{action.label}</span>
                </button>
              ))}
            </div>

            <Card className="!p-0 overflow-hidden shadow-sm border-slate-200">
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                <h3 className="text-base font-extrabold text-slate-900">Campaigns & Explicit Approval Queue</h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <Thead>
                    <Tr>
                      <Th className="pl-6 font-bold text-slate-600">Campaign</Th>
                      <Th className="font-bold text-slate-600">Channel</Th>
                      <Th className="font-bold text-slate-600">Status</Th>
                      <Th className="font-bold text-slate-600">Recipients</Th>
                      <Th className="font-bold text-slate-600">Sent</Th>
                      <Th className="text-right pr-6 font-bold text-slate-600">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isLoadingCampaigns ? (
                      <Tr><Td colSpan={6} className="text-center py-10 text-slate-500 font-medium">Loading campaigns...</Td></Tr>
                    ) : campaigns.length === 0 ? (
                      <Tr><Td colSpan={6} className="text-center py-10 text-slate-500 font-medium">No campaigns found.</Td></Tr>
                    ) : (
                      campaigns.map((c: any) => (
                        <Tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                          <Td className="pl-6">
                            <div>
                              <p className="font-bold text-slate-900">{c.name}</p>
                              <p className="text-xs font-medium text-slate-500 mt-0.5">Created: {new Date(c.createdAt).toLocaleDateString()}</p>
                            </div>
                          </Td>
                          <Td><span className="font-semibold text-slate-700">{c.channel}</span></Td>
                          <Td>
                            <Badge variant={c.status === 'APPROVED' ? 'success' : c.status === 'DRAFT' ? 'info' : 'default'}>
                              {c.status}
                            </Badge>
                          </Td>
                          <Td><span className="font-bold text-slate-900">{(c.totalRecipients || 0).toLocaleString()}</span></Td>
                          <Td><span className="font-bold text-slate-900">{(c.sentCount || 0).toLocaleString()}</span></Td>
                          <Td className="text-right pr-6">
                            <div className="flex justify-end gap-2">
                              {c.status === 'DRAFT' && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleApprove(c._id)}
                                  disabled={isApproving === c._id}
                                  className="h-8 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Explicit Approve
                                </Button>
                              )}
                              {(c.status === 'APPROVED' || c.status === 'SCHEDULED') && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleExecute(c._id)}
                                  disabled={isExecuting === c._id}
                                  className="h-8 bg-white"
                                >
                                  <Play className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Dispatch
                                </Button>
                              )}
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
        )}

        {/* TAB 2: USA BUSINESS LEAD COLLECTION & SAVED LISTS */}
        {activeTab === 'lead_collection' && (
          <div className="space-y-6">
            
            {/* SAFETY BANNER */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <span className="font-bold">Strict Two-Stage Separation Enforced:</span> Lead collection only validates, deduplicates, and saves authorized US business contact emails into your CRM. Zero emails are ever dispatched during collection. Commercial sending requires explicit manual campaign approval with verified CAN-SPAM physical postal address and active suppression filtering.
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Saved Leads</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{leadsTotal.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved Lists</span>
                <p className="text-2xl font-black text-brand-600 mt-1">{leadLists.length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CAN-SPAM Compliant</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">100%</p>
              </div>
            </div>

            {/* SAVED LEADS TABLE */}
            <Card className="!p-0 overflow-hidden shadow-sm border-slate-200">
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Saved US Business Leads</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Publicly listed US business contacts with source attribution and deliverability status.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <Thead>
                    <Tr>
                      <Th className="pl-6 font-bold text-slate-600">Company & Contact</Th>
                      <Th className="font-bold text-slate-600">Location</Th>
                      <Th className="font-bold text-slate-600">Industry</Th>
                      <Th className="font-bold text-slate-600">Verification</Th>
                      <Th className="font-bold text-slate-600">Source Attribution</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isLoadingLeads ? (
                      <Tr><Td colSpan={5} className="text-center py-10 text-slate-500 font-medium">Loading saved leads...</Td></Tr>
                    ) : leads.length === 0 ? (
                      <Tr><Td colSpan={5} className="text-center py-10 text-slate-500 font-medium">No saved leads in your database. Click &quot;Collect US Leads&quot; above to query verified public directories.</Td></Tr>
                    ) : (
                      leads.map((l: any) => (
                        <Tr key={l._id} className="hover:bg-slate-50/50 transition-colors">
                          <Td className="pl-6">
                            <div>
                              <p className="font-bold text-slate-900">{l.companyName}</p>
                              <p className="text-xs font-medium text-slate-600">{l.email}</p>
                            </div>
                          </Td>
                          <Td><span className="text-xs font-semibold text-slate-700">{l.city}, {l.state} (US)</span></Td>
                          <Td><span className="text-xs font-medium text-slate-600">{l.industry || 'General'}</span></Td>
                          <Td>
                            <Badge variant={l.verificationStatus === 'deliverable' ? 'success' : l.verificationStatus === 'suppressed' ? 'default' : 'info'}>
                              {l.verificationStatus}
                            </Badge>
                          </Td>
                          <Td>
                            <a href={l.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline truncate max-w-[200px] block">
                              {l.sourceUrl || l.source}
                            </a>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {/* MODAL: COLLECT LEADS */}
        {isCollectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-lg">Collect US Business Leads</h3>
                <button onClick={() => setIsCollectModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Query authorized US state business registries and public trade directories. Zero emails are sent.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">State (2-letter code, e.g. IL, TX, CA, NY)</label>
                  <input 
                    type="text" 
                    value={stateFilter} 
                    onChange={e => setStateFilter(e.target.value.toUpperCase())}
                    placeholder="e.g. IL"
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Industry Filter</label>
                  <input 
                    type="text" 
                    value={industryFilter} 
                    onChange={e => setIndustryFilter(e.target.value)}
                    placeholder="e.g. Logistics, Technology, Healthcare"
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Keywords</label>
                  <input 
                    type="text" 
                    value={keywordsFilter} 
                    onChange={e => setKeywordsFilter(e.target.value)}
                    placeholder="e.g. Solutions, Dental, Advisory"
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              {collectMessage && (
                <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg text-xs font-semibold text-brand-800">
                  {collectMessage}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" onClick={() => setIsCollectModalOpen(false)}>Close</Button>
                <Button variant="primary" onClick={handleCollectLeads} disabled={isCollecting} className="bg-brand-600 text-white">
                  {isCollecting ? 'Collecting & Validating...' : 'Discover & Save Leads'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: DRAFT CAMPAIGN */}
        {isDraftCampaignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-lg">Create Campaign Draft from Saved Leads</h3>
                <button onClick={() => setIsDraftCampaignModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Stage 2 Safety Gate: Creates a campaign in DRAFT status. Requires explicit review and approval before live dispatch.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Campaign Name</label>
                  <input 
                    type="text" 
                    value={draftName} 
                    onChange={e => setDraftName(e.target.value)}
                    placeholder="e.g. US B2B Wholesale Partnership Q4"
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Email Subject Line</label>
                  <input 
                    type="text" 
                    value={draftSubject} 
                    onChange={e => setDraftSubject(e.target.value)}
                    placeholder="e.g. Exploring Wholesale Supply Synergies"
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Message Content</label>
                  <textarea 
                    value={draftContent} 
                    onChange={e => setDraftContent(e.target.value)}
                    placeholder="Write truthful, compliant business message content..."
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm h-24"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Sender Physical Postal Address (Mandatory for CAN-SPAM)</label>
                  <input 
                    type="text" 
                    value={draftAddress} 
                    onChange={e => setDraftAddress(e.target.value)}
                    placeholder="e.g. 100 N Michigan Ave, Suite 400, Chicago, IL 60601, USA"
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              {draftResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800">
                  Campaign Draft Created ({draftResult.totalEligibleLeads} eligible recipients, {draftResult.suppressedCount} suppressed). Click &apos;Explicit Approve&apos; on the Campaigns tab when ready to authorize sending.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" onClick={() => setIsDraftCampaignModalOpen(false)}>Close</Button>
                <Button variant="primary" onClick={handleCreateCampaignDraft} disabled={isDrafting} className="bg-brand-600 text-white">
                  {isDrafting ? 'Creating Draft...' : 'Create Draft'}
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

