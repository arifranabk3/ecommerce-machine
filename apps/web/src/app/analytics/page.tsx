'use client';

import React from 'react';

export default function AnalyticsDashboardPage() {
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Sellzy Analytics & Reporting Engine</h1>
        <p style={{ color: '#666', margin: '4px 0 0 0' }}>Multi-tenant accurate business intelligence derived from authoritative domain models.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Net Sales</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>$124,500.00</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Total Orders</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>1,420</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Contribution Profit</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>$38,200.00</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Delivery Success Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>94.2%</div>
        </div>
      </div>
    </div>
  );
}
