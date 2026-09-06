'use client';

import React, { useState } from 'react';

export default function RTODashboardPage() {
  const [rtos] = useState([
    {
      id: 'rto_1',
      rtoNumber: 'RTO-2026-000001',
      shipmentNumber: 'SHP-2026-000019',
      orderNumber: 'ORD-2026-000115',
      reason: 'CUSTOMER_UNAVAILABLE_3_ATTEMPTS',
      status: 'IN_TRANSIT',
      rtoCostMinor: 25000,
      initiatedAt: '2026-09-04'
    }
  ]);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAF8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Return-to-Origin (RTO) Tracking</h1>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Monitor failed delivery returns, reverse transit, and warehouse receiving.</p>
      </header>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
              <th style={{ padding: '0.75rem' }}>RTO #</th>
              <th style={{ padding: '0.75rem' }}>Shipment #</th>
              <th style={{ padding: '0.75rem' }}>Order</th>
              <th style={{ padding: '0.75rem' }}>Reason</th>
              <th style={{ padding: '0.75rem' }}>RTO Cost</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rtos.map(rto => (
              <tr key={rto.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: '#DC2626' }}>{rto.rtoNumber}</td>
                <td style={{ padding: '0.75rem' }}>{rto.shipmentNumber}</td>
                <td style={{ padding: '0.75rem' }}>{rto.orderNumber}</td>
                <td style={{ padding: '0.75rem' }}>{rto.reason}</td>
                <td style={{ padding: '0.75rem' }}>PKR {(rto.rtoCostMinor / 100).toLocaleString()}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {rto.status}
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
