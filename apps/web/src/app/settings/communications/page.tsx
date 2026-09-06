'use client';

import React, { useState } from 'react';

export default function CommunicationSettingsPage() {
  const [config, setConfig] = useState({
    whatsappPhoneNumberId: '10928374918237',
    whatsappWabaId: '29837482910382',
    emailFromAddress: 'notifications@sellzy.store',
    emailFromName: 'Sellzy Store',
    smsSenderId: 'SELLZY',
  });

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAF8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Communication & Provider Configuration</h1>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Configure WhatsApp Business Cloud API, Email gateway, SMS provider, and webhook parameters.
        </p>
      </header>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', maxWidth: '640px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>WhatsApp Business Cloud API</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>Phone Number ID</label>
            <input
              type="text"
              value={config.whatsappPhoneNumberId}
              onChange={(e) => setConfig({ ...config, whatsappPhoneNumberId: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.875rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>WABA (WhatsApp Business Account) ID</label>
            <input
              type="text"
              value={config.whatsappWabaId}
              onChange={(e) => setConfig({ ...config, whatsappWabaId: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>Email & SMS Gateways</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>Sender Email Address</label>
            <input
              type="email"
              value={config.emailFromAddress}
              onChange={(e) => setConfig({ ...config, emailFromAddress: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.875rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>SMS Masking / Sender ID</label>
            <input
              type="text"
              value={config.smsSenderId}
              onChange={(e) => setConfig({ ...config, smsSenderId: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        <button style={{ backgroundColor: '#2563EB', color: '#FFFFFF', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          Save Configuration
        </button>
      </div>
    </div>
  );
}
