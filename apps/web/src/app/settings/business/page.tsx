'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Building, Globe, DollarSign, Clock } from 'lucide-react';
import { useApiQuery, useApiMutation } from '@/lib/api-client';

export default function BusinessSettingsPage() {
  const [businessName, setBusinessName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [currency, setCurrency] = useState('PKR');
  const [country, setCountry] = useState('PK');
  const [locale, setLocale] = useState('en-PK');
  const [message, setMessage] = useState('');

  const { data: tenantData, isLoading: isFetching } = useApiQuery<any>('/api/v1/tenant');
  const { trigger: updateSettings, isMutating: isUpdating } = useApiMutation<any, any>('/api/v1/tenant/settings');

  useEffect(() => {
    if (tenantData?.data) {
      setBusinessName(tenantData.data.businessName || '');
      setLegalName(tenantData.data.legalName || '');
      setTimezone(tenantData.data.timezone || 'UTC');
      setCurrency(tenantData.data.currency || 'PKR');
      setCountry(tenantData.data.country || 'PK');
      setLocale(tenantData.data.locale || 'en-PK');
    }
  }, [tenantData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await updateSettings({ method: 'PATCH', body: { businessName, legalName, timezone, currency, country, locale } });
      if (res.data) {
        setMessage('Business & Localization settings updated successfully!');
      } else {
        setMessage(res.error?.message || 'Update failed');
      }
    } catch (e: any) {
      setMessage(e.message || 'Update failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-900">Store & Business Profile</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Configure business identity, regional timezone, and currency standards</p>
        </div>

        {message && (
          <div className={`p-4 border rounded-xl text-sm font-bold ${message.includes('success') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {message}
          </div>
        )}

        <Card title="General Business Information" className="shadow-sm border-slate-200">
          <form onSubmit={handleSave} className="space-y-5 p-2">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" /> Business Operating Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow bg-slate-50 hover:bg-white"
                  disabled={isFetching}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" /> Legal Registered Name
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="Legal Entity Ltd."
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow bg-slate-50 hover:bg-white"
                  disabled={isFetching}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Operating Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow bg-slate-50 hover:bg-white cursor-pointer"
                  disabled={isFetching}
                >
                  <option value="UTC">UTC (Universal)</option>
                  <option value="Asia/Karachi">Asia/Karachi (PKT +05:00)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Store Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow bg-slate-50 hover:bg-white cursor-pointer"
                  disabled={isFetching}
                >
                  <option value="PKR">PKR (Pakistani Rupee)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" /> Country / Locale
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow bg-slate-50 hover:bg-white"
                  disabled={isFetching}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6 flex justify-end">
              <Button type="submit" variant="primary" isLoading={isUpdating} disabled={isFetching} className="px-6 shadow-sm">
                Save Business Settings
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
