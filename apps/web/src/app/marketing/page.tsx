'use client';

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
  XCircle
} from 'lucide-react';
import { useApiQuery } from '@/lib/api-client';

export default function MarketingDashboardPage() {
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignStep, setCampaignStep] = useState(1);

  // Fetch real campaigns
  const { data: campaignsData, mutate: refetchCampaigns, isLoading } = useApiQuery<any>('/api/v1/communication/campaigns');
  const campaigns = campaignsData?.data || [];
  
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState<string | null>(null);

  const handleExecute = async (id: string) => {
    setIsExecuting(id);
    const token = localStorage.getItem('sellzy_token');
    const storeId = localStorage.getItem('sellzy_store_id');
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
    const token = localStorage.getItem('sellzy_token');
    const storeId = localStorage.getItem('sellzy_store_id');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/communication/campaigns/${id}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'x-store-id': storeId || '' }
      });
      refetchCampaigns();
    } catch (e) {} finally { setIsCancelling(null); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Marketing</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Create, manage and measure campaigns across every customer channel.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hidden sm:flex">
              <Store className="w-4 h-4 mr-2 text-slate-500" />
              All Stores
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <Button variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100">
              <Calendar className="w-4 h-4 mr-2 text-slate-500" />
              This Month
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" size="icon" onClick={() => refetchCampaigns()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hidden sm:flex">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm" onClick={() => setIsCampaignModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Create Campaign', icon: Megaphone, color: 'text-brand-600', bg: 'bg-brand-50' },
            { label: 'Create Audience', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Create Template', icon: LayoutTemplate, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Send Message', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Automation', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((action, i) => (
            <button key={i} className="flex flex-col items-center justify-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group">
              <div className={`w-12 h-12 rounded-xl ${action.bg} ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-700">{action.label}</span>
            </button>
          ))}
        </div>

        {/* CAMPAIGNS & RECENT ACTIVITY */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="!p-0 overflow-hidden shadow-sm border-slate-200">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
              <h3 className="text-base font-extrabold text-slate-900">Active & Recent Campaigns</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search campaigns..." 
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-full sm:w-64"
                  />
                </div>
              </div>
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
                  {isLoading ? (
                    <Tr>
                      <Td colSpan={6} className="text-center py-10 text-slate-500 font-medium">Loading campaigns...</Td>
                    </Tr>
                  ) : campaigns.length === 0 ? (
                    <Tr>
                      <Td colSpan={6} className="text-center py-10 text-slate-500 font-medium">No campaigns found.</Td>
                    </Tr>
                  ) : (
                    campaigns.map((c: any) => (
                      <Tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                        <Td className="pl-6">
                          <div>
                            <p className="font-bold text-slate-900">{c.name}</p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">Created: {new Date(c.createdAt).toLocaleDateString()}</p>
                          </div>
                        </Td>
                        <Td>
                          <span className="font-semibold text-slate-700">{c.channel}</span>
                        </Td>
                        <Td>
                          <Badge 
                            variant={c.status === 'RUNNING' || c.status === 'ACTIVE' ? 'success' : c.status === 'SCHEDULED' || c.status === 'DRAFT' ? 'info' : 'default'}
                            className="text-[10px]"
                          >
                            {c.status}
                          </Badge>
                        </Td>
                        <Td>
                          <span className="font-bold text-slate-900">{(c.totalRecipients || 0).toLocaleString()}</span>
                        </Td>
                        <Td>
                          <span className="font-bold text-slate-900">{(c.sentCount || 0).toLocaleString()}</span>
                        </Td>
                        <Td className="text-right pr-6">
                          <div className="flex justify-end gap-2">
                            {(c.status === 'DRAFT' || c.status === 'SCHEDULED') && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleExecute(c._id)}
                                disabled={isExecuting === c._id}
                                className="h-8 bg-white"
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
                                className="h-8 bg-white"
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" /> Cancel
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

      </div>

      {/* CREATE CAMPAIGN MODAL FOUNDATION */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCampaignModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-extrabold text-slate-900">Create New Campaign</h2>
              <button onClick={() => setIsCampaignModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Steps */}
              <div className="w-48 bg-slate-50 border-r border-slate-100 p-4 hidden md:block overflow-y-auto">
                <div className="space-y-2 relative before:absolute before:inset-0 before:ml-[27px] before:h-[calc(100%-40px)] before:top-[20px] before:w-0.5 before:bg-slate-200">
                  {['Campaign Details', 'Audience', 'Channel', 'Content', 'Budget', 'Schedule', 'Review & Launch'].map((step, idx) => {
                    const stepNum = idx + 1;
                    const isActive = campaignStep === stepNum;
                    const isPast = campaignStep > stepNum;
                    return (
                      <div key={step} className="relative flex items-center gap-3 py-2 z-10 cursor-pointer group" onClick={() => setCampaignStep(stepNum)}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          isActive ? 'bg-brand-600 text-white border-2 border-brand-100 ring-4 ring-brand-50' : 
                          isPast ? 'bg-emerald-500 text-white border-2 border-emerald-100' : 'bg-white text-slate-400 border border-slate-200 group-hover:border-brand-300 group-hover:text-brand-500'
                        }`}>
                          {isPast ? <CheckCircle2 className="w-3 h-3" /> : stepNum}
                        </div>
                        <span className={`text-xs font-bold transition-colors ${isActive ? 'text-brand-700' : isPast ? 'text-slate-700' : 'text-slate-500 group-hover:text-brand-500'}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Content Area */}
              <div className="flex-1 p-6 overflow-y-auto bg-white">
                <div className="mb-6">
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {['Campaign Details', 'Audience', 'Channel', 'Content', 'Budget', 'Schedule', 'Review & Launch'][campaignStep - 1]}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Configure your campaign settings for this step.</p>
                </div>
                
                <div className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/50 text-center px-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <Megaphone className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-bold">UI Foundation for Step {campaignStep}</p>
                  <p className="text-slate-400 font-medium text-sm mt-1">Backend integration required</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white">
              <Button variant="outline" className="text-slate-600 font-bold bg-white" onClick={() => setCampaignStep(Math.max(1, campaignStep - 1))} disabled={campaignStep === 1}>
                Back
              </Button>
              <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 shadow-sm" onClick={() => {
                if (campaignStep < 7) setCampaignStep(campaignStep + 1);
                else setIsCampaignModalOpen(false);
              }}>
                {campaignStep === 7 ? 'Launch Campaign' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
