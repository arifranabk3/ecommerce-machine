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
  Users, 
  FolderPlus, 
  Trash2, 
  Edit3, 
  Download, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Folder,
  Send,
  Layers,
  Archive
} from 'lucide-react';
import { useApiQuery } from '@/lib/api-client';

export default function LeadListsCRMPage() {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [listFeedback, setListFeedback] = useState<string | null>(null);

  // Rename modal
  const [editingList, setEditingList] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Fetch Lists
  const { data: listsData, isLoading: isLoadingLists, mutate: refetchLists } = useApiQuery<any>(
    '/api/v1/leads/lists'
  );
  const lists = listsData?.data || [];

  // Fetch Leads for Selected List (or All if none selected)
  const listQueryParam = selectedListId ? `&listId=${selectedListId}` : '';
  const { data: leadsData, isLoading: isLoadingLeads, mutate: refetchLeads } = useApiQuery<any>(
    `/api/v1/leads?limit=50${listQueryParam}`
  );
  const leads = leadsData?.data?.leads || [];
  const totalLeads = leadsData?.data?.total || 0;

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    setIsCreatingList(true);
    setListFeedback(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/lists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newListName,
          description: newListDescription || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setListFeedback(`Created lead list "${newListName}" successfully.`);
        setNewListName('');
        setNewListDescription('');
        setIsCreateModalOpen(false);
        refetchLists();
      } else {
        setListFeedback(data.error || 'Failed to create list');
      }
    } catch (e: any) {
      setListFeedback(e.message || 'Error occurred creating list');
    } finally {
      setIsCreatingList(false);
    }
  };

  const handleUpdateList = async () => {
    if (!editingList || !editName.trim()) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/lists/${editingList._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editName,
          description: editDesc
        })
      });

      const data = await res.json();
      if (data.success) {
        setListFeedback(`Updated list "${editName}" successfully.`);
        setEditingList(null);
        refetchLists();
      }
    } catch (e: any) {
      setListFeedback(e.message || 'Failed to update list');
    }
  };

  const handleDeleteList = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? Leads in this list will be detached but preserved in your tenant database.`)) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/lists/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setListFeedback(`List "${name}" deleted.`);
        if (selectedListId === id) setSelectedListId(null);
        refetchLists();
        refetchLeads();
      }
    } catch (e: any) {
      setListFeedback(e.message || 'Failed to delete list');
    }
  };

  const handleExportList = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : '';
    const query = selectedListId ? `?listId=${selectedListId}&token=${token}` : `?token=${token}`;
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/leads/export-csv${query}`, '_blank');
  };

  const activeListName = lists.find((l: any) => l._id === selectedListId)?.name || 'All Saved Leads';

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Navigation Tab Bar */}
        <MarketingHeaderNav />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Saved Lead Lists &amp; CRM</h1>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                Audience Segmentation
              </Badge>
            </div>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Create, organize, and inspect curated business lead lists. Detach or associate leads with zero auto-messaging.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" onClick={handleExportList}>
              <Download className="w-4 h-4 mr-2" /> Export Active View
            </Button>
            <Button
              variant="primary"
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Create Lead List
            </Button>
          </div>
        </div>

        {/* Feedback Alert */}
        {listFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{listFeedback}</span>
            </div>
            <button onClick={() => setListFeedback(null)} className="text-emerald-600 hover:underline">Dismiss</button>
          </div>
        )}

        {/* Main Grid: Lists Navigation Sidebar & Leads Detail Table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Lists Column */}
          <Card className="lg:col-span-1 border border-slate-200 shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Folder className="w-4 h-4 text-brand-600" />
                  Your Lead Lists
                </h2>
                <span className="text-[11px] font-bold text-slate-500">{lists.length} lists</span>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => setSelectedListId(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedListId === null
                      ? 'bg-brand-50 text-brand-700 border border-brand-100'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> All Saved Leads
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-white font-mono">
                    {totalLeads}
                  </Badge>
                </button>

                {lists.map((list: any) => (
                  <div
                    key={list._id}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      selectedListId === list._id
                        ? 'bg-brand-50 text-brand-700 border border-brand-100'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedListId(list._id)}
                      className="flex-1 text-left truncate flex items-center gap-2"
                    >
                      <Folder className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600" />
                      <span className="truncate">{list.name}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {list.leadCount || 0}
                      </span>
                      <button
                        onClick={() => {
                          setEditingList(list);
                          setEditName(list.name);
                          setEditDesc(list.description || '');
                        }}
                        className="p-1 hover:text-slate-900 text-slate-400"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteList(list._id, list.name)}
                        className="p-1 hover:text-rose-600 text-slate-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leads Data Table */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-0">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      {activeListName}
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
                        <Th className="pl-6 font-bold text-slate-700 text-xs">Company &amp; Website</Th>
                        <Th className="font-bold text-slate-700 text-xs">Contact Email</Th>
                        <Th className="font-bold text-slate-700 text-xs">Location</Th>
                        <Th className="font-bold text-slate-700 text-xs">Verification</Th>
                        <Th className="pr-6 font-bold text-slate-700 text-xs">Source</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {isLoadingLeads ? (
                        <Tr>
                          <Td colSpan={5} className="text-center py-12 text-slate-400 font-medium text-xs">
                            Loading list leads...
                          </Td>
                        </Tr>
                      ) : leads.length === 0 ? (
                        <Tr>
                          <Td colSpan={5} className="text-center py-12 text-slate-400 font-medium text-xs">
                            No leads assigned to &quot;{activeListName}&quot;. Use the Lead Finder or Email Grabber to add contacts.
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
                                  className="text-[11px] text-brand-600 hover:underline block truncate max-w-[200px]"
                                >
                                  {lead.website}
                                </a>
                              )}
                            </Td>
                            <Td className="text-xs font-mono font-medium text-slate-800">{lead.email}</Td>
                            <Td className="text-xs text-slate-600 font-medium">
                              {lead.city || '—'}, {lead.state || 'US'}
                            </Td>
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
                            <Td className="pr-6 text-xs text-slate-500 font-medium">{lead.source}</Td>
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

        {/* Create List Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">Create Saved Lead List</h3>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase">List Name</label>
                <Input
                  value={newListName}
                  onChange={e => setNewListName(e.target.value)}
                  placeholder="e.g. Q4 Midwest Logistics Outreach"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase">Description (Optional)</label>
                <textarea
                  value={newListDescription}
                  onChange={e => setNewListDescription(e.target.value)}
                  rows={3}
                  placeholder="Targeting verified B2B freight contacts..."
                  className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-xs resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleCreateList} disabled={!newListName.trim() || isCreatingList} className="bg-brand-600 text-white">
                  {isCreatingList ? 'Creating...' : 'Create List'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Rename / Edit Modal */}
        {editingList && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">Edit Lead List</h3>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase">List Name</label>
                <Input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase">Description</label>
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-xs resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" onClick={() => setEditingList(null)}>Cancel</Button>
                <Button variant="primary" onClick={handleUpdateList} disabled={!editName.trim()} className="bg-brand-600 text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
