'use client';

import React, { useState } from 'react';

export default function MessageTemplatesPage() {
  const [templates] = useState([
    {
      id: 'tmpl_101',
      name: 'order_shipped_v1',
      category: 'UTILITY',
      channel: 'WHATSAPP',
      language: 'en',
      status: 'APPROVED',
      content: 'Hi {{1}}, your order {{2}} has shipped! Track here: {{3}}',
    },
    {
      id: 'tmpl_102',
      name: 'abandoned_cart_discount',
      category: 'MARKETING',
      channel: 'WHATSAPP',
      language: 'en',
      status: 'APPROVED',
      content: 'Hi {{1}}, you left items in your cart. Use code {{2}} for 10% off!',
    },
  ]);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAF8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Message & Notification Templates</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Pre-approved message templates for WhatsApp Cloud API, Email, and SMS notifications.
          </p>
        </div>
        <button style={{ backgroundColor: '#2563EB', color: '#FFFFFF', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          + New Template
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {templates.map((t) => (
          <div key={t.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>{t.name}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#15803D' }}>
                {t.status}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.75rem' }}>
              Channel: <strong>{t.channel}</strong> | Category: <strong>{t.category}</strong> | Lang: <strong>{t.language}</strong>
            </div>
            <div style={{ backgroundColor: '#F9FAFB', border: '1px dashed #D1D5DB', borderRadius: '8px', padding: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
              {t.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
