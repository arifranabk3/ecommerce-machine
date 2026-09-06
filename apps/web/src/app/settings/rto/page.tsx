'use client';

import React, { useState } from 'react';

export default function RTOPolicySettingsPage() {
  const [policy, setPolicy] = useState({
    maxDeliveryAttempts: 3,
    autoInitiateRTO: true,
    rtoRestockInspectionRequired: true
  });

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAF8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>RTO Policy Settings</h1>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Configure rules for delivery re-attempts, RTO triggers, and warehouse receiving inspection.</p>
      </header>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', maxWidth: '600px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Maximum Delivery Attempts</label>
          <input
            type="number"
            value={policy.maxDeliveryAttempts}
            onChange={e => setPolicy({ ...policy, maxDeliveryAttempts: parseInt(e.target.value, 10) })}
            style={{ width: '100%', padding: '0.625rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={policy.autoInitiateRTO}
            onChange={e => setPolicy({ ...policy, autoInitiateRTO: e.target.checked })}
          />
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>Automatically initiate RTO after max failed attempts</span>
        </div>

        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={policy.rtoRestockInspectionRequired}
            onChange={e => setPolicy({ ...policy, rtoRestockInspectionRequired: e.target.checked })}
          />
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>Require physical inspection before restocking RTO items</span>
        </div>

        <button style={{ backgroundColor: '#A9C2B9', color: '#111827', fontWeight: 600, border: 'none', padding: '0.625rem 1.25rem', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}>
          Save RTO Policy
        </button>
      </div>
    </div>
  );
}
