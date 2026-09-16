'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  Megaphone,
  Plus,
  BarChart2,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Search,
  Calendar,
  ChevronDown,
  TrendingUp,
  Target,
  Play,
  XCircle
} from 'lucide-react';
import { useApiQuery } from '@/lib/api-client';

export default function CampaignsDashboardPage() {
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

  // Quick stats derived from data
  const activeCampaigns = campaigns.filter((c: any) => c.status === 'RUNNING' || c.status === 'ACTIVE').length;
  const totalRecipients = campaigns.reduce((acc: number, c: any) => acc + (c.totalRecipients || 0), 0);

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketing Campaigns</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage campaigns, broadcasts, and audience engagement.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex bg-white">
              <BarChart2 className="w-4 h-4 mr-2 text-slate-400" /> View Reports
            </Button>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" /> Create Campaign
            </Button>
          </div>
        </div>

        {/* Quick Stats Sidebar (Expanded across top instead of split) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group">
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
          
          <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">Total Audience Targeted</p>
                <div className="text-2xl font-extrabold text-slate-900">{totalRecipients.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-premium-hover transition-shadow duration-300 relative overflow-hidden group">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">Total Campaigns</p>
                <div className="text-2xl font-extrabold text-slate-900">{campaigns.length}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="p-2 flex flex-col md:flex-row gap-2 items-center mt-6">
          <div className="relative w-full md:flex-1 md:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full pl-9 pr-4 py-2 bg-transparent border-none text-sm focus:outline-none focus:ring-0"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <Button variant="outline" size="sm" className="whitespace-nowrap bg-white text-slate-700">
              All Channels <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap bg-white text-slate-700">
              All Statuses <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap bg-white text-slate-700">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" /> Created Date <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card className="!p-0 overflow-hidden shadow-sm border-slate-200">
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th className="pl-6">Campaign</Th>
                  <Th>Status</Th>
                  <Th>Audience</Th>
                  <Th>Engagement</Th>
                  <Th className="text-right pr-6">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={5} className="text-center py-10 text-slate-500 font-medium">Loading campaigns...</Td>
                  </Tr>
                ) : campaigns.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} className="text-center py-10 text-slate-500 font-medium">No campaigns found.</Td>
                  </Tr>
                ) : (
                  campaigns.map((c: any) => (
                    <Tr key={c._id} className="hover:bg-slate-50/50 transition-colors">
                      <Td className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border
                            ${c.channel === 'WHATSAPP' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}
                          `}>
                            {c.channel === 'WHATSAPP' ? <MessageCircle className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{c.name}</div>
                            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Created: {new Date(c.createdAt).toLocaleDateString()}</div>
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
                      <Td>
                        <div className="font-bold text-slate-900">{(c.totalRecipients || 0).toLocaleString()}</div>
                        <div className="text-[11px] font-medium text-slate-500">Recipients</div>
                      </Td>
                      <Td>
                        <div className="flex flex-col gap-1 w-full max-w-[120px]">
                          <div className="flex justify-between text-xs">
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
    </DashboardLayout>
  );
}
