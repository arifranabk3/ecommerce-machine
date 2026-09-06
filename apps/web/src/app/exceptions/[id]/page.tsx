'use client';

import React from 'react';
import Link from 'next/link';

export default function ExceptionDetailPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/exceptions" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Exceptions</Link>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '16px 0' }}>Exception Detail #{params.id}</h1>

      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px' }}>
        <p><strong>Category:</strong> INVENTORY_STOCKOUT</p>
        <p><strong>Severity:</strong> HIGH</p>
        <p><strong>Title:</strong> Supplier Unavailable for SKU-100</p>
        <p><strong>Description:</strong> Automated reorder for SKU-100 failed because Primary Supplier is out of stock.</p>
        <p><strong>Recommended Action:</strong> Select fallback supplier from procurement settings or manually adjust reorder quantity.</p>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <button style={{ padding: '8px 16px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Resolve Exception</button>
          <button style={{ padding: '8px 16px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Ignore</button>
        </div>
      </div>
    </div>
  );
}
