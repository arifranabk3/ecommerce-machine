'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';

interface UserMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED' | 'REMOVED';
  isOwner: boolean;
  joinedAt: string;
  lastLoginAt?: string;
}

export default function UserManagementPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<UserMember | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Staff');

  // Mock data representing server DTO
  const [users, setUsers] = useState<UserMember[]>([
    {
      id: 'u_101',
      name: 'Arif Rana',
      email: 'owner@sellzy.io',
      phone: '+92 300 1234567',
      roles: ['Owner'],
      status: 'ACTIVE',
      isOwner: true,
      joinedAt: '2026-01-15T10:00:00Z',
      lastLoginAt: '2026-09-05T11:30:00Z'
    },
    {
      id: 'u_102',
      name: 'Sarah Connor',
      email: 'sarah@sellzy.io',
      phone: '+1 555 0192',
      roles: ['Admin'],
      status: 'ACTIVE',
      isOwner: false,
      joinedAt: '2026-02-01T14:20:00Z',
      lastLoginAt: '2026-09-04T18:45:00Z'
    },
    {
      id: 'u_103',
      name: 'Michael Scott',
      email: 'michael@dunder.com',
      roles: ['Manager'],
      status: 'SUSPENDED',
      isOwner: false,
      joinedAt: '2026-03-10T09:15:00Z',
      lastLoginAt: '2026-08-20T12:00:00Z'
    },
    {
      id: 'u_104',
      name: 'Jim Halpert',
      email: 'jim@dunder.com',
      roles: ['Staff'],
      status: 'INVITED',
      isOwner: false,
      joinedAt: '2026-09-01T08:00:00Z'
    }
  ]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesRole = roleFilter === 'ALL' || u.roles.includes(roleFilter);
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleStatusChange = (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'REMOVED') => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId && !u.isOwner) {
        return { ...u, status: newStatus };
      }
      return u;
    }));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newUser: UserMember = {
      id: `u_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      roles: [inviteRole],
      status: 'INVITED',
      isOwner: false,
      joinedAt: new Date().toISOString()
    };
    setUsers(prev => [newUser, ...prev]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <PageHeader 
          title="User & Team Management" 
          subtitle="Manage team member access, role assignments, active sessions, and tenant status."
          actions={[
            { label: 'Invite Team Member', variant: 'primary', onClick: () => setShowInviteModal(true) }
          ]}
        />

        {/* Filters & Search Bar */}
        <Card className="flex flex-col md:flex-row gap-4 justify-between items-center p-4">
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
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INVITED">Invited</option>
              <option value="SUSPENDED">Suspended</option>
            </select>

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-sm text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
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
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>User</Th>
                  <Th>Assigned Roles</Th>
                  <Th>Status</Th>
                  <Th>Joined Date</Th>
                  <Th className="text-right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map(user => (
                  <Tr key={user.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-900 font-bold flex items-center justify-center text-sm border border-white shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            {user.name}
                            {user.isOwner && (
                              <Badge variant="warning" className="!text-[10px] !px-1.5 !py-0.5">OWNER</Badge>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles.map(r => (
                          <Badge key={r} variant="info">{r}</Badge>
                        ))}
                      </div>
                    </Td>
                    <Td>
                      <Badge variant={
                        user.status === 'ACTIVE' ? 'success' :
                        user.status === 'INVITED' ? 'info' :
                        'error'
                      }>
                        {user.status}
                      </Badge>
                    </Td>
                    <Td className="text-xs text-slate-500">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </Td>
                    <Td className="text-right">
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedUser(user)}
                        className="text-xs py-1.5 px-3"
                      >
                        Manage
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </Card>

        {/* User Detail Drawer Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex justify-end z-50">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto border-l border-[#E2E8F0] space-y-6">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
                <h3 className="text-lg font-bold text-[#0F172A]">Member Access & Security</h3>
                <button onClick={() => setSelectedUser(null)} className="text-[#94A3B8] hover:text-[#0F172A]">✕</button>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-[#0F172A] mb-1">{selectedUser.name}</h4>
                <p className="text-xs text-[#64748B]">{selectedUser.email}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#64748B]">Status:</span>
                  <span className="bg-[#DCFCE7] text-[#166534] text-xs font-medium px-2 py-0.5 rounded-full">
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#F1F5F9] pt-4">
                <h4 className="text-xs font-bold uppercase text-[#64748B] tracking-wider mb-3">Assigned Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.roles.map(r => (
                    <span key={r} className="bg-[#A9C2B9]/20 text-[#0F172A] font-semibold text-xs px-3 py-1 rounded-xl border border-[#A9C2B9]/40">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              {!selectedUser.isOwner && (
                <div className="border-t border-[#F1F5F9] pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-[#64748B] tracking-wider">Administrative Actions</h4>
                  
                  {selectedUser.status === 'ACTIVE' ? (
                    <button
                      onClick={() => handleStatusChange(selectedUser.id, 'SUSPENDED')}
                      className="w-full text-left text-xs font-semibold text-[#B91C1C] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-4 py-2.5 rounded-xl border border-[#FCA5A5] transition-all"
                    >
                      Suspend Access (Revoke Active Sessions)
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(selectedUser.id, 'ACTIVE')}
                      className="w-full text-left text-xs font-semibold text-[#15803D] bg-[#F0FDF4] hover:bg-[#DCFCE7] px-4 py-2.5 rounded-xl border border-[#86EFAC] transition-all"
                    >
                      Reactivate Tenant Access
                    </button>
                  )}

                  <button
                    onClick={() => handleStatusChange(selectedUser.id, 'REMOVED')}
                    className="w-full text-left text-xs font-semibold text-[#7F1D1D] bg-[#FFF1F2] hover:bg-[#FFE4E6] px-4 py-2.5 rounded-xl border border-[#FECDD3] transition-all"
                  >
                    Remove from Tenant
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
                <h3 className="text-lg font-bold text-slate-900">Invite New Team Member</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-900">✕</button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <Input
                    type="email"
                    required
                    placeholder="colleague@business.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Role</label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Admin">Admin (Operational Authority)</option>
                    <option value="Manager">Manager (Team Operations)</option>
                    <option value="Staff">Staff (Standard Staff Access)</option>
                    <option value="Viewer">Viewer (Read-Only Access)</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-500">
                  Role ceiling check will verify server-side that you possess all permissions included in this role before sending the invitation.
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowInviteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
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
