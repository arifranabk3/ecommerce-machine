'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown,
  Truck,
  CheckCircle2,
  Package,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Tag,
  CreditCard,
  FileText,
  UserCircle
} from 'lucide-react';
import Link from 'next/link';
import { useApiQuery } from '@/lib/api-client';

export default function VendorsPage() {
  const { data: vendorsData, isLoading } = useApiQuery<any>('/api/v1/vendors');
  const vendors = vendorsData?.data || [];
  
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const activeVendorsCount = vendors.filter((v: any) => v.status === 'ACTIVE').length;

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vendors</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage your suppliers, payouts, and performance metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Vendor
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Total Vendors</p>
              <div className="text-2xl font-extrabold text-slate-900 leading-tight">{vendors.length}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Active Vendors</p>
              <div className="text-2xl font-extrabold text-slate-900 leading-tight">{activeVendorsCount}</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hidden lg:flex">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-0.5">Global Procurement</p>
              <div className="text-2xl font-extrabold text-slate-900 leading-tight">Enabled</div>
            </div>
          </div>
        </div>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
          
          {/* Left Column - Table */}
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-2 items-center">
              <div className="relative w-full md:flex-1 md:max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                  All Status <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white border-b border-slate-200 text-xs font-bold text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Vendor</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3 text-center">Catalog Items</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-slate-500 font-medium">Loading vendors...</td>
                      </tr>
                    ) : vendors.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-slate-500 font-medium">No vendors found.</td>
                      </tr>
                    ) : (
                      vendors.map((v: any) => (
                        <tr 
                          key={v._id} 
                          onClick={() => setSelectedVendor(v)}
                          className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${selectedVendor?._id === v._id ? 'bg-slate-50/50 ring-1 ring-brand-500/20 inset-0 relative z-10' : ''}`}
                        >
                          <td className="px-4 py-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 bg-blue-600 uppercase">
                              {(v.name || 'V').substring(0, 2)}
                            </div>
                            <div className="font-bold text-slate-900">{v.name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-700">{v.contactInfo?.email || 'No email'}</div>
                            <div className="text-[11px] font-semibold text-slate-400">{v.contactInfo?.phone || 'No phone'}</div>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900 text-center">{v.products?.length || 0}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${v.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : v.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-700' : 'bg-orange-100 text-orange-700'}`}>
                              {v.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Vendor Panel */}
          {selectedVendor ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-6 animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm uppercase">
                    {(selectedVendor.name || 'V').substring(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{selectedVendor.name}</h2>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 inline-block ${selectedVendor.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {selectedVendor.status}
                    </span>
                  </div>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Info Details */}
              <div className="mt-6 space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" /> {selectedVendor.contactInfo?.phone || 'No phone number'}
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400" /> {selectedVendor.contactInfo?.email || 'No email address'}
                </div>
                <div className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> 
                  <span>
                    {selectedVendor.address?.addressLine1 || 'No address provided'}
                    {selectedVendor.address?.city && <><br/>{selectedVendor.address.city}</>}
                    {selectedVendor.address?.country && <>, {selectedVendor.address.country}</>}
                  </span>
                </div>
                {selectedVendor.website && (
                  <div className="flex items-center gap-3 text-sm font-semibold text-brand-600 hover:underline cursor-pointer">
                    <LinkIcon className="w-4 h-4 text-slate-400" /> {selectedVendor.website}
                  </div>
                )}
              </div>

              {/* Tags section */}
              {selectedVendor.paymentTerms && (
                <div className="mt-5 flex items-center gap-3">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold uppercase">
                      Terms: {selectedVendor.paymentTerms}
                    </span>
                  </div>
                </div>
              )}

              {/* Stats Block */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                  <div className="text-xl font-extrabold text-slate-900">{selectedVendor.products?.length || 0}</div>
                  <div className="text-[11px] font-bold text-slate-500 mt-1">Catalog Items</div>
                </div>
                <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl text-center">
                  <div className="text-xl font-extrabold text-brand-700">{selectedVendor.leadTimeDays || 0}</div>
                  <div className="text-[11px] font-bold text-brand-600/80 mt-1">Avg Lead Time (Days)</div>
                </div>
              </div>

              {/* Panel Actions */}
              <div className="mt-6 space-y-2 pt-6 border-t border-slate-100">
                <button className="w-full py-2.5 bg-brand-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-700 transition-colors flex justify-center items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Make Payment
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/vendors/${selectedVendor._id}/ledger`} className="py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" /> View Ledger
                  </Link>
                  <button className="py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                    <UserCircle className="w-4 h-4 text-slate-400" /> Edit Profile
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 flex flex-col items-center justify-center text-center sticky top-6">
              <Truck className="w-12 h-12 text-slate-200 mb-4" />
              <h3 className="font-bold text-slate-900 text-lg">Select a Vendor</h3>
              <p className="text-slate-500 font-medium text-sm mt-1">Click on any vendor in the table to view their complete profile and management options.</p>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
