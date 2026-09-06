'use client';

import React from 'react';
import Link from 'next/link';

export default function ExceptionsInboxPage() {
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Automation Exception Inbox</h1>
        <p style={{ color: '#666', margin: '4px 0 0 0' }}>Review system escalations, failed automation steps, and policy exception items.</p>
      </header>

      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px' }}>Severity</th>
              <th style={{ padding: '12px' }}>Category</th>
              <th style={{ padding: '12px' }}>Title</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}><span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>HIGH</span></td>
              <td style={{ padding: '12px' }}>INVENTORY_STOCKOUT</td>
              <td style={{ padding: '12px' }}>Supplier Unavailable for SKU-100</td>
              <td style={{ padding: '12px' }}><span style={{ color: '#d97706', fontWeight: '600' }}>OPEN</span></td>
              <td style={{ padding: '12px' }}>
                <Link href="/exceptions/exc_901" style={{ color: '#2563eb', fontWeight: '600' }}>Review & Resolve →</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
