'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NewVendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // MOCK SUBMIT HANDLER - No real API connection yet
    setTimeout(() => {
      setLoading(false);
      // Simulate success and redirect
      router.push('/vendors');
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Vendor</h1>
            <p className="text-sm text-gray-500 mt-1">Create a new vendor or supplier profile.</p>
          </div>
          <Link href="/vendors" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Cancel
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card title="Company Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Company / Business Name"
                name="companyName"
                placeholder="e.g. Apex Electronics"
                required
              />
              <Input
                label="Vendor Code"
                name="vendorCode"
                placeholder="e.g. VEN-001002"
                required
              />
              <div className="md:col-span-2">
                <Input
                  label="Business Registration Number (Optional)"
                  name="registrationNumber"
                  placeholder="Tax ID or Registration No"
                />
              </div>
            </div>
          </Card>

          <Card title="Primary Contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Contact Person"
                name="contactPerson"
                placeholder="Full Name"
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="contact@company.com"
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                required
              />
            </div>
          </Card>

          <Card title="Address Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Street Address"
                  name="address"
                  placeholder="123 Business Park"
                  required
                />
              </div>
              <Input
                label="City"
                name="city"
                placeholder="City Name"
                required
              />
              <Input
                label="State / Province"
                name="state"
                placeholder="State Name"
                required
              />
              <Input
                label="Country"
                name="country"
                placeholder="Country Name"
                required
              />
              <Input
                label="Postal Code"
                name="postalCode"
                placeholder="ZIP / Postal"
                required
              />
            </div>
          </Card>

          <Card title="Preferences & Notes">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9] bg-white">
                  <option value="NET_15">Net 15</option>
                  <option value="NET_30">Net 30</option>
                  <option value="NET_60">Net 60</option>
                  <option value="COD">Cash on Delivery</option>
                  <option value="PREPAID">Prepaid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea
                  name="notes"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9] resize-none"
                  placeholder="Add any internal notes about this vendor..."
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/vendors')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="bg-[#A9C2B9] hover:bg-[#97b2a8]"
            >
              {loading ? 'Creating Vendor...' : 'Create Vendor'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
