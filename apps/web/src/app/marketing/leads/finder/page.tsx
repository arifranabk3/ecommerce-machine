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
  Search, 
  Building2, 
  Globe2, 
  Phone, 
  MapPin, 
  Download, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Layers, 
  FolderPlus, 
  AlertTriangle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useApiQuery } from '@/lib/api-client';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function USABusinessLeadFinderPage() {
  // Query Filters
  const [businessName, setBusinessName] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [industry, setIndustry] = useState('');
  const [keywords, setKeywords] = useState('');
  const [hasWebsiteOnly, setHasWebsiteOnly] = useState(false);

  // Selected Leads for Bulk Actions
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [targetListId, setTargetListId] = useState('');

  // Collect Execution State
  const [isSearching, setIsSearching] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Fetch Existing Saved Leads
  const { data: leadsData, isLoading, mutate: refetchLeads } = useApiQuery<any>(
    `/api/v1/leads?state=${selectedState}&industry=${encodeURIComponent(industry)}&search=${encodeURIComponent(businessName || keywords)}&limit=50`
  );
  const leads = leadsData?.data?.leads || [];
  const totalCount = leadsData?.data?.total || 0;

  // Fetch Lists for Target Dropdown
  const { data: listsData } = useApiQuery<any>('/api/v1/leads/lists');
  const lists = listsData?.data || [];

  const handleExecuteDiscovery = async () => {
    setIsSearching(true);
    setSearchFeedback(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/collect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          businessName: businessName || undefined,
          state: selectedState || undefined,
          city: city || undefined,
          industry: industry || undefined,
          keywords: keywords || undefined,
          targetListId: targetListId || undefined,
          limit: 25
        })
      });

      const data = await res.json();
      if (data.success) {
        setSearchFeedback(
          `Discovered ${data.data.discoveredCount} public leads. Saved ${data.data.savedCount} new records (${data.data.duplicateCount} duplicates excluded). Zero emails sent.`
        );
        refetchLeads();
      } else {
        setSearchFeedback(data.error || 'Failed to discover leads from authorized public directories.');
      }
    } catch (e: any) {
      setSearchFeedback(e.message || 'Error communicating with lead discovery API.');
    } finally {
      setIsSearching(false);
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

  const handleExportSelected = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/export-csv?token=${token}`, '_blank');
  };

  const handleAddSelectedToList = async () => {
    if (!targetListId || selectedLeadIds.length === 0) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/lists/${targetListId}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          leadIds: selectedLeadIds,
          action: 'ADD'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSearchFeedback(`Successfully attached ${selectedLeadIds.length} leads to list.`);
        setSelectedLeadIds([]);
        refetchLeads();
      }
    } catch (e: any) {
      setSearchFeedback(e.message || 'Failed to associate leads with list.');
    }
  };

  const displayedLeads = hasWebsiteOnly ? leads.filter((l: any) => Boolean(l.website)) : leads;

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Navigation Tab Bar */}
        <MarketingHeaderNav />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">USA Business Lead Finder</h1>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                Official Public Registries
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Discover verified US businesses with official state registry attribution, public websites, and direct phone/email records.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" onClick={handleExportSelected}>
              <Download className="w-4 h-4 mr-2" /> Export to CSV
            </Button>
            <Button 
              variant="primary" 
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
              onClick={handleExecuteDiscovery}
              disabled={isSearching}
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Querying Directories...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4" /> Discover Public Leads
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {/* Business Name */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Business Name</label>
                <Input
                  placeholder="e.g. Apex Logistics"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              {/* State Filter */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">US State</label>
                <select
                  value={selectedState}
                  onChange={e => setSelectedState(e.target.value)}
                  className="w-full mt-1 h-9 text-xs border border-slate-200 rounded-lg px-2 bg-white"
                >
                  <option value="">All 50 States</option>
                  {US_STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">City</label>
                <Input
                  placeholder="e.g. Chicago"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              {/* Industry Filter */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Industry</label>
                <Input
                  placeholder="e.g. Healthcare, Tech"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              {/* Keyword Filter */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Keywords</label>
                <Input
                  placeholder="e.g. Dental, Cloud"
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              {/* Target List Destination */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Save to List</label>
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
            </div>

            {/* Sub-Filters & Checkboxes */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasWebsiteOnly}
                  onChange={e => setHasWebsiteOnly(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600"
                />
                Require verified public website
              </label>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">{totalCount} total verified records</span>
                <Button variant="outline" size="sm" onClick={() => refetchLeads()} className="h-8 text-xs">
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Alert */}
        {searchFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{searchFeedback}</span>
            </div>
            <button onClick={() => setSearchFeedback(null)} className="text-emerald-600 hover:underline">Dismiss</button>
          </div>
        )}

        {/* Bulk Action Toolbar */}
        {selectedLeadIds.length > 0 && (
          <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between shadow-lg animate-fade-in">
            <span className="text-xs font-bold pl-2">{selectedLeadIds.length} leads selected</span>
            <div className="flex items-center gap-2">
              {lists.length > 0 && targetListId && (
                <Button size="sm" variant="primary" className="bg-brand-600 text-white text-xs" onClick={handleAddSelectedToList}>
                  <FolderPlus className="w-3.5 h-3.5 mr-1" /> Add to List
                </Button>
              )}
              <Button size="sm" variant="outline" className="bg-slate-800 text-white border-slate-700 text-xs" onClick={handleExportSelected}>
                <Download className="w-3.5 h-3.5 mr-1" /> Export Selected
              </Button>
            </div>
          </div>
        )}

        {/* Leads Data Table */}
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
                        checked={selectedLeadIds.length > 0 && selectedLeadIds.length === displayedLeads.length}
                        className="rounded border-slate-300"
                      />
                    </Th>
                    <Th className="font-bold text-slate-700 text-xs">Business &amp; Website</Th>
                    <Th className="font-bold text-slate-700 text-xs">Public Contact</Th>
                    <Th className="font-bold text-slate-700 text-xs">Location</Th>
                    <Th className="font-bold text-slate-700 text-xs">Industry</Th>
                    <Th className="font-bold text-slate-700 text-xs">Verification</Th>
                    <Th className="pr-6 font-bold text-slate-700 text-xs">Source Attribution</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {isLoading ? (
                    <Tr>
                      <Td colSpan={7} className="text-center py-12 text-slate-400 font-medium text-xs">
                        Loading verified business records...
                      </Td>
                    </Tr>
                  ) : displayedLeads.length === 0 ? (
                    <Tr>
                      <Td colSpan={7} className="text-center py-12 text-slate-400 font-medium text-xs">
                        No business leads found matching filters. Click &quot;Discover Public Leads&quot; to query directories.
                      </Td>
                    </Tr>
                  ) : (
                    displayedLeads.map((lead: any) => (
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
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900 text-xs">{lead.companyName}</p>
                            {lead.website ? (
                              <a
                                href={lead.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-brand-600 hover:underline flex items-center gap-1"
                              >
                                {lead.website.replace(/^https?:\/\//, '')} <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400">No website</span>
                            )}
                          </div>
                        </Td>
                        <Td>
                          <div className="space-y-0.5">
                            <p className="text-xs font-mono font-medium text-slate-800">{lead.email}</p>
                            {lead.phone && (
                              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Phone className="w-2.5 h-2.5" /> {lead.phone}
                              </p>
                            )}
                          </div>
                        </Td>
                        <Td className="text-xs text-slate-700 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {lead.city || '—'}, {lead.state || 'US'}
                          </span>
                        </Td>
                        <Td className="text-xs text-slate-600 font-medium">{lead.industry || 'General'}</Td>
                        <Td>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold ${
                              lead.verificationStatus === 'deliverable'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : lead.verificationStatus === 'undeliverable'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {lead.verificationStatus}
                          </Badge>
                        </Td>
                        <Td className="pr-6">
                          <div className="space-y-0.5 max-w-[200px]">
                            <p className="text-[11px] font-bold text-slate-700">{lead.source}</p>
                            {lead.sourceUrl && (
                              <a
                                href={lead.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-slate-400 truncate block hover:text-slate-600"
                              >
                                {lead.sourceUrl}
                              </a>
                            )}
                          </div>
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

