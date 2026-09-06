'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function NewWorkflowPage() {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('ORDER_CREATED');
  const [mode, setMode] = useState('AUTO');

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/automation" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Automations</Link>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '16px 0' }}>Create New Workflow</h1>

      <form onSubmit={(e) => e.preventDefault()} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Workflow Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Order Failed Payment Notification"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Event Trigger</label>
          <select
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          >
            <option value="ORDER_CREATED">ORDER_CREATED</option>
            <option value="ORDER_PAYMENT_FAILED">ORDER_PAYMENT_FAILED</option>
            <option value="INVENTORY_LOW">INVENTORY_LOW</option>
            <option value="CUSTOMER_RETURN_REQUESTED">CUSTOMER_RETURN_REQUESTED</option>
            <option value="VENDOR_SETTLEMENT_DUE">VENDOR_SETTLEMENT_DUE</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px' }}>Execution Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
          >
            <option value="AUTO">AUTO (Safe Reversible Execution)</option>
            <option value="APPROVAL">APPROVAL (Requires Human Authorization)</option>
            <option value="ESCALATION">ESCALATION (Stop & Create Inbox Exception)</option>
          </select>
        </div>

        <button
          type="button"
          style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
        >
          Save & Activate Workflow
        </button>
      </form>
    </div>
  );
}
