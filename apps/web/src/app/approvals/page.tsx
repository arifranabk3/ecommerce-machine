'use client';

import React, { useState } from 'react';

export default function ApprovalsPage() {
  const [filter, setFilter] = useState('PENDING');

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Human Approval Queue</h1>
        <p style={{ color: '#666', margin: '4px 0 0 0' }}>Review and authorize high-risk financial operations and APPROVAL mode workflows.</p>
      </header>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '6px 12px',
              backgroundColor: filter === status ? '#2563eb' : '#f1f5f9',
              color: filter === status ? '#fff' : '#475569',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px' }}>Action Type</th>
              <th style={{ padding: '12px' }}>Resource</th>
              <th style={{ padding: '12px' }}>Requester</th>
              <th style={{ padding: '12px' }}>Risk Level</th>
              <th style={{ padding: '12px' }}>Reason</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}><code>VENDOR_PAYMENT</code></td>
              <td style={{ padding: '12px' }}>Settlement #SETT-902</td>
              <td style={{ padding: '12px' }}>workflow:wf_vendor_pay</td>
              <td style={{ padding: '12px' }}><span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>HIGH</span></td>
              <td style={{ padding: '12px' }}>Vendor payout exceeds threshold $1,000</td>
              <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                <button style={{ padding: '6px 12px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Approve</button>
                <button style={{ padding: '6px 12px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
