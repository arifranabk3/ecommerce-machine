'use client';

import React, { useState } from 'react';

export default function CampaignsDashboardPage() {
  const [campaigns] = useState([
    {
      id: 'cmp_101',
      name: 'Summer Mega Sale 2026',
      channel: 'WHATSAPP',
      status: 'COMPLETED',
      totalRecipients: 1250,
      sentCount: 1240,
      deliveredCount: 1210,
      readCount: 980,
      failedCount: 10,
      createdAt: '2026-09-01',
    },
    {
      id: 'cmp_102',
      name: 'VIP Customer Retention Promo',
      channel: 'EMAIL',
      status: 'SCHEDULED',
      totalRecipients: 450,
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      failedCount: 0,
      createdAt: '2026-09-04',
    },
  ]);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAF8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Marketing & Broadcast Campaigns</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage promotional broadcasts, audience segmentation, scheduled delivery, and metrics.
          </p>
        </div>
        <button style={{ backgroundColor: '#2563EB', color: '#FFFFFF', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          + Create Campaign
        </button>
      </header>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
              <th style={{ padding: '0.75rem' }}>Campaign Name</th>
              <th style={{ padding: '0.75rem' }}>Channel</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem' }}>Recipients</th>
              <th style={{ padding: '0.75rem' }}>Delivered / Read</th>
              <th style={{ padding: '0.75rem' }}>Failed</th>
              <th style={{ padding: '0.75rem' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#1D4ED8' }}>
                    {c.channel}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: c.status === 'COMPLETED' ? '#ECFDF5' : '#FEF3C7', color: c.status === 'COMPLETED' ? '#047857' : '#B45309' }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>{c.totalRecipients}</td>
                <td style={{ padding: '0.75rem' }}>{c.deliveredCount} / {c.readCount}</td>
                <td style={{ padding: '0.75rem', color: c.failedCount > 0 ? '#DC2626' : '#111827' }}>{c.failedCount}</td>
                <td style={{ padding: '0.75rem', color: '#6B7280' }}>{c.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
