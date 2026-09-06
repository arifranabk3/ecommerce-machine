'use client';

import React, { useState } from 'react';

export default function ReturnsDashboardPage() {
  const [returns] = useState([
    {
      id: 'ret_1',
      returnNumber: 'RET-2026-000001',
      orderNumber: 'ORD-2026-000088',
      customerName: 'Zainab Bibi',
      reason: 'DEFECTIVE_ITEM',
      status: 'APPROVED_FOR_REFUND',
      requestedAt: '2026-09-03'
    }
  ]);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAF8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Customer Returns Management</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Review return requests, perform item inspection, and process restocking.</p>
        </div>
      </header>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
              <th style={{ padding: '0.75rem' }}>Return #</th>
              <th style={{ padding: '0.75rem' }}>Order</th>
              <th style={{ padding: '0.75rem' }}>Customer</th>
              <th style={{ padding: '0.75rem' }}>Reason</th>
              <th style={{ padding: '0.75rem' }}>Requested Date</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(ret => (
              <tr key={ret.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: '#2563EB' }}>{ret.returnNumber}</td>
                <td style={{ padding: '0.75rem' }}>{ret.orderNumber}</td>
                <td style={{ padding: '0.75rem' }}>{ret.customerName}</td>
                <td style={{ padding: '0.75rem' }}>{ret.reason}</td>
                <td style={{ padding: '0.75rem' }}>{ret.requestedAt}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {ret.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
