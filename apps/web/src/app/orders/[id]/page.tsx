'use client';
import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft,
  Printer,
  MoreVertical,
  MapPin,
  Truck,
  Mail,
  Phone,
  CheckCircle2,
  Package,
  CreditCard
} from 'lucide-react';
import { useParams } from 'next/navigation';

export default function OrderDetailPage() {
  const params = useParams();
  
  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-6 pb-12 animate-fade-in">
        
        {/* Breadcrumb & Header */}
        <div>
          <Link href="/orders" className="text-[11px] font-bold text-content-muted hover:text-content-primary uppercase tracking-wider flex items-center gap-1 w-fit mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Order SZ-10283</h1>
                <Badge variant="warning">Unfulfilled</Badge>
                <Badge variant="success">Paid</Badge>
              </div>
              <p className="text-content-secondary text-sm mt-1 font-medium">Placed on Sep 4, 2026 at 10:42 AM from Online Store</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-surface">
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <Button variant="primary">
                Fulfill Order
              </Button>
              <Button variant="outline" size="icon" className="bg-surface ml-1">
                <MoreVertical className="w-4 h-4 text-content-secondary" />
              </Button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm overflow-x-auto">
          <div className="flex items-center min-w-[600px] relative">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-border rounded-full"></div>
            <div className="absolute left-6 w-1/2 top-1/2 -translate-y-1/2 h-0.5 bg-brand-600 rounded-full"></div>
            
            <div className="flex-1 relative text-center">
              <div className="w-5 h-5 mx-auto bg-brand-600 rounded-full border-4 border-surface relative z-10 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
              <div className="mt-2 text-xs font-bold text-content-primary">Placed</div>
            </div>
            <div className="flex-1 relative text-center">
              <div className="w-5 h-5 mx-auto bg-brand-600 rounded-full border-4 border-surface relative z-10 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
              <div className="mt-2 text-xs font-bold text-content-primary">Confirmed</div>
            </div>
            <div className="flex-1 relative text-center">
              <div className="w-5 h-5 mx-auto bg-brand-600 rounded-full border-4 border-surface relative z-10 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
              <div className="mt-2 text-xs font-bold text-content-primary">Paid</div>
            </div>
            <div className="flex-1 relative text-center">
              <div className="w-5 h-5 mx-auto bg-surface border-4 border-brand-600 rounded-full relative z-10"></div>
              <div className="mt-2 text-xs font-bold text-brand-600">Processing</div>
            </div>
            <div className="flex-1 relative text-center opacity-50">
              <div className="w-5 h-5 mx-auto bg-surface border-4 border-border rounded-full relative z-10"></div>
              <div className="mt-2 text-xs font-bold text-content-muted">Shipped</div>
            </div>
            <div className="flex-1 relative text-center opacity-50">
              <div className="w-5 h-5 mx-auto bg-surface border-4 border-border rounded-full relative z-10"></div>
              <div className="mt-2 text-xs font-bold text-content-muted">Delivered</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column (Order Items) */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest mb-6 border-b border-border pb-4">Order Items (2)</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-[10px] text-content-muted font-bold shrink-0">IMG</div>
                      <div>
                        <Link href="/products/1" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">AirMax Pro Wireless</Link>
                        <div className="text-xs font-medium text-content-secondary mt-0.5">Matte Black • AUDIO-001-BLK</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-content-primary">$299.00</div>
                      <div className="text-xs text-content-secondary font-medium">Qty: 1</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-[10px] text-content-muted font-bold shrink-0">IMG</div>
                      <div>
                        <Link href="/products/2" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">Minimalist Desk Mat</Link>
                        <div className="text-xs font-medium text-content-secondary mt-0.5">Large • OFFICE-082-L</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-content-primary">$45.00</div>
                      <div className="text-xs text-content-secondary font-medium">Qty: 1</div>
                    </div>
                  </div>
                </div>
                
                {/* Summary */}
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-content-secondary font-medium">Subtotal</span>
                    <span className="text-content-primary font-bold">$344.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-content-secondary font-medium">Shipping (Standard)</span>
                    <span className="text-content-primary font-bold">$12.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-content-secondary font-medium">Tax</span>
                    <span className="text-content-primary font-bold">$28.48</span>
                  </div>
                  <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-border">
                    <span className="font-extrabold text-content-primary">Total</span>
                    <span className="font-extrabold text-brand-600">$384.48</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Customer & Fulfillment) */}
          <div className="space-y-6">
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                  <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest">Customer</h3>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold">SJ</div>
                    <div>
                      <div className="font-bold text-content-primary hover:text-brand-600 cursor-pointer transition-colors">Sarah Jenkins</div>
                      <div className="text-[11px] font-medium text-content-secondary">2 previous orders</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center gap-3 text-sm text-content-secondary">
                      <Mail className="w-4 h-4 text-content-muted shrink-0" />
                      <a href="mailto:sarah.j@example.com" className="hover:text-brand-600 transition-colors">sarah.j@example.com</a>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-content-secondary">
                      <Phone className="w-4 h-4 text-content-muted shrink-0" />
                      <a href="tel:+15550123456" className="hover:text-brand-600 transition-colors">+1 (555) 012-3456</a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest mb-6 border-b border-border pb-4">Fulfillment</h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-content-primary mb-2">
                      <MapPin className="w-4 h-4 text-brand-600" /> Shipping Address
                    </div>
                    <div className="text-sm text-content-secondary font-medium pl-6 leading-relaxed">
                      Sarah Jenkins<br />
                      123 Design Avenue<br />
                      Suite 400<br />
                      San Francisco, CA 94107<br />
                      United States
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm font-bold text-content-primary mb-2">
                      <Truck className="w-4 h-4 text-brand-600" /> Shipping Method
                    </div>
                    <div className="text-sm text-content-secondary font-medium pl-6">
                      Standard Shipping (3-5 business days)
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
