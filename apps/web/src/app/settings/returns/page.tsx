'use client';

import React, { useState } from 'react';

export default function ReturnPolicySettingsPage() {
  const [policy, setPolicy] = useState({
    returnWindowDays: 14,
    allowOpenedReturns: true,
    requirePhotoEvidence: true,
    autoRestockSealed: true
  });

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAF8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Return Policy Settings</h1>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Configure customer return windows, eligibility rules, and automated restocking policies.</p>
      </header>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', maxWidth: '600px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Return Window (Days)</label>
          <input
            type="number"
            value={policy.returnWindowDays}
            onChange={e => setPolicy({ ...policy, returnWindowDays: parseInt(e.target.value, 10) })}
            style={{ width: '100%', padding: '0.625rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={policy.allowOpenedReturns}
            onChange={e => setPolicy({ ...policy, allowOpenedReturns: e.target.checked })}
          />
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>Allow returns for opened items (subject to inspection)</span>
        </div>

        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={policy.autoRestockSealed}
            onChange={e => setPolicy({ ...policy, autoRestockSealed: e.target.checked })}
          />
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>Automatically restock sealed returned items to sellable inventory</span>
        </div>

        <button style={{ backgroundColor: '#A9C2B9', color: '#111827', fontWeight: 600, border: 'none', padding: '0.625rem 1.25rem', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}>
          Save Return Policy
        </button>
      </div>
    </div>
  );
}
