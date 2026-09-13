'use client';
import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Building2, 
  Users, 
  CreditCard, 
  Store, 
  Truck, 
  Bell, 
  Shield, 
  Globe, 
  Wallet,
  Settings as SettingsIcon,
  Search,
  ArrowRight
} from 'lucide-react';

export default function SettingsHubPage() {
  const settingCategories = [
    {
      title: "Business Settings",
      description: "Manage your company details, locations, and legal information",
      icon: Building2,
      color: "text-brand-600",
      bg: "bg-brand-50",
      href: "/settings/business"
    },
    {
      title: "Team & Permissions",
      description: "Manage staff accounts, roles, and access control",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      href: "/settings/team"
    },
    {
      title: "Billing & Subscription",
      description: "View your current plan, invoices, and payment methods",
      icon: CreditCard,
      color: "text-success-text",
      bg: "bg-success-subtle",
      href: "/settings/subscription"
    },
    {
      title: "Locations & Stores",
      description: "Configure multi-store settings and physical locations",
      icon: Store,
      color: "text-warning-text",
      bg: "bg-warning-subtle",
      href: "/settings/locations"
    },
    {
      title: "Shipping & Fulfillment",
      description: "Set up shipping rates, zones, and fulfillment services",
      icon: Truck,
      color: "text-orange-600",
      bg: "bg-orange-50",
      href: "/settings/shipping"
    },
    {
      title: "Payments & Checkouts",
      description: "Configure payment gateways and checkout experience",
      icon: Wallet,
      color: "text-brand-700",
      bg: "bg-brand-100",
      href: "/settings/payments"
    },
    {
      title: "Domains & Routing",
      description: "Manage custom domains, SSL, and market routing",
      icon: Globe,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      href: "/settings/domains"
    },
    {
      title: "Security & Authentication",
      description: "Configure MFA, SSO, and security policies",
      icon: Shield,
      color: "text-danger-text",
      bg: "bg-danger-subtle",
      href: "/settings/security"
    },
    {
      title: "Notifications",
      description: "Manage email, SMS, and push notification preferences",
      icon: Bell,
      color: "text-pink-600",
      bg: "bg-pink-50",
      href: "/settings/notifications"
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-8 pb-12 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
          <div className="relative">
            <h1 className="text-3xl font-extrabold text-content-primary tracking-tight relative z-10 flex items-center gap-3">
              <div className="p-2 bg-surface-secondary rounded-xl border border-border shadow-sm">
                <SettingsIcon className="w-6 h-6 text-content-secondary" />
              </div>
              Settings
            </h1>
            <p className="text-content-secondary text-sm mt-2 font-medium relative z-10">
              Manage your store preferences, billing, and team.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              placeholder="Search settings..."
              className="w-full pl-9 pr-4 py-2.5 bg-surface rounded-xl text-sm text-content-primary placeholder-content-muted border border-border focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors shadow-sm outline-none"
            />
          </div>
        </div>

        {/* Current Plan Overview */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2 group-hover:bg-brand-100 transition-colors duration-500"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-brand-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-content-primary tracking-tight">Enterprise Plan</h2>
                  <Badge variant="success">Active</Badge>
                </div>
                <p className="text-sm font-medium text-content-secondary">Your next billing date is October 4, 2026 for $499.00.</p>
              </div>
            </div>
            <Link href="/settings/subscription">
              <Button variant="outline" className="bg-surface border-border text-content-primary shadow-sm hover:border-brand-200 hover:text-brand-700">
                Manage Billing <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingCategories.map((category, i) => (
            <Link href={category.href} key={i}>
              <Card className="h-full group hover:border-brand-200 transition-all duration-300 bg-surface border-border shadow-sm hover:shadow-premium-hover cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-10 h-10 rounded-lg ${category.bg} border border-white/50 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-content-primary mb-2 group-hover:text-brand-700 transition-colors">{category.title}</h3>
                  <p className="text-xs font-medium text-content-secondary leading-relaxed transition-colors">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
