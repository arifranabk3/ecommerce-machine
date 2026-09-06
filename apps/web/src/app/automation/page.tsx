'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AutomationDashboardPage() {
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Automation Engine Dashboard</h1>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>Manage deterministic workflows, triggers, actions, and safety kill switches.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setKillSwitchActive(!killSwitchActive)}
            style={{
              padding: '8px 16px',
              backgroundColor: killSwitchActive ? '#dc2626' : '#4b5563',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {killSwitchActive ? '⚠️ KILL SWITCH ACTIVE' : 'Disable All Automation (Kill Switch)'}
          </button>
          <Link
            href="/automation/new"
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            + Create Workflow
          </Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Active Workflows</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>12</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Total Executions (24h)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>1,420</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Pending Approvals</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px', color: '#d97706' }}>2</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Open Exceptions</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px', color: '#dc2626' }}>1</div>
        </div>
      </div>

      <section style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>System Workflows</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Trigger</th>
              <th style={{ padding: '12px' }}>Mode</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>Low Stock Procurement Trigger</td>
              <td style={{ padding: '12px' }}><code>INVENTORY_LOW</code></td>
              <td style={{ padding: '12px' }}><span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>AUTO</span></td>
              <td style={{ padding: '12px' }}><span style={{ color: '#16a34a', fontWeight: '600' }}>ACTIVE</span></td>
              <td style={{ padding: '12px' }}>
                <Link href="/automation/wf_1" style={{ color: '#2563eb', marginRight: '12px' }}>Edit</Link>
                <Link href="/automation/wf_1/runs" style={{ color: '#4b5563' }}>Runs</Link>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>High Value Refund Approval</td>
              <td style={{ padding: '12px' }}><code>REFUND_REQUIRED</code></td>
              <td style={{ padding: '12px' }}><span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>APPROVAL</span></td>
              <td style={{ padding: '12px' }}><span style={{ color: '#16a34a', fontWeight: '600' }}>ACTIVE</span></td>
              <td style={{ padding: '12px' }}>
                <Link href="/automation/wf_2" style={{ color: '#2563eb', marginRight: '12px' }}>Edit</Link>
                <Link href="/automation/wf_2/runs" style={{ color: '#4b5563' }}>Runs</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
