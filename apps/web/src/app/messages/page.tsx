'use client';

import React, { useState } from 'react';

export default function UnifiedInboxPage() {
  const [conversations] = useState([
    {
      id: 'conv_101',
      customerName: 'Sarah Jenkins',
      channel: 'WHATSAPP',
      lastMessage: 'Hi, when will order #ORD-4921 ship?',
      lastMessageAt: '10 mins ago',
      unreadCount: 2,
      status: 'OPEN',
    },
    {
      id: 'conv_102',
      customerName: 'Michael Chang',
      channel: 'EMAIL',
      lastMessage: 'Thank you for updating my shipping address.',
      lastMessageAt: '1 hour ago',
      unreadCount: 0,
      status: 'OPEN',
    },
    {
      id: 'conv_103',
      customerName: 'Amina Ali',
      channel: 'SMS',
      lastMessage: 'STOP',
      lastMessageAt: '3 hours ago',
      unreadCount: 0,
      status: 'CLOSED',
    },
  ]);

  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAF8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Unified Customer Communication Inbox</h1>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Omnichannel messages across WhatsApp, Email, and SMS with realtime status tracking.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', height: 'calc(100vh - 180px)' }}>
        {/* Conversations List */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1rem', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Conversations</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveConv(c)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #F3F4F6',
                  backgroundColor: activeConv?.id === c.id ? '#F3F4F6' : '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{c.customerName}</span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      backgroundColor: c.channel === 'WHATSAPP' ? '#DCFCE7' : c.channel === 'EMAIL' ? '#DBEAFE' : '#F3E8FF',
                      color: c.channel === 'WHATSAPP' ? '#166534' : c.channel === 'EMAIL' ? '#1E40AF' : '#6B21A8',
                    }}
                  >
                    {c.channel}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.lastMessage}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: '0.25rem' }}>{c.lastMessageAt}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread Window */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: '#111827' }}>{activeConv.customerName}</h3>
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Channel: {activeConv.channel} | Status: {activeConv.status}</span>
            </div>
          </div>

          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ alignSelf: 'flex-start', backgroundColor: '#F3F4F6', padding: '0.75rem 1rem', borderRadius: '12px', maxWidth: '70%', fontSize: '0.875rem' }}>
              <div>{activeConv.lastMessage}</div>
              <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: '0.25rem' }}>Received via {activeConv.channel} • 10:14 AM</div>
            </div>

            <div style={{ alignSelf: 'flex-end', backgroundColor: '#2563EB', color: '#FFFFFF', padding: '0.75rem 1rem', borderRadius: '12px', maxWidth: '70%', fontSize: '0.875rem' }}>
              <div>Hello {activeConv.customerName}, order #ORD-4921 has been processed and is scheduled for pickup today.</div>
              <div style={{ fontSize: '0.65rem', color: '#93C5FD', marginTop: '0.25rem', textAlign: 'right' }}>Sent • Delivered</div>
            </div>
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              placeholder="Type message or select template..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.875rem' }}
            />
            <button
              onClick={() => setNewMessage('')}
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
