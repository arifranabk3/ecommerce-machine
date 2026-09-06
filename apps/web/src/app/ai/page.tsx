'use client';

import React from 'react';
import Link from 'next/link';

export default function AiCopilotDashboardPage() {
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>AI Copilot Advisory Hub</h1>
        <p style={{ color: '#666', margin: '4px 0 0 0' }}>AI-assisted business briefs, customer sentiment classification, and recommendation insights.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Daily Business Brief</h2>
          <p style={{ color: '#475569', fontSize: '14px' }}>Automated daily summary of orders, revenue, inventory risks, and pending vendor approvals.</p>
          <Link href="/ai/brief" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>View Today's Brief →</Link>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Tool Boundary Defense</h2>
          <p style={{ color: '#475569', fontSize: '14px' }}>AI tools are strictly bounded. Financial dispatches & permissions require explicit human authorization.</p>
          <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>4 Safe Registered Tools</span>
        </div>
      </div>
    </div>
  );
}
