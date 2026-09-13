'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Search, 
  Filter, 
  Settings2, 
  ArrowRight,
  Blocks,
  Activity,
  CheckCircle2,
  PlugZap,
  Globe,
  Database
} from 'lucide-react';

export default function IntegrationsHubPage() {
  const [activeTab, setActiveTab] = useState('INSTALLED');

  const integrations = [
    {
      id: 'int_stripe',
      name: 'Stripe',
      category: 'Payments',
      developer: 'Sellzy Official',
      status: 'INSTALLED',
      health: 'HEALTHY',
      description: 'Accept payments via credit cards, Apple Pay, and Google Pay securely.',
      icon: '💳',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    },
    {
      id: 'int_klaviyo',
      name: 'Klaviyo',
      category: 'Marketing',
      developer: 'Klaviyo',
      status: 'INSTALLED',
      health: 'HEALTHY',
      description: 'Email and SMS marketing automation platform built for ecommerce.',
      icon: '✉️',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      id: 'int_xero',
      name: 'Xero',
      category: 'Accounting',
      developer: 'Xero App',
      status: 'INSTALLED',
      health: 'SYNC_ERROR',
      description: 'Sync orders, customers, and payouts directly to your Xero ledger.',
      icon: '📊',
      color: 'bg-cyan-50 text-cyan-600 border-cyan-100'
    },
    {
      id: 'int_sap',
      name: 'SAP Business One',
      category: 'ERP',
      developer: 'Sellzy Enterprise',
      status: 'AVAILABLE',
      health: 'N/A',
      description: 'Two-way sync for inventory, B2B pricing, and fulfillment.',
      icon: '🏢',
      color: 'bg-slate-100 text-slate-600 border-slate-200'
    },
    {
      id: 'int_meta',
      name: 'Meta Pixel & CAPI',
      category: 'Tracking',
      developer: 'Meta',
      status: 'AVAILABLE',
      health: 'N/A',
      description: 'Track conversions and build custom audiences for Facebook Ads.',
      icon: '🎯',
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      id: 'int_dhl',
      name: 'DHL Express',
      category: 'Shipping',
      developer: 'DHL Global',
      status: 'AVAILABLE',
      health: 'N/A',
      description: 'Real-time shipping rates and automated label generation.',
      icon: '📦',
      color: 'bg-yellow-50 text-yellow-600 border-yellow-200'
    }
  ];

  const installed = integrations.filter(i => i.status === 'INSTALLED');
  const available = integrations.filter(i => i.status === 'AVAILABLE');

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Integration Hub</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Connect external tools, payment gateways, shipping providers, and ERPs.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex bg-white">
              <Blocks className="w-4 h-4 mr-2 text-slate-400" /> Build Custom App
            </Button>
            <Button variant="primary">
              <PlugZap className="w-4 h-4 mr-2" /> App Directory
            </Button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-premium-hover transition-shadow duration-300">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-0.5">Active Connections</p>
                <div className="text-2xl font-extrabold text-slate-900">3</div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-premium-hover transition-shadow duration-300">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-0.5">API Calls (24h)</p>
                <div className="text-2xl font-extrabold text-slate-900">142.5k</div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-premium-hover transition-shadow duration-300">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-700 mb-0.5">Webhooks Triggered</p>
                <div className="text-2xl font-extrabold text-amber-600">8,240</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mt-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('INSTALLED')}
              className={`
                whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors
                ${activeTab === 'INSTALLED' 
                  ? 'border-brand-600 text-brand-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              Installed Apps ({installed.length})
            </button>
            <button
              onClick={() => setActiveTab('DISCOVER')}
              className={`
                whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors
                ${activeTab === 'DISCOVER' 
                  ? 'border-brand-600 text-brand-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('API_KEYS')}
              className={`
                whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors
                ${activeTab === 'API_KEYS' 
                  ? 'border-brand-600 text-brand-700' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
              `}
            >
              API Keys & Webhooks
            </button>
          </nav>
        </div>

        {/* Filter Bar */}
        <Card className="p-2 flex flex-col md:flex-row gap-2 items-center">
          <div className="relative w-full md:flex-1 md:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              className="w-full pl-9 pr-4 py-2 bg-transparent border-none text-sm focus:outline-none focus:ring-0"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <Button variant="outline" size="sm" className="whitespace-nowrap bg-white text-slate-700">
              <Filter className="w-4 h-4 mr-2 text-slate-400" /> Category
            </Button>
          </div>
        </Card>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'INSTALLED' ? installed : activeTab === 'DISCOVER' ? available : []).map((app) => (
            <Card key={app.id} className={`flex flex-col hover:shadow-premium-hover transition-all duration-300 ${app.health === 'SYNC_ERROR' ? 'border-amber-200' : ''}`}>
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${app.color}`}>
                    {app.icon}
                  </div>
                  {activeTab === 'INSTALLED' && (
                    <Badge variant={app.health === 'HEALTHY' ? 'success' : 'warning'} className="text-[10px]">
                      {app.health === 'HEALTHY' ? 'Healthy' : 'Sync Error'}
                    </Badge>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">{app.name}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-3 text-xs">
                    <span className="font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{app.category}</span>
                    <span className="text-slate-400 font-medium">By {app.developer}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    {app.description}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {activeTab === 'INSTALLED' ? (
                    <>
                      <Button variant="outline" size="sm" className="bg-white text-slate-700">
                        <Settings2 className="w-4 h-4 mr-2" /> Settings
                      </Button>
                      <button className="text-sm font-bold text-red-600 hover:underline">Disconnect</button>
                    </>
                  ) : (
                    <Button variant="primary" className="w-full">
                      Install App
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {activeTab === 'API_KEYS' && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 border border-slate-100">
              <Globe className="w-8 h-8 text-brand-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">API Keys & Webhooks</h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-6">Create custom integrations by generating private API credentials and setting up webhook endpoints.</p>
            <Button variant="primary">Generate API Key</Button>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
