'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { 
  Puzzle,
  ChevronDown,
  Store,
  Search,
  Filter,
  Link,
  Activity,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  List,
  RefreshCw,
  Power,
  PowerOff,
  MoreHorizontal,
  X,
  CreditCard,
  ShoppingBag,
  Truck,
  MessageCircle,
  Megaphone,
  Mail,
  Zap,
  Clock,
  ShieldAlert,
  ServerCog,
  Monitor,
  Settings
} from 'lucide-react';

export default function IntegrationsDashboardPage() {
  const [view, setView] = useState<'library' | 'detail' | 'logs'>('library');
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectStep, setConnectStep] = useState(1);

  // Realistic mock data
  const kpis = [
    { title: 'Connected', value: '12', icon: Link, color: 'text-brand-600', bg: 'bg-brand-50' },
    { title: 'Active Syncs', value: '8', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Needs Attention', value: '1', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Available Integrations', value: '45+', icon: Puzzle, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Recent Syncs', value: '14.2k', icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const categories = ['All', 'Commerce', 'Payments', 'Shipping', 'Marketing', 'Analytics', 'Customer Support', 'Automation'];

  const integrations = [
    { id: 'i-1', name: 'Stripe', category: 'Payments', desc: 'Accept credit cards and global payment methods securely.', status: 'CONNECTED', lastSync: '1 min ago', store: 'Main Store', icon: CreditCard, color: 'text-[#635BFF]', bg: 'bg-[#635BFF]/10' },
    { id: 'i-2', name: 'Shopify', category: 'Commerce', desc: 'Sync products, inventory, and orders seamlessly.', status: 'ERROR', lastSync: '2 hrs ago', store: 'Main Store', icon: ShoppingBag, color: 'text-[#95BF47]', bg: 'bg-[#95BF47]/10' },
    { id: 'i-3', name: 'Twilio', category: 'Communication', desc: 'Send automated SMS notifications for orders and shipping.', status: 'CONNECTED', lastSync: '5 mins ago', store: 'Global', icon: MessageCircle, color: 'text-[#F22F46]', bg: 'bg-[#F22F46]/10' },
    { id: 'i-4', name: 'FedEx', category: 'Shipping', desc: 'Generate live rates, print labels, and track shipments.', status: 'DISABLED', lastSync: '1 month ago', store: 'Main Store', icon: Truck, color: 'text-[#4D148C]', bg: 'bg-[#4D148C]/10' },
    { id: 'i-5', name: 'Google Analytics', category: 'Analytics', desc: 'Track storefront performance and conversion events.', status: 'NOT CONFIGURED', lastSync: '-', store: '-', icon: Activity, color: 'text-[#F4B400]', bg: 'bg-[#F4B400]/10' },
    { id: 'i-6', name: 'Klaviyo', category: 'Marketing', desc: 'Email and SMS marketing automation platform.', status: 'REQUIRES REAUTHORIZATION', lastSync: '3 days ago', store: 'Main Store', icon: Mail, color: 'text-[#2467F5]', bg: 'bg-[#2467F5]/10' },
    { id: 'i-7', name: 'SAP ERP', category: 'Accounting', desc: 'Enterprise resource planning synchronization.', status: 'LOCKED', plan: 'Enterprise', store: '-', icon: Database, color: 'text-[#008FD3]', bg: 'bg-[#008FD3]/10' },
  ];

  const logs = [
    { id: '1', time: '10:45:02 AM', integration: 'Stripe', event: 'Payment Intent Created', store: 'Main Store', status: 'Success', duration: '120ms', records: 1 },
    { id: '2', time: '10:42:15 AM', integration: 'Shopify', event: 'Inventory Sync', store: 'Main Store', status: 'Error', duration: '5.2s', records: 450 },
    { id: '3', time: '10:40:00 AM', integration: 'Twilio', event: 'SMS Sent', store: 'Main Store', status: 'Success', duration: '450ms', records: 1 },
    { id: '4', time: '10:35:12 AM', integration: 'Twilio', event: 'SMS Sent', store: 'Main Store', status: 'Success', duration: '410ms', records: 1 },
    { id: '5', time: '10:15:00 AM', integration: 'Shopify', event: 'Order Sync', store: 'Main Store', status: 'Warning', duration: '1.2s', records: 12 },
  ];

  const handleOpenDetail = (item: any) => {
    setSelectedIntegration(item);
    setView('detail');
  };

  const handleConnect = (item: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (item.status === 'LOCKED') return;
    setSelectedIntegration(item);
    setConnectStep(1);
    setIsConnectModalOpen(true);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1 text-[10px]"><CheckCircle2 className="w-3 h-3" /> ACTIVE</Badge>;
      case 'ERROR':
        return <Badge variant="danger" className="bg-red-50 text-red-700 border-red-100 flex items-center gap-1 text-[10px]"><AlertCircle className="w-3 h-3" /> ERROR</Badge>;
      case 'REQUIRES REAUTHORIZATION':
        return <Badge variant="warning" className="bg-amber-50 text-amber-700 border-amber-100 flex items-center gap-1 text-[10px]"><ShieldAlert className="w-3 h-3" /> AUTH EXPIRED</Badge>;
      case 'DISABLED':
        return <Badge variant="default" className="bg-slate-100 text-slate-700 border-slate-200 flex items-center gap-1 text-[10px]"><PowerOff className="w-3 h-3" /> DISABLED</Badge>;
      case 'LOCKED':
        return <Badge variant="default" className="bg-slate-100 text-slate-500 border-slate-200 flex items-center gap-1 text-[10px]"><Lock className="w-3 h-3" /> LOCKED</Badge>;
      default:
        return <Badge variant="outline" className="bg-white text-slate-500 border-slate-200 text-[10px]">NOT CONFIGURED</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Integrations</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Connect Sellzy with the tools your business already uses.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hidden md:flex">
              <Store className="w-4 h-4 mr-2 text-slate-500" />
              Main Store
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search integrations..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all w-64"
              />
            </div>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => setView('logs')}>
              <List className="w-4 h-4 mr-2" />
              View Logs
            </Button>
            <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm" onClick={() => {
              setView('library');
              setIsConnectModalOpen(true);
              setConnectStep(1);
              setSelectedIntegration(integrations[0]);
            }}>
              <Link className="w-4 h-4 mr-2" />
              Connect Integration
            </Button>
          </div>
        </div>

        {view === 'library' && (
          <>
            {/* KPI ROW */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {kpis.map((kpi, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
                  <CardContent className="p-5 flex flex-col items-center text-center sm:items-start sm:text-left">
                    <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <kpi.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</div>
                    <p className="text-xs font-bold text-slate-500 mt-1">{kpi.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CATEGORIES & FILTERS */}
            <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
              {categories.map((cat, i) => (
                <button key={i} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-slate-800 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* INTEGRATIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {integrations.map((item) => (
                <Card key={item.id} className="shadow-sm border-slate-200 hover:shadow-md hover:border-brand-200 transition-all cursor-pointer group flex flex-col h-full" onClick={() => handleOpenDetail(item)}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      {renderStatusBadge(item.status)}
                    </div>
                    
                    <h3 className="text-lg font-extrabold text-slate-900 mb-1">{item.name}</h3>
                    <p className="text-xs font-bold text-brand-600 mb-3">{item.category}</p>
                    <p className="text-sm text-slate-500 font-medium mb-6 flex-1 line-clamp-2">{item.desc}</p>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Store Scope</span>
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1"><Store className="w-3 h-3 text-slate-400" /> {item.store}</span>
                      </div>
                      
                      {item.status === 'LOCKED' ? (
                        <Button variant="outline" size="sm" className="bg-slate-50 text-slate-500 font-bold border-slate-200" onClick={(e) => { e.stopPropagation(); }}>
                          <Lock className="w-3 h-3 mr-1.5" /> Upgrade Plan
                        </Button>
                      ) : item.status === 'NOT CONFIGURED' ? (
                        <Button variant="primary" size="sm" className="bg-slate-900 text-white font-bold shadow-sm hover:bg-slate-800" onClick={(e) => handleConnect(item, e)}>
                          Connect
                        </Button>
                      ) : item.status === 'ERROR' || item.status === 'REQUIRES REAUTHORIZATION' ? (
                        <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 font-bold" onClick={(e) => handleConnect(item, e)}>
                          Reconnect
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 font-bold hover:bg-slate-50" onClick={(e) => { e.stopPropagation(); }}>
                          Configure
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {view === 'detail' && selectedIntegration && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" className="bg-white" onClick={() => setView('library')}>
                ← Back to Integrations
              </Button>
              <div className="h-4 w-px bg-slate-300"></div>
              <span className="text-slate-500 font-medium">Integration Detail: <strong className="text-slate-900">{selectedIntegration.name}</strong></span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6 xl:col-span-1">
                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl ${selectedIntegration.bg} ${selectedIntegration.color} flex items-center justify-center shrink-0`}>
                        <selectedIntegration.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-extrabold text-slate-900">{selectedIntegration.name}</h2>
                        <p className="text-sm font-bold text-brand-600">{selectedIntegration.category}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 font-medium mb-6 leading-relaxed">{selectedIntegration.desc}</p>
                    
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">Status</span>
                        {renderStatusBadge(selectedIntegration.status)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">Store Scope</span>
                        <span className="text-sm font-bold text-slate-900">{selectedIntegration.store}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">Last Sync</span>
                        <span className="text-sm font-bold text-slate-900">{selectedIntegration.lastSync}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {selectedIntegration.status === 'CONNECTED' ? (
                        <>
                          <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white font-bold w-full shadow-sm">
                            <RefreshCw className="w-4 h-4 mr-2" /> Sync Now
                          </Button>
                          <Button variant="outline" className="bg-white border-slate-200 text-slate-700 font-bold w-full hover:bg-slate-50">
                            Configure Settings
                          </Button>
                          <Button variant="ghost" className="text-red-600 font-bold hover:bg-red-50 w-full mt-2">
                            <PowerOff className="w-4 h-4 mr-2" /> Disable Integration
                          </Button>
                        </>
                      ) : selectedIntegration.status === 'ERROR' ? (
                        <>
                          <Button variant="primary" className="bg-slate-900 hover:bg-slate-800 text-white font-bold w-full shadow-sm" onClick={() => handleConnect(selectedIntegration)}>
                            Reconnect Integration
                          </Button>
                          <Button variant="outline" className="bg-white border-red-200 text-red-600 hover:bg-red-50 font-bold w-full">
                            View Error Logs
                          </Button>
                        </>
                      ) : (
                        <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white font-bold w-full shadow-sm" onClick={() => handleConnect(selectedIntegration)}>
                          Connect Integration
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {selectedIntegration.status === 'CONNECTED' && (
                  <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-0">
                      <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                        <ServerCog className="w-4 h-4 text-slate-400" />
                        <h3 className="font-extrabold text-slate-900 text-sm">Webhook Health</h3>
                      </div>
                      <div className="p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500">Status</span>
                          <Badge variant="success" className="bg-emerald-50 text-emerald-700 text-[10px]">Healthy</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500">Events Processed</span>
                          <span className="text-sm font-bold text-slate-900">12,450</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500">Retry Queue</span>
                          <span className="text-sm font-bold text-slate-900">0</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column (Tabs/Content) */}
              <div className="xl:col-span-2 space-y-6">
                
                {selectedIntegration.status === 'ERROR' && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-extrabold text-red-900 text-base">Action Required: Sync Failed</h3>
                      <p className="text-sm font-medium text-red-800 mt-1 leading-relaxed">
                        The connection to Shopify failed due to an invalid access token. This can happen if the app was uninstalled or permissions were revoked on Shopify's end.
                      </p>
                      <Button variant="outline" size="sm" className="bg-white border-red-200 text-red-700 hover:bg-red-50 mt-4 font-bold" onClick={() => handleConnect(selectedIntegration)}>
                        Reconnect Now
                      </Button>
                    </div>
                  </div>
                )}

                <Card className="shadow-sm border-slate-200">
                  <div className="flex border-b border-slate-200">
                    <button className="px-6 py-4 text-sm font-bold text-brand-600 border-b-2 border-brand-600">Overview</button>
                    <button className="px-6 py-4 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Sync Configuration</button>
                    <button className="px-6 py-4 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Logs</button>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-extrabold text-slate-900 mb-4">Continuous Sync Status</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Products</p>
                            <p className="text-xs text-slate-500 font-medium">Real-time sync</p>
                          </div>
                        </div>
                        <Badge variant="success" className="bg-emerald-50 text-emerald-700">Active</Badge>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Orders</p>
                            <p className="text-xs text-slate-500 font-medium">Real-time sync</p>
                          </div>
                        </div>
                        <Badge variant="success" className="bg-emerald-50 text-emerald-700">Active</Badge>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Inventory</p>
                            <p className="text-xs text-slate-500 font-medium">Every 15 mins</p>
                          </div>
                        </div>
                        {selectedIntegration.status === 'ERROR' ? <Badge variant="danger" className="bg-red-50 text-red-700">Failed</Badge> : <Badge variant="success" className="bg-emerald-50 text-emerald-700">Active</Badge>}
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {view === 'logs' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" className="bg-white" onClick={() => setView('library')}>
                ← Back to Integrations
              </Button>
              <div className="h-4 w-px bg-slate-300"></div>
              <span className="text-slate-500 font-medium"><strong className="text-slate-900">System Logs</strong></span>
            </div>

            <Card className="shadow-sm border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-slate-50 text-slate-700">All Logs</Button>
                  <Button variant="outline" size="sm" className="bg-white text-slate-600 border-slate-200">Errors Only</Button>
                </div>
                <Button variant="outline" size="sm" className="bg-white text-slate-600 border-slate-200"><Filter className="w-4 h-4 mr-2"/> Filters</Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <Thead>
                    <Tr>
                      <Th className="pl-6 font-bold text-slate-600">Timestamp</Th>
                      <Th className="font-bold text-slate-600">Integration</Th>
                      <Th className="font-bold text-slate-600">Event</Th>
                      <Th className="font-bold text-slate-600">Status</Th>
                      <Th className="text-right font-bold text-slate-600">Duration</Th>
                      <Th className="text-right pr-6 font-bold text-slate-600"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {logs.map((log) => (
                      <Tr key={log.id} className="hover:bg-slate-50/50">
                        <Td className="pl-6 font-medium text-slate-500 text-xs">{log.time}</Td>
                        <Td className="font-bold text-slate-900">{log.integration}</Td>
                        <Td className="font-medium text-slate-700">{log.event}</Td>
                        <Td>
                          <Badge 
                            variant={log.status === 'Success' ? 'success' : log.status === 'Error' ? 'danger' : 'warning'}
                            className="text-[10px]"
                          >
                            {log.status}
                          </Badge>
                        </Td>
                        <Td className="text-right font-medium text-slate-500">{log.duration}</Td>
                        <Td className="text-right pr-6">
                          <Button variant="ghost" size="sm" className="text-brand-600 font-bold hover:bg-brand-50">View Details</Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </div>
            </Card>
          </div>
        )}

      </div>

      {/* CONNECT INTEGRATION MODAL FLOW */}
      {isConnectModalOpen && selectedIntegration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsConnectModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${selectedIntegration.bg} ${selectedIntegration.color} flex items-center justify-center`}>
                  <selectedIntegration.icon className="w-4 h-4" />
                </div>
                Connect {selectedIntegration.name}
              </h2>
              <button onClick={() => setIsConnectModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Steps */}
              <div className="w-56 bg-slate-50 border-r border-slate-100 p-4 hidden md:block overflow-y-auto">
                <div className="space-y-2 relative before:absolute before:inset-0 before:ml-[27px] before:h-[calc(100%-40px)] before:top-[20px] before:w-0.5 before:bg-slate-200">
                  {['Authenticate', 'Select Store', 'Configure Sync', 'Initial Sync', 'Complete'].map((step, idx) => {
                    const stepNum = idx + 1;
                    const isActive = connectStep === stepNum;
                    const isPast = connectStep > stepNum;
                    return (
                      <div key={step} className="relative flex items-center gap-3 py-3 z-10">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          isActive ? 'bg-brand-600 text-white border-2 border-brand-100 ring-4 ring-brand-50' : 
                          isPast ? 'bg-emerald-500 text-white border-2 border-emerald-100' : 'bg-white text-slate-400 border border-slate-200'
                        }`}>
                          {isPast ? <CheckCircle2 className="w-3 h-3" /> : stepNum}
                        </div>
                        <span className={`text-xs font-bold transition-colors ${isActive ? 'text-brand-700' : isPast ? 'text-slate-700' : 'text-slate-500'}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Content Area */}
              <div className="flex-1 p-8 overflow-y-auto bg-white flex flex-col justify-center">
                {connectStep === 1 && (
                  <div className="flex flex-col items-center text-center max-w-sm mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center border-2 border-brand-100">
                        <Monitor className="w-8 h-8" />
                      </div>
                      <div className="flex items-center gap-1 text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                      </div>
                      <div className={`w-16 h-16 ${selectedIntegration.bg} ${selectedIntegration.color} rounded-2xl flex items-center justify-center border-2 border-slate-100`}>
                        <selectedIntegration.icon className="w-8 h-8" />
                      </div>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-2">Authorize Connection</h3>
                    <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                      You will be securely redirected to {selectedIntegration.name} to grant Sellzy read and write access to your data.
                    </p>
                    <Button variant="primary" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-6 px-8 w-full shadow-md" onClick={() => setConnectStep(2)}>
                      Authenticate with {selectedIntegration.name}
                    </Button>
                    <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-wider flex items-center gap-1 justify-center">
                      <Lock className="w-3 h-3" /> Secure OAuth 2.0 Connection
                    </p>
                  </div>
                )}
                
                {connectStep > 1 && connectStep < 5 && (
                  <div className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50/50 text-center px-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                      <Settings className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-bold">UI Foundation for Step {connectStep}</p>
                    <p className="text-slate-400 font-medium text-sm mt-1">Provider-specific configuration UI will render here</p>
                  </div>
                )}

                {connectStep === 5 && (
                  <div className="flex flex-col items-center text-center max-w-sm mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-100">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-2">Connection Successful!</h3>
                    <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                      Your {selectedIntegration.name} integration is now active on Main Store. The continuous sync engine is running in the background.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white">
              <Button variant="outline" className="text-slate-600 font-bold bg-white" onClick={() => setConnectStep(Math.max(1, connectStep - 1))} disabled={connectStep === 1 || connectStep === 5}>
                Back
              </Button>
              <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 shadow-sm" onClick={() => {
                if (connectStep < 5) setConnectStep(connectStep + 1);
                else setIsConnectModalOpen(false);
              }}>
                {connectStep === 5 ? 'Done' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
