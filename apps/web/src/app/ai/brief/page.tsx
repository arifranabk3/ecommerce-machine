'use client';

import React from 'react';
import Link from 'next/link';

export default function DailyBusinessBriefPage() {
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/ai" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to AI Copilot</Link>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '16px 0' }}>Daily Business Brief — 2026-09-06</h1>

      <div style={{ display: 'grid', gap: '16px' }}>
        <section style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 12px 0' }}>📊 FACTS (Verified Data)</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155' }}>
            <li>Total Orders Today: <strong>150</strong></li>
            <li>Gross Revenue: <strong>$45,000.00</strong></li>
            <li>Low Stock Items Identified: <strong>3 SKUs</strong></li>
            <li>Pending Vendor Settlement Approvals: <strong>2 Batches</strong></li>
            <li>Open Exception Items: <strong>1 Item</strong></li>
          </ul>
        </section>

        <section style={{ backgroundColor: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1d4ed8', margin: '0 0 12px 0' }}>💡 RECOMMENDATIONS</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e40af' }}>
            <li>Reorder 50 units of low-stock SKU-100 to prevent stockout in 48 hours.</li>
            <li>Review 2 pending vendor payment approval requests in Approvals queue.</li>
          </ul>
        </section>

        <section style={{ backgroundColor: '#fff7ed', border: '1px solid #fdba74', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#c2410c', margin: '0 0 12px 0' }}>⚠️ RISKS</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#9a3412' }}>
            <li>SKU-100 inventory will deplete in 48 hours based on recent 7-day sales velocity.</li>
          </ul>
        </section>

        <section style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#b91c1c', margin: '0 0 12px 0' }}>⚡ ACTION REQUIRED</h2>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#991b1b' }}>
            <li>Authorize Vendor Payment Batch #SETT-902 ($12,450.00).</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
