'use client';

import React, { useState } from 'react';

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
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0F172A]">User & Team Management</h1>
              <span className="bg-[#E6F0EB] text-[#2C5E4E] text-xs font-semibold px-2.5 py-0.5 rounded-full">RBAC Enforcement Active</span>
            </div>
            <p className="text-sm text-[#64748B] mt-1">Manage team member access, role assignments, active sessions, and tenant status.</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-[#A9C2B9] hover:bg-[#96B3A9] text-[#0F172A] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            Invite Team Member
          </button>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E2E8F0] flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
            />
            <svg className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
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
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#334155]">
              <thead className="bg-[#F8FAFC] text-xs font-semibold uppercase text-[#64748B] border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Assigned Roles</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Joined Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E2E8F0] text-[#0F172A] font-bold flex items-center justify-center text-sm border border-white shadow-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#0F172A] flex items-center gap-2">
                            {user.name}
                            {user.isOwner && (
                              <span className="bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FDE68A]">OWNER</span>
                            )}
                          </div>
                          <div className="text-xs text-[#64748B]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles.map(r => (
                          <span key={r} className="bg-[#F1F5F9] text-[#334155] text-xs font-medium px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.status === 'ACTIVE' ? 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]' :
                        user.status === 'INVITED' ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]' :
                        'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-[#64748B]">
                      {new Date(user.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-xs font-medium text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-3 py-1.5 rounded-lg border border-[#CBD5E1] transition-all"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
          <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E2E8F0] space-y-4">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                <h3 className="text-lg font-bold text-[#0F172A]">Invite New Team Member</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-[#94A3B8] hover:text-[#0F172A]">✕</button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="colleague@business.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Assign Role</label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
                  >
                    <option value="Admin">Admin (Operational Authority)</option>
                    <option value="Manager">Manager (Team Operations)</option>
                    <option value="Staff">Staff (Standard Staff Access)</option>
                    <option value="Viewer">Viewer (Read-Only Access)</option>
                  </select>
                </div>

                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-xs text-[#64748B]">
                  Role ceiling check will verify server-side that you possess all permissions included in this role before sending the invitation.
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#A9C2B9] hover:bg-[#96B3A9] text-[#0F172A] shadow-sm"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
