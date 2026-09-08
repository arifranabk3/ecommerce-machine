'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function VendorDocumentsPage({ params }: { params: { id: string } }) {
  const [loading] = useState(false);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Mock data representing VendorDocuments
  const mockDocuments = [
    {
      id: 'DOC-1029',
      title: 'Supplier Master Agreement 2024',
      fileType: 'application/pdf',
      fileSize: 2450000, // 2.45 MB
      uploadedBy: 'Admin User',
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 'DOC-1030',
      title: 'Tax Registration Certificate',
      fileType: 'image/png',
      fileSize: 850000, // 850 KB
      uploadedBy: 'Vendor Portal',
      createdAt: '2024-01-16T14:20:00Z',
    }
  ];

  const handleMockUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert('Mock Document Uploaded Successfully');
    }, 1500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        
        {/* Vendor Context Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/vendors" className="hover:text-gray-900 transition">Vendors</Link>
            <span>/</span>
            <Link href={`/vendors/${params.id}`} className="hover:text-gray-900 transition font-mono text-xs">{params.id}</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Documents</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                Vendor Documents
                <Badge variant="success">Active Vendor</Badge>
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage contracts, tax forms, and compliance documents.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="primary" 
                className="bg-[#A9C2B9] hover:bg-[#97b2a8]"
                onClick={handleMockUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : '+ Upload Document'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <Link href={`/vendors/${params.id}/ledger`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Overview & Ledger
            </Link>
            <Link href={`/vendors/${params.id}/products`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Products
            </Link>
            <Link href={`/vendors/${params.id}/settlements`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Settlements
            </Link>
            <Link href={`/vendors/${params.id}/payments`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Payments
            </Link>
            <Link href={`/vendors/${params.id}/returns`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Returns
            </Link>
            <Link href={`/vendors/${params.id}/documents`} className="whitespace-nowrap pb-4 px-1 border-b-2 border-[#A9C2B9] font-medium text-sm text-[#A9C2B9]">
              Documents ({mockDocuments.length})
            </Link>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search documents by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading documents...</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Format & Size</th>
                  <th className="px-6 py-4">Uploaded By</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No documents found for this vendor.
                    </td>
                  </tr>
                ) : (
                  mockDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{doc.title}</p>
                        <p className="font-mono text-xs text-gray-400 mt-0.5">{doc.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{doc.fileType.split('/')[1]?.toUpperCase() || 'Unknown'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{formatFileSize(doc.fileSize)}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {doc.uploadedBy}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button className="text-gray-500 hover:text-gray-900 font-medium text-sm transition">
                          View
                        </button>
                        <button className="text-[#A9C2B9] hover:underline font-medium text-sm transition">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Placeholder */}
        {!loading && mockDocuments.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div>Showing 1 to {mockDocuments.length} of {mockDocuments.length} entries</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
