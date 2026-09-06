'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function NewCustomerPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 text-gray-800">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/customers" className="text-xs text-gray-500 hover:text-gray-700">
            ← Back to Customers
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Customer</h1>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
                placeholder="Eleanor"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
                placeholder="Vance"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
              placeholder="eleanor@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
              placeholder="+1 555-0192"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A9C2B9]"
              placeholder="Acme Corp"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/customers" className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg">
              Cancel
            </Link>
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#A9C2B9] rounded-lg hover:bg-[#97b2a8]">
              Save Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
