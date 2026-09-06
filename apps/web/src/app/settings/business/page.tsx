'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Building, Globe, DollarSign, Clock } from 'lucide-react';

export default function BusinessSettingsPage() {
  const [businessName, setBusinessName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [currency, setCurrency] = useState('PKR');
  const [country, setCountry] = useState('PK');
  const [locale, setLocale] = useState('en-PK');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : null;

  useEffect(() => {
    if (token) fetchTenant();
  }, [token]);

  const fetchTenant = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/tenant', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.data) {
        setBusinessName(data.data.businessName || '');
        setLegalName(data.data.legalName || '');
        setTimezone(data.data.timezone || 'UTC');
        setCurrency(data.data.currency || 'PKR');
        setCountry(data.data.country || 'PK');
        setLocale(data.data.locale || 'en-PK');
      }
    } catch (e) {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:4000/api/v1/tenant/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ businessName, legalName, timezone, currency, country, locale })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Business & Localization settings updated successfully!');
      } else {
        setMessage(data.error?.message || 'Update failed');
      }
    } catch (e) {
      setMessage('Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Store & Business Profile</h1>
          <p className="text-sm text-slate-500">Configure business identity, regional timezone, and currency standards</p>
        </div>

        {message && (
          <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl text-sm font-medium text-brand-900">
            {message}
          </div>
        )}

        <Card title="General Business Information">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Operating Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Legal Registered Name</label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="Legal Entity Ltd."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300 bg-white"
                >
                  <option value="UTC">UTC (Universal)</option>
                  <option value="Asia/Karachi">Asia/Karachi (PKT +05:00)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Store Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300 bg-white"
                >
                  <option value="PKR">PKR (Pakistani Rupee)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Country / Locale</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-300"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Save Business Settings
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
