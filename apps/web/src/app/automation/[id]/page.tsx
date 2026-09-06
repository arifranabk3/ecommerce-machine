'use client';

import React from 'react';
import Link from 'next/link';

export default function EditWorkflowPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/automation" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Automations</Link>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '16px 0' }}>Workflow Detail #{params.id}</h1>

      <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px' }}>
        <p><strong>Workflow ID:</strong> {params.id}</p>
        <p><strong>Status:</strong> <span style={{ color: '#16a34a', fontWeight: '600' }}>ACTIVE</span></p>
        <p><strong>Mode:</strong> AUTO</p>
        <p><strong>Version:</strong> 1</p>
        <div style={{ marginTop: '16px' }}>
          <Link href={`/automation/${params.id}/runs`} style={{ color: '#2563eb', fontWeight: '600' }}>View Execution History →</Link>
        </div>
      </div>
    </div>
  );
}
