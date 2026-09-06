'use client';

import React from 'react';
import Link from 'next/link';

export default function WorkflowRunsPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <Link href="/automation" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Automations</Link>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '16px 0' }}>Workflow Execution Runs #{params.id}</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <th style={{ padding: '12px' }}>Run ID</th>
            <th style={{ padding: '12px' }}>Trigger Event</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Started At</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '12px' }}><code>run_98124</code></td>
            <td style={{ padding: '12px' }}>evt_ord_901</td>
            <td style={{ padding: '12px' }}><span style={{ color: '#16a34a', fontWeight: '600' }}>COMPLETED</span></td>
            <td style={{ padding: '12px' }}>2026-09-06 12:40:12</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
