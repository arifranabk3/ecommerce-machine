'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { useApiQuery, useApiMutation } from '@/lib/api-client';

export default function UserManagementPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Staff');
  const [inviteError, setInviteError] = useState('');

  // Fetch real memberships
  const { data: membershipsData, mutate: refreshMemberships, isLoading } = useApiQuery<any>('/api/v1/tenant/memberships');
  const memberships = membershipsData?.data || [];

  // Mutations
  const { trigger: inviteMember, isMutating: isInviting } = useApiMutation<any, any>('/api/v1/tenant/invitations');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const filteredUsers = memberships.filter((m: any) => {
    const user = m.user || {};
    const name = user.name || '';
    const email = user.email || '';
    
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesRole = roleFilter === 'ALL' || m.roles?.includes(roleFilter);
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleStatusChange = async (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'REMOVED') => {
    const token = localStorage.getItem('sellzy_token');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    if (newStatus === 'REMOVED') {
      setIsRemoving(true);
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/users/${userId}/remove`, { method: 'POST', headers });
        refreshMemberships();
        setSelectedUser(null);
      } catch (e) {} finally { setIsRemoving(false); }
    } else {
      setIsUpdatingStatus(true);
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/users/${userId}/status`, { method: 'POST', headers, body: JSON.stringify({ status: newStatus }) });
        refreshMemberships();
        if (selectedUser && selectedUser.user._id === userId) {
          setSelectedUser({ ...selectedUser, status: newStatus });
        }
      } catch (e) {} finally { setIsUpdatingStatus(false); }
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    if (!inviteEmail) return;
    
    try {
      const res = await inviteMember({ method: 'POST', body: { email: inviteEmail, roles: [inviteRole] } });
      if (res.data) {
        setInviteEmail('');
        setShowInviteModal(false);
        refreshMemberships();
      } else {
        setInviteError(res.error?.message || 'Failed to send invite');
      }
    } catch (e: any) {
      setInviteError(e.message || 'Failed to send invite');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
        
        {/* Header */}
        <PageHeader 
          title="User & Team Management" 
          subtitle="Manage team member access, role assignments, and tenant status."
          actions={[
            { label: 'Invite Team Member', variant: 'primary', onClick: () => setShowInviteModal(true) }
          ]}
        />

        {/* Filters & Search Bar */}
        <Card className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 shadow-sm border-slate-200">
          <div className="w-full md:w-80">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INVITED">Invited</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Roles</option>
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="!p-0 overflow-hidden shadow-sm border-slate-200">
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th className="pl-6">User</Th>
                  <Th>Assigned Roles</Th>
                  <Th>Status</Th>
                  <Th>Joined Date</Th>
                  <Th className="text-right pr-6">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={5} className="text-center py-10 text-slate-500">Loading members...</Td>
                  </Tr>
                ) : filteredUsers.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} className="text-center py-10 text-slate-500">No team members found.</Td>
                  </Tr>
                ) : (
                  filteredUsers.map((m: any) => {
                    const user = m.user || {};
                    return (
                      <Tr key={m._id} className="hover:bg-slate-50/50 transition-colors">
                        <Td className="pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-sm border border-slate-200 shadow-sm uppercase">
                              {(user.name || '?').charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                {user.name || 'Pending User'}
                                {m.roles?.includes('Owner') && (
                                  <Badge variant="warning" className="!text-[10px] !px-1.5 !py-0.5">OWNER</Badge>
                                )}
                              </div>
                              <div className="text-xs font-medium text-slate-500">{user.email}</div>
                            </div>
                          </div>
                        </Td>
                        <Td>
                          <div className="flex flex-wrap gap-1.5">
                            {(m.roles || []).map((r: string) => (
                              <Badge key={r} variant="info" className="bg-blue-50 text-blue-700 border-blue-200">{r}</Badge>
                            ))}
                          </div>
                        </Td>
                        <Td>
                          <Badge variant={
                            m.status === 'ACTIVE' ? 'success' :
                            m.status === 'INVITED' ? 'info' :
                            'error'
                          }>
                            {m.status}
                          </Badge>
                        </Td>
                        <Td className="text-xs font-medium text-slate-500">
                          {new Date(m.joinedAt || m.createdAt).toLocaleDateString()}
                        </Td>
                        <Td className="text-right pr-6">
                          <Button
                            variant="secondary"
                            onClick={() => setSelectedUser(m)}
                            className="text-xs py-1.5 px-3 bg-white hover:bg-slate-50 shadow-sm"
                          >
                            Manage
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })
                )}
              </Tbody>
            </Table>
          </div>
        </Card>

        {/* User Detail Drawer Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-end z-50 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto border-l border-slate-200 space-y-6 animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-extrabold text-slate-900">Member Access & Security</h3>
                <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-900 transition-colors">✕</button>
              </div>

              <div>
                <h4 className="font-extrabold text-lg text-slate-900 mb-1">{selectedUser.user?.name || 'Pending User'}</h4>
                <p className="text-sm font-medium text-slate-500">{selectedUser.user?.email}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Status:</span>
                  <Badge variant={selectedUser.status === 'ACTIVE' ? 'success' : 'warning'}>{selectedUser.status}</Badge>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Assigned Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedUser.roles || []).map((r: string) => (
                    <span key={r} className="bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1 rounded-xl border border-slate-200">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {!selectedUser.roles?.includes('Owner') && (
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Administrative Actions</h4>
                  
                  {selectedUser.status === 'ACTIVE' ? (
                    <button
                      onClick={() => handleStatusChange(selectedUser.user._id, 'SUSPENDED')}
                      disabled={isUpdatingStatus}
                      className="w-full text-left text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-4 py-3 rounded-xl border border-red-200 transition-all disabled:opacity-50"
                    >
                      {isUpdatingStatus ? 'Suspending...' : 'Suspend Access'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(selectedUser.user._id, 'ACTIVE')}
                      disabled={isUpdatingStatus}
                      className="w-full text-left text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-3 rounded-xl border border-emerald-200 transition-all disabled:opacity-50"
                    >
                      {isUpdatingStatus ? 'Reactivating...' : 'Reactivate Tenant Access'}
                    </button>
                  )}

                  <button
                    onClick={() => handleStatusChange(selectedUser.user._id, 'REMOVED')}
                    disabled={isRemoving}
                    className="w-full text-left text-xs font-bold text-red-900 bg-red-100 hover:bg-red-200 px-4 py-3 rounded-xl border border-red-300 transition-all disabled:opacity-50"
                  >
                    {isRemoving ? 'Removing...' : 'Remove from Tenant'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-extrabold text-slate-900">Invite New Team Member</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors">✕</button>
              </div>

              {inviteError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-200">
                  {inviteError}
                </div>
              )}

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <Input
                    type="email"
                    required
                    placeholder="colleague@business.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    className="font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Assign Role</label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 hover:bg-white transition-colors"
                  >
                    <option value="Admin">Admin (Operational Authority)</option>
                    <option value="Manager">Manager (Team Operations)</option>
                    <option value="Staff">Staff (Standard Staff Access)</option>
                    <option value="Viewer">Viewer (Read-Only Access)</option>
                  </select>
                </div>

                <div className="bg-brand-50 p-3 rounded-xl border border-brand-100 text-xs font-medium text-brand-700">
                  Role ceiling check will verify server-side that you possess all permissions included in this role before sending the invitation.
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowInviteModal(false)}
                    className="bg-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isInviting}
                  >
                    Send Invitation
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
