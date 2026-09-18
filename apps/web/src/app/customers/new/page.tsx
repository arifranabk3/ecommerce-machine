'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/lib/api-client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';

export default function NewCustomerPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const { trigger: createCustomer, isMutating, error } = useApiMutation<any, any>('/api/v1/customers');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;

    try {
      const res = await createCustomer({
        method: 'POST',
        body: {
          firstName,
          lastName,
          email: email || undefined,
          phone: phone || undefined,
          companyName: companyName || undefined,
          source: 'MANUAL',
        }
      });
      
      if (res && res._id) {
        router.push(`/customers/${res._id}`);
      } else {
        router.push('/customers');
      }
    } catch (err) {
      console.error('Failed to create customer', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-6 pb-12 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link href="/customers" className="text-xs text-content-muted hover:text-content-primary">
              ← Back to Customers
            </Link>
            <h1 className="text-2xl font-bold text-content-primary mt-2">Add New Customer</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-xl border border-border shadow-sm space-y-4">
            
            {error && (
              <div className="p-3 bg-danger-50 border border-danger-border text-danger-text text-sm rounded-lg">
                {error.message || 'Failed to create customer'}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-content-secondary mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Eleanor"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-content-secondary mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Vance"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-content-secondary mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="eleanor@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-content-secondary mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="+1 555-0192"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-content-secondary mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Acme Corp"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
              <Link href="/customers">
                <Button variant="outline" type="button" className="bg-surface">
                  Cancel
                </Button>
              </Link>
              <Button variant="primary" type="submit" disabled={isMutating}>
                {isMutating ? 'Saving...' : 'Save Customer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
