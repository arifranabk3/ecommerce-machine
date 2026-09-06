'use client';

import React, { useState } from 'react';

interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  systemRole: boolean;
  userCount: number;
}

export default function RoleManagementPage() {
  const [showRoleBuilder, setShowRoleBuilder] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'products.view',
    'orders.view',
    'customers.view'
  ]);

  const [roles, setRoles] = useState<RoleItem[]>([
    {
      id: 'r_1',
      name: 'Owner',
      description: 'Tenant business owner full authority',
      permissions: ['*'],
      systemRole: true,
      userCount: 1
    },
    {
      id: 'r_2',
      name: 'Admin',
      description: 'Broad operational access excluding ownership transfer',
      permissions: [
        'users.view', 'users.invite', 'users.update', 'users.suspend',
        'roles.view', 'roles.create', 'roles.update',
        'products.view', 'products.create', 'products.update',
        'orders.view', 'orders.create', 'orders.update'
      ],
      systemRole: true,
      userCount: 2
    },
    {
      id: 'r_3',
      name: 'Manager',
      description: 'Day-to-day store operations and staff oversight',
      permissions: [
        'users.view',
        'products.view', 'products.create', 'products.update',
        'orders.view', 'orders.create', 'orders.update'
      ],
      systemRole: false,
      userCount: 4
    },
    {
      id: 'r_4',
      name: 'Staff',
      description: 'Standard staff level permissions for order processing',
      permissions: ['products.view', 'orders.view', 'orders.update'],
      systemRole: true,
      userCount: 8
    }
  ]);

  const permissionGroups = [
    {
      group: 'Users & Team',
      items: [
        { key: 'users.view', label: 'View Users' },
        { key: 'users.invite', label: 'Invite Users' },
        { key: 'users.update', label: 'Update Users' },
        { key: 'users.suspend', label: 'Suspend Users', highRisk: true }
      ]
    },
    {
      group: 'Roles & Access Control',
      items: [
        { key: 'roles.view', label: 'View Roles' },
        { key: 'roles.create', label: 'Create Roles', highRisk: true },
        { key: 'roles.update', label: 'Edit Roles', highRisk: true },
        { key: 'roles.assign', label: 'Assign Roles', highRisk: true }
      ]
    },
    {
      group: 'Products & Orders',
      items: [
        { key: 'products.view', label: 'View Catalog' },
        { key: 'products.create', label: 'Create Products' },
        { key: 'products.update', label: 'Edit Products' },
        { key: 'orders.view', label: 'View Orders' },
        { key: 'orders.update', label: 'Fulfill Orders' }
      ]
    },
    {
      group: 'Payments & Security',
      items: [
        { key: 'payments.view', label: 'View Payments' },
        { key: 'payments.approve', label: 'Approve Refunds', highRisk: true },
        { key: 'security.manage', label: 'Manage Security', highRisk: true }
      ]
    }
  ];

  const togglePermission = (key: string) => {
    setSelectedPermissions(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) return;

    const newRole: RoleItem = {
      id: `r_${Date.now()}`,
      name: roleName,
      description: roleDescription,
      permissions: selectedPermissions,
      systemRole: false,
      userCount: 0
    };

    setRoles(prev => [...prev, newRole]);
    setRoleName('');
    setRoleDescription('');
    setShowRoleBuilder(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0F172A]">Roles & Custom Permissions</h1>
              <span className="bg-[#E6F0EB] text-[#2C5E4E] text-xs font-semibold px-2.5 py-0.5 rounded-full">Permission Matrix Engine</span>
            </div>
            <p className="text-sm text-[#64748B] mt-1">Configure granular system and custom tenant roles with permission ceiling guards.</p>
          </div>
          <button
            onClick={() => setShowRoleBuilder(true)}
            className="bg-[#A9C2B9] hover:bg-[#96B3A9] text-[#0F172A] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            Create Custom Role
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <div key={role.id} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    role.systemRole ? 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]' : 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]'
                  }`}>
                    {role.systemRole ? 'System Role' : 'Custom Role'}
                  </span>
                  <span className="text-xs text-[#64748B] font-medium">{role.userCount} active users</span>
                </div>

                <h3 className="text-lg font-bold text-[#0F172A] mt-3">{role.name}</h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{role.description}</p>

                <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                  <div className="text-xs font-semibold text-[#475569] mb-2 flex items-center justify-between">
                    <span>Permissions</span>
                    <span className="bg-[#F8FAFC] text-[#0F172A] px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {role.permissions.includes('*') ? 'All Permissions' : `${role.permissions.length} items`}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-hidden">
                    {role.permissions.slice(0, 5).map(p => (
                      <span key={p} className="bg-[#F8FAFC] text-[#334155] text-[11px] px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {p}
                      </span>
                    ))}
                    {role.permissions.length > 5 && (
                      <span className="bg-[#F1F5F9] text-[#64748B] text-[11px] px-2 py-0.5 rounded font-medium">
                        +{role.permissions.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">Immutable System Role</span>
                <button className="text-[#0F172A] font-semibold hover:underline">View Matrix</button>
              </div>
            </div>
          ))}
        </div>

        {/* Role Builder Modal */}
        {showRoleBuilder && (
          <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Custom Role Builder</h3>
                  <p className="text-xs text-[#64748B]">Select permissions within your authorization ceiling.</p>
                </div>
                <button onClick={() => setShowRoleBuilder(false)} className="text-[#94A3B8] hover:text-[#0F172A]">✕</button>
              </div>

              <form onSubmit={handleSaveRole} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">Role Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fulfillment Specialist"
                      value={roleName}
                      onChange={e => setRoleName(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Brief role responsibilities..."
                      value={roleDescription}
                      onChange={e => setRoleDescription(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
                    />
                  </div>
                </div>

                {/* Permission Matrix */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-[#64748B] tracking-wider">Granular Permission Matrix</h4>

                  {permissionGroups.map(group => (
                    <div key={group.group} className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                      <div className="text-xs font-bold text-[#0F172A]">{group.group}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.items.map(item => (
                          <label key={item.key} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-[#E2E8F0] cursor-pointer hover:border-[#A9C2B9] transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(item.key)}
                              onChange={() => togglePermission(item.key)}
                              className="rounded border-[#CBD5E1] text-[#A9C2B9] focus:ring-[#A9C2B9]"
                            />
                            <span className="text-xs font-medium text-[#334155]">{item.label}</span>
                            {item.highRisk && (
                              <span className="bg-[#FEE2E2] text-[#991B1B] text-[9px] font-bold px-1.5 py-0.5 rounded ml-auto">HIGH RISK</span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={() => setShowRoleBuilder(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl text-xs font-semibold bg-[#A9C2B9] hover:bg-[#96B3A9] text-[#0F172A] shadow-sm"
                  >
                    Save Role
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
