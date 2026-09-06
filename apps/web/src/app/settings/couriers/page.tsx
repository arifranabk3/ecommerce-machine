'use client';

import React, { useState } from 'react';

export default function CouriersSettingsPage() {
  const [couriers] = useState([
    {
      id: 'cour_1',
      courierCode: 'TCS',
      name: 'TCS Logistics',
      type: 'API',
      status: 'ACTIVE',
      webhookUrl: 'https://api.sellzy.io/api/v1/shipping/webhooks/tcs'
    },
    {
      id: 'cour_2',
      courierCode: 'LEOPARDS',
      name: 'Leopards Courier',
      type: 'API',
      status: 'ACTIVE',
      webhookUrl: 'https://api.sellzy.io/api/v1/shipping/webhooks/leopards'
    }
  ]);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAF8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Courier Integrations</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Configure active courier APIs, webhook endpoints, and dispatch rules.</p>
        </div>
        <button style={{ backgroundColor: '#A9C2B9', color: '#111827', fontWeight: 600, border: 'none', padding: '0.625rem 1.25rem', borderRadius: '8px', cursor: 'pointer' }}>
          + Add Courier
        </button>
      </header>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
              <th style={{ padding: '0.75rem' }}>Code</th>
              <th style={{ padding: '0.75rem' }}>Courier Name</th>
              <th style={{ padding: '0.75rem' }}>Type</th>
              <th style={{ padding: '0.75rem' }}>Webhook Endpoint</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {couriers.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>{c.courierCode}</td>
                <td style={{ padding: '0.75rem' }}>{c.name}</td>
                <td style={{ padding: '0.75rem' }}>{c.type}</td>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: '#4B5563' }}>{c.webhookUrl}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {c.status}
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
