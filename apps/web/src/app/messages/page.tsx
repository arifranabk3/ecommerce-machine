'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader 
          title="Unified Customer Communication Inbox" 
          subtitle="Omnichannel messages across WhatsApp, Email, and SMS with realtime status tracking."
        />

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-[calc(100vh-180px)] min-h-[600px]">
          {/* Conversations List */}
          <Card className="p-4 overflow-y-auto">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Conversations</h2>
            <div className="flex flex-col gap-2">
            {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${activeConv?.id === c.id ? 'bg-slate-50 border-slate-200' : 'bg-white border-transparent hover:border-slate-100'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-slate-900">{c.customerName}</span>
                    <Badge variant={c.channel === 'WHATSAPP' ? 'success' : c.channel === 'EMAIL' ? 'info' : 'warning'}>
                      {c.channel}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                    {c.lastMessage}
                  </div>
                  <div className="text-[10px] text-slate-400">{c.lastMessageAt}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Message Thread Window */}
          <Card className="!p-0 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-lg font-semibold m-0 text-slate-900">{activeConv.customerName}</h3>
                <span className="text-xs text-slate-500">Channel: {activeConv.channel} | Status: {activeConv.status}</span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50/50">
              <div className="self-start bg-white border border-slate-100 p-3 rounded-lg rounded-tl-none max-w-[70%] text-sm text-slate-800 shadow-sm">
                <div>{activeConv.lastMessage}</div>
                <div className="text-[10px] text-slate-400 mt-1">Received via {activeConv.channel} • 10:14 AM</div>
              </div>

              <div className="self-end bg-brand-500 text-white p-3 rounded-lg rounded-tr-none max-w-[70%] text-sm shadow-sm">
                <div>Hello {activeConv.customerName}, order #ORD-4921 has been processed and is scheduled for pickup today.</div>
                <div className="text-[10px] text-brand-100 mt-1 text-right">Sent • Delivered</div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex gap-3 bg-white">
              <Input
                type="text"
                placeholder="Type message or select template..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="primary"
                onClick={() => setNewMessage('')}
              >
                Send
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
