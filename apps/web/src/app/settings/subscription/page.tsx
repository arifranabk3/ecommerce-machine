'use client';
import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft,
  Check,
  CreditCard,
  Download,
  Zap,
  Store,
  Users
} from 'lucide-react';

export default function SubscriptionPage() {
  const invoices = [
    { id: 'INV-2026-09', date: 'Sep 04, 2026', amount: '$499.00', status: 'Paid', plan: 'Enterprise' },
    { id: 'INV-2026-08', date: 'Aug 04, 2026', amount: '$499.00', status: 'Paid', plan: 'Enterprise' },
    { id: 'INV-2026-07', date: 'Jul 04, 2026', amount: '$499.00', status: 'Paid', plan: 'Enterprise' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-8 pb-12 animate-fade-in">
        
        {/* Breadcrumb & Header */}
        <div>
          <Link href="/settings" className="text-[11px] font-bold text-content-muted hover:text-content-primary uppercase tracking-wider flex items-center gap-1 w-fit mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Settings
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Billing & Subscription</h1>
              <p className="text-content-secondary text-sm mt-1 font-medium">Manage your plan, payment methods, and billing history.</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Current Plan Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="relative overflow-hidden border-border bg-surface">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex justify-between items-start mb-6 border-b border-border pb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-extrabold text-content-primary tracking-tight">Enterprise Plan</h2>
                      <Badge variant="info">Current Plan</Badge>
                    </div>
                    <p className="text-sm font-medium text-content-secondary">Unlimited stores, advanced roles, and dedicated support.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-content-primary tracking-tight mb-1">$499<span className="text-sm font-medium text-content-muted">/mo</span></div>
                    <p className="text-xs font-bold text-content-secondary uppercase tracking-wider">Billed Monthly</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-brand-600" />
                      </div>
                      <span className="text-sm font-medium text-content-primary">Unlimited Multi-Store Architecture</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-brand-600" />
                      </div>
                      <span className="text-sm font-medium text-content-primary">Advanced B2B Capabilities</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-brand-600" />
                      </div>
                      <span className="text-sm font-medium text-content-primary">Dedicated Account Manager</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-brand-600" />
                      </div>
                      <span className="text-sm font-medium text-content-primary">Custom Infrastructure Routing</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-brand-600" />
                      </div>
                      <span className="text-sm font-medium text-content-primary">99.99% Uptime SLA</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="primary">Change Plan</Button>
                  <Button variant="outline" className="bg-surface border-border text-content-primary">Cancel Subscription</Button>
                </div>
              </CardContent>
            </Card>

            {/* Invoices */}
            <Card>
              <CardContent className="p-0">
                <div className="p-6 border-b border-border">
                  <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest">Billing History</h3>
                </div>
                <div className="divide-y divide-border">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="p-6 flex items-center justify-between hover:bg-surface-hover transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-secondary border border-border flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-content-secondary" />
                        </div>
                        <div>
                          <div className="font-bold text-content-primary group-hover:text-brand-600 transition-colors">{inv.date}</div>
                          <div className="text-xs font-medium text-content-secondary">{inv.id} • {inv.plan}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-bold text-content-primary">{inv.amount}</div>
                          <Badge variant="success" className="mt-1">{inv.status}</Badge>
                        </div>
                        <Button variant="outline" size="icon" className="bg-surface border-border opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-4 h-4 text-content-secondary" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Payment Method & Usage) */}
          <div className="space-y-6">
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                  <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest">Payment Method</h3>
                </div>
                <div className="p-4 rounded-xl border border-border bg-surface-secondary relative overflow-hidden mb-4">
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-5 bg-white rounded flex items-center justify-center text-[10px] font-bold text-content-primary border border-border shadow-sm">VISA</div>
                      <span className="font-bold text-content-primary">Ending in 4242</span>
                    </div>
                    <Badge variant="info">Default</Badge>
                  </div>
                  <div className="text-xs font-medium text-content-secondary relative z-10">Expires 12/2028</div>
                  <div className="text-xs font-medium text-content-secondary relative z-10 mt-1">Sarah Jenkins</div>
                </div>
                <Button variant="outline" className="w-full bg-surface border-border text-content-primary">
                  Update Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest mb-6 border-b border-border pb-4">Resource Usage</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-content-secondary mb-2">
                      <span className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-brand-600" /> Stores</span>
                      <span>3 / Unlimited</span>
                    </div>
                    <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden border border-border">
                      <div className="w-[15%] h-full bg-brand-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs font-bold text-content-secondary mb-2">
                      <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-indigo-500" /> Staff Accounts</span>
                      <span>12 / Unlimited</span>
                    </div>
                    <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden border border-border">
                      <div className="w-[30%] h-full bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs font-bold text-content-secondary mb-2">
                      <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-warning-text" /> Automations</span>
                      <span>142,050 / 500,000</span>
                    </div>
                    <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden border border-border">
                      <div className="w-[28%] h-full bg-warning-text rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
