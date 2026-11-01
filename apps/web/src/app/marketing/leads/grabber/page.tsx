'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MarketingHeaderNav } from '@/components/marketing/MarketingHeaderNav';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  Globe2, 
  Search, 
  Download, 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  FolderPlus,
  Layers,
  StopCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { useApiQuery } from '@/lib/api-client';

export default function CountryEmailGrabberPage() {
  // Country & Filter States
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [industry, setIndustry] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [maxRecords, setMaxRecords] = useState(25);
  const [targetListId, setTargetListId] = useState('');

  // Active Job Telemetry
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uiFeedback, setUiFeedback] = useState<string | null>(null);

  // Selection for CSV / List
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Fetch Supported Countries
  const { data: countriesData } = useApiQuery<any>('/api/v1/leads/countries');
  const countries = countriesData?.data || [];

  // Fetch Saved Lists
  const { data: listsData } = useApiQuery<any>('/api/v1/leads/lists');
  const lists = listsData?.data || [];

  // Fetch Collected Leads
  const countryQuery = selectedCountry ? `&country=${selectedCountry}` : '';
  const { data: leadsData, isLoading: isLoadingLeads, mutate: refetchLeads } = useApiQuery<any>(
    `/api/v1/leads?limit=50${countryQuery}`
  );
  const leads = leadsData?.data?.leads || [];

  // Poll Active Job Status
  useEffect(() => {
    if (!activeJobId) return;

    const interval = setInterval(async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/jobs/${activeJobId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setActiveJob(data.data);
          if (['COMPLETED', 'FAILED', 'CANCELLED', 'COMPLETED_WITH_WARNINGS'].includes(data.data.status)) {
            clearInterval(interval);
            refetchLeads();
          }
        }
      } catch (e) {
        console.error('Job polling error:', e);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeJobId, refetchLeads]);

  const handleStartCollection = async () => {
    if (!selectedCountry) return;
    setIsSubmitting(true);
    setUiFeedback(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/jobs/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          country: selectedCountry,
          industry: industry || undefined,
          state: stateFilter || undefined,
          city: cityFilter || undefined,
          businessName: businessName || undefined,
          maxRecords: Number(maxRecords),
          targetListId: targetListId || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setActiveJobId(data.data._id);
        setActiveJob(data.data);
        if (data.data.status === 'FAILED') {
          setUiFeedback(`Notice: ${data.data.errorDetails}`);
        } else {
          setUiFeedback(`Collection job initiated for ${selectedCountry}. Live telemetry updating.`);
        }
      } else {
        setUiFeedback(data.error || 'Failed to start collection job.');
      }
    } catch (e: any) {
      setUiFeedback(e.message || 'Error communicating with collection engine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelJob = async () => {
    if (!activeJobId) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/jobs/${activeJobId}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUiFeedback('Collection job cancelled by user.');
    } catch (e) {}
  };

  const handleExportCsv = (scope: 'COUNTRY' | 'SELECTED') => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
    let query = `?country=${selectedCountry}&token=${token}`;
    if (scope === 'SELECTED' && selectedLeadIds.length > 0) {
      query += `&leadIds=${selectedLeadIds.join(',')}`;
    }
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/export-csv${query}`, '_blank');
  };

  const selectedCountryInfo = countries.find((c: any) => c.code === selectedCountry);

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        <MarketingHeaderNav />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Country-Based Email Grabber</h1>
              <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200 text-xs">
                Global Registry Engine
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Discover official public business emails across supported countries via verified commercial registries.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => handleExportCsv('COUNTRY')}>
              <Download className="w-4 h-4 mr-2" /> Download Country CSV
            </Button>
          </div>
        </div>

        {/* Feedback / Notification Alert */}
        {uiFeedback && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>{uiFeedback}</span>
            </div>
            <button onClick={() => setUiFeedback(null)} className="text-blue-600 hover:underline">Dismiss</button>
          </div>
        )}

        {/* Collection Form & Real-Time Job Monitor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Collection Config Panel */}
          <Card className="lg:col-span-1 shadow-sm border border-slate-200">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-brand-600" />
                Target Geography &amp; Filters
              </h2>

              {/* Country Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Select Target Country</label>
                <select
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className="w-full mt-1 h-10 text-xs font-bold border border-slate-200 rounded-xl px-3 bg-white shadow-sm focus:ring-2 focus:ring-brand-500"
                >
                  {countries.map((c: any) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.code}) {c.isSupported ? '' : '— [No Provider Configured]'}
                    </option>
                  ))}
                </select>
                {selectedCountryInfo && !selectedCountryInfo.isSupported && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1">
                    No configured data provider supports {selectedCountryInfo.name}.
                  </p>
                )}
              </div>

              {/* Industry Filter */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Industry / Category</label>
                <Input
                  placeholder="e.g. Technology, Logistics, Dental"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              {/* State / Province & City */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">State / Province</label>
                  <Input
                    placeholder="e.g. IL, ON, NSW"
                    value={stateFilter}
                    onChange={e => setStateFilter(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">City</label>
                  <Input
                    placeholder="e.g. Chicago, London"
                    value={cityFilter}
                    onChange={e => setCityFilter(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              {/* Business Name (Optional) */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase">Business Name (Optional)</label>
                <Input
                  placeholder="e.g. Apex, Thames"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              {/* Maximum Records & Target List */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Max Records</label>
                  <select
                    value={maxRecords}
                    onChange={e => setMaxRecords(Number(e.target.value))}
                    className="w-full mt-1 h-9 text-xs border border-slate-200 rounded-lg px-2 bg-white"
                  >
                    <option value={10}>10 records</option>
                    <option value={25}>25 records</option>
                    <option value={50}>50 records</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase">Save to List</label>
                  <select
                    value={targetListId}
                    onChange={e => setTargetListId(e.target.value)}
                    className="w-full mt-1 h-9 text-xs border border-slate-200 rounded-lg px-2 bg-white"
                  >
                    <option value="">Unassigned</option>
                    {lists.map((l: any) => (
                      <option key={l._id} value={l._id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <Button
                variant="primary"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 shadow-sm"
                onClick={handleStartCollection}
                disabled={isSubmitting || activeJob?.status === 'RUNNING'}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Dispatching Job...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="w-4 h-4 fill-white" /> Start Collection Engine
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Real-time Job Progress & Telemetry */}
          <div className="lg:col-span-2 space-y-4">
            {activeJob && (
              <Card className="border border-brand-200 bg-brand-50/10 shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-800">Job: {activeJob._id}</span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-extrabold ${
                            activeJob.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : activeJob.status === 'FAILED'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : activeJob.status === 'CANCELLED'
                              ? 'bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
                          }`}
                        >
                          {activeJob.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Target Country: <strong>{activeJob.country}</strong> • Filters: {activeJob.filters?.industry || 'All Industries'}
                      </p>
                    </div>

                    {activeJob.status === 'RUNNING' && (
                      <Button size="sm" variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs" onClick={handleCancelJob}>
                        <StopCircle className="w-3.5 h-3.5 mr-1" /> Cancel Job
                      </Button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Worker Progress</span>
                      <span>{activeJob.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-brand-600 h-2.5 transition-all duration-300"
                        style={{ width: `${activeJob.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* 4 Stats Grid */}
                  <div className="grid grid-cols-4 gap-3 text-center pt-2 border-t border-slate-100">
                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Discovered</span>
                      <p className="text-base font-black text-slate-900 mt-0.5">{activeJob.totalDiscovered || 0}</p>
                    </div>
                    <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Saved</span>
                      <p className="text-base font-black text-emerald-800 mt-0.5">{activeJob.recordsSaved || 0}</p>
                    </div>
                    <div className="p-2 bg-amber-50/50 rounded-lg border border-amber-100">
                      <span className="text-[10px] font-bold text-amber-600 uppercase">Duplicates</span>
                      <p className="text-base font-black text-amber-800 mt-0.5">{activeJob.duplicatesSkipped || 0}</p>
                    </div>
                    <div className="p-2 bg-rose-50/50 rounded-lg border border-rose-100">
                      <span className="text-[10px] font-bold text-rose-600 uppercase">Invalid</span>
                      <p className="text-base font-black text-rose-800 mt-0.5">{activeJob.invalidRecords || 0}</p>
                    </div>
                  </div>

                  {activeJob.errorDetails && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-800">
                      {activeJob.errorDetails}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Collected Records Table */}
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-0">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Collected Business Emails ({selectedCountry})
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                      {leads.length} records
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => refetchLeads()} className="h-8 text-xs">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <Thead>
                      <Tr className="bg-slate-50/75 border-b border-slate-200">
                        <Th className="pl-6 font-bold text-slate-700 text-xs">Company &amp; Domain</Th>
                        <Th className="font-bold text-slate-700 text-xs">Contact Email</Th>
                        <Th className="font-bold text-slate-700 text-xs">Location</Th>
                        <Th className="font-bold text-slate-700 text-xs">Verification</Th>
                        <Th className="pr-6 font-bold text-slate-700 text-xs">Source Registry</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {isLoadingLeads ? (
                        <Tr>
                          <Td colSpan={5} className="text-center py-10 text-slate-400 font-medium text-xs">
                            Loading country records...
                          </Td>
                        </Tr>
                      ) : leads.length === 0 ? (
                        <Tr>
                          <Td colSpan={5} className="text-center py-10 text-slate-400 font-medium text-xs">
                            No records found for country {selectedCountry}. Start a collection job on the left to discover official public contacts.
                          </Td>
                        </Tr>
                      ) : (
                        leads.map((lead: any) => (
                          <Tr key={lead._id} className="hover:bg-slate-50/50">
                            <Td className="pl-6">
                              <p className="font-bold text-slate-900 text-xs">{lead.companyName}</p>
                              {lead.website && (
                                <a
                                  href={lead.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] text-brand-600 hover:underline flex items-center gap-1"
                                >
                                  {lead.website.replace(/^https?:\/\//, '')} <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </Td>
                            <Td className="text-xs font-mono font-medium text-slate-800">{lead.email}</Td>
                            <Td className="text-xs text-slate-600 font-medium">
                              {lead.city || '—'}, {lead.state || ''} ({lead.country})
                            </Td>
                            <Td>
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-bold ${
                                  lead.verificationStatus === 'deliverable'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                              >
                                {lead.verificationStatus}
                              </Badge>
                            </Td>
                            <Td className="pr-6">
                              <span className="text-[10px] text-slate-400 font-mono truncate block max-w-[180px]">
                                {lead.sourceUrl || lead.source}
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
