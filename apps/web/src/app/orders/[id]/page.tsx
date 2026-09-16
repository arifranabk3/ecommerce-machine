'use client';
import React, { useState } from 'react';
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
import { useApiQuery, useApiMutation } from '@/lib/api-client';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const { data, isLoading, error, mutate } = useApiQuery<any>(`/api/v1/orders/${orderId}`);
  const { trigger: confirmOrder, isMutating: isConfirming } = useApiMutation(`/api/v1/orders/${orderId}/confirm`);
  const { trigger: processOrder, isMutating: isProcessing } = useApiMutation(`/api/v1/orders/${orderId}/process`);
  const { trigger: cancelOrder, isMutating: isCancelling } = useApiMutation(`/api/v1/orders/${orderId}/cancel`);

  const handleConfirm = async () => {
    try {
      await confirmOrder({ method: 'POST', body: { targetStatus: 'CONFIRMED', reason: 'Confirmed by user' } });
      mutate();
    } catch (err) {
      console.error(err);
      alert('Failed to confirm order');
    }
  };

  const handleProcess = async () => {
    try {
      await processOrder({ method: 'POST', body: { targetStatus: 'PROCESSING', reason: 'Processing started by user' } });
      mutate();
    } catch (err) {
      console.error(err);
      alert('Failed to process order');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder({ method: 'POST', body: { targetStatus: 'CANCELLED', reason: 'Cancelled by user' } });
      mutate();
    } catch (err) {
      console.error(err);
      alert('Failed to cancel order');
    }
  };

  const formatCurrency = (minor: number | undefined) => {
    if (minor === undefined) return 'Rs 0';
    return `Rs ${(minor / 100).toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-[1200px] mx-auto space-y-6 pb-12 animate-fade-in text-center py-20 text-content-muted">
          Loading order details...
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data?.data?.order) {
    return (
      <DashboardLayout>
        <div className="max-w-[1200px] mx-auto space-y-6 pb-12 animate-fade-in text-center py-20 text-danger-text">
          Failed to load order: {error?.message || 'Not found'}
        </div>
      </DashboardLayout>
    );
  }

  const { order, items, timeline } = data.data;

  // Derive active step based on status
  let activeStep = 0;
  if (order.status === 'CONFIRMED') activeStep = 1;
  else if (order.status === 'PROCESSING') activeStep = 2;
  else if (order.status === 'SHIPPED') activeStep = 3;
  else if (order.status === 'DELIVERED') activeStep = 4;
  else if (order.status === 'CANCELLED') activeStep = -1;

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
                <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">Order #{order.orderNumber || order._id.substring(0,8).toUpperCase()}</h1>
                <Badge variant={order.fulfillmentStatus === 'DELIVERED' ? 'success' : order.fulfillmentStatus === 'PENDING' ? 'warning' : 'info'}>
                  {order.fulfillmentStatus}
                </Badge>
                <Badge variant={order.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                  {order.paymentStatus}
                </Badge>
                {order.status === 'CANCELLED' && <Badge variant="danger">CANCELLED</Badge>}
              </div>
              <p className="text-content-secondary text-sm mt-1 font-medium">Placed on {new Date(order.createdAt).toLocaleString()} via {order.source}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" className="bg-surface">
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              {order.status === 'PENDING' && (
                <Button variant="primary" onClick={handleConfirm} disabled={isConfirming}>
                  Confirm Order
                </Button>
              )}
              {order.status === 'CONFIRMED' && (
                <Button variant="primary" onClick={handleProcess} disabled={isProcessing}>
                  Process Order
                </Button>
              )}
              {['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status) && (
                <Button variant="outline" className="text-danger-text border-danger-border hover:bg-danger-50" onClick={handleCancel} disabled={isCancelling}>
                  Cancel
                </Button>
              )}
              <Button variant="outline" size="icon" className="bg-surface ml-1">
                <MoreVertical className="w-4 h-4 text-content-secondary" />
              </Button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {order.status !== 'CANCELLED' && (
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm overflow-x-auto">
            <div className="flex items-center min-w-[600px] relative">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-border rounded-full"></div>
              
              <div className={`absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-brand-600 rounded-full transition-all duration-500`} style={{ width: `${(Math.max(0, activeStep) / 4) * 100}%` }}></div>
              
              <div className="flex-1 relative text-center">
                <div className={`w-5 h-5 mx-auto rounded-full relative z-10 flex items-center justify-center ${activeStep >= 0 ? 'bg-brand-600 border-4 border-surface' : 'bg-surface border-4 border-border'}`}>
                  {activeStep >= 0 && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className={`mt-2 text-xs font-bold ${activeStep >= 0 ? 'text-content-primary' : 'text-content-muted'}`}>Placed</div>
              </div>
              <div className="flex-1 relative text-center">
                <div className={`w-5 h-5 mx-auto rounded-full relative z-10 flex items-center justify-center ${activeStep >= 1 ? 'bg-brand-600 border-4 border-surface' : activeStep === 0 ? 'bg-surface border-4 border-brand-600' : 'bg-surface border-4 border-border'}`}>
                  {activeStep >= 1 && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className={`mt-2 text-xs font-bold ${activeStep > 1 ? 'text-content-primary' : activeStep === 1 ? 'text-brand-600' : 'text-content-muted'}`}>Confirmed</div>
              </div>
              <div className="flex-1 relative text-center">
                <div className={`w-5 h-5 mx-auto rounded-full relative z-10 flex items-center justify-center ${activeStep >= 2 ? 'bg-brand-600 border-4 border-surface' : activeStep === 1 ? 'bg-surface border-4 border-brand-600' : 'bg-surface border-4 border-border'}`}>
                  {activeStep >= 2 && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className={`mt-2 text-xs font-bold ${activeStep > 2 ? 'text-content-primary' : activeStep === 2 ? 'text-brand-600' : 'text-content-muted'}`}>Processing</div>
              </div>
              <div className="flex-1 relative text-center">
                <div className={`w-5 h-5 mx-auto rounded-full relative z-10 flex items-center justify-center ${activeStep >= 3 ? 'bg-brand-600 border-4 border-surface' : activeStep === 2 ? 'bg-surface border-4 border-brand-600' : 'bg-surface border-4 border-border'}`}>
                  {activeStep >= 3 && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className={`mt-2 text-xs font-bold ${activeStep > 3 ? 'text-content-primary' : activeStep === 3 ? 'text-brand-600' : 'text-content-muted'}`}>Shipped</div>
              </div>
              <div className="flex-1 relative text-center">
                <div className={`w-5 h-5 mx-auto rounded-full relative z-10 flex items-center justify-center ${activeStep >= 4 ? 'bg-brand-600 border-4 border-surface' : activeStep === 3 ? 'bg-surface border-4 border-brand-600' : 'bg-surface border-4 border-border'}`}>
                  {activeStep >= 4 && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className={`mt-2 text-xs font-bold ${activeStep >= 4 ? 'text-content-primary' : 'text-content-muted'}`}>Delivered</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column (Order Items) */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest mb-6 border-b border-border pb-4">Order Items ({order.itemCount || items?.length || 0})</h3>
                
                <div className="space-y-4">
                  {items?.map((item: any) => (
                    <div key={item._id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-[10px] text-content-muted font-bold shrink-0">IMG</div>
                        <div>
                          <Link href={`/products/${item.productId}`} className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
                            {item.productNameSnapshot}
                          </Link>
                          <div className="text-xs font-medium text-content-secondary mt-0.5">
                            {item.variantNameSnapshot ? `${item.variantNameSnapshot} • ` : ''}{item.skuSnapshot}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-content-primary">{formatCurrency(item.unitPriceMinor)}</div>
                        <div className="text-xs text-content-secondary font-medium">Qty: {item.quantity}</div>
                        {item.discountMinor > 0 && (
                          <div className="text-xs text-danger-text font-medium mt-1">
                            Discount: -{formatCurrency(item.discountMinor)}
                          </div>
                        )}
                        <div className="text-xs font-bold text-content-primary mt-1">
                          Total: {formatCurrency(item.lineTotalMinor)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Summary */}
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-content-secondary font-medium">Subtotal</span>
                    <span className="text-content-primary font-bold">{formatCurrency(order.subtotalMinor)}</span>
                  </div>
                  {order.discountMinor > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-content-secondary font-medium">Discount</span>
                      <span className="text-danger-text font-bold">-{formatCurrency(order.discountMinor)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-content-secondary font-medium">Shipping ({order.shippingMethod || 'Standard'})</span>
                    <span className="text-content-primary font-bold">{formatCurrency(order.shippingMinor)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-content-secondary font-medium">Tax</span>
                    <span className="text-content-primary font-bold">{formatCurrency(order.taxMinor)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-border">
                    <span className="font-extrabold text-content-primary">Total</span>
                    <span className="font-extrabold text-brand-600">{formatCurrency(order.totalMinor)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest mb-6 border-b border-border pb-4">Order Timeline</h3>
                <div className="space-y-4">
                  {timeline?.map((event: any, idx: number) => (
                    <div key={event._id || idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-brand-600 mt-1.5" />
                        {idx !== timeline.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
                      </div>
                      <div className="pb-4">
                        <div className="text-sm font-bold text-content-primary">{event.event.replace(/_/g, ' ')}</div>
                        <div className="text-xs text-content-secondary mt-1">
                          {new Date(event.createdAt).toLocaleString()} • {event.actorUserId ? 'User' : 'System'}
                        </div>
                        {event.metadata?.reason && (
                          <div className="text-xs italic text-content-muted mt-1">&quot;{event.metadata.reason}&quot;</div>
                        )}
                      </div>
                    </div>
                  ))}
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
                    <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                      {order.customerSnapshot?.name?.substring(0,2).toUpperCase() || 'NA'}
                    </div>
                    <div>
                      {order.customerId ? (
                        <Link href={`/customers/${order.customerId}`} className="font-bold text-content-primary hover:text-brand-600 cursor-pointer transition-colors">
                          {order.customerSnapshot?.name || 'Unknown'}
                        </Link>
                      ) : (
                        <div className="font-bold text-content-primary">{order.customerSnapshot?.name || 'Unknown'}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-border">
                    {order.customerSnapshot?.email && (
                      <div className="flex items-center gap-3 text-sm text-content-secondary">
                        <Mail className="w-4 h-4 text-content-muted shrink-0" />
                        <a href={`mailto:${order.customerSnapshot.email}`} className="hover:text-brand-600 transition-colors">{order.customerSnapshot.email}</a>
                      </div>
                    )}
                    {order.customerSnapshot?.phone && (
                      <div className="flex items-center gap-3 text-sm text-content-secondary">
                        <Phone className="w-4 h-4 text-content-muted shrink-0" />
                        <a href={`tel:${order.customerSnapshot.phone}`} className="hover:text-brand-600 transition-colors">{order.customerSnapshot.phone}</a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {order.shippingAddressSnapshot && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest mb-6 border-b border-border pb-4">Shipping</h3>
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-bold text-content-primary mb-2">
                        <MapPin className="w-4 h-4 text-brand-600" /> Address
                      </div>
                      <div className="text-sm text-content-secondary font-medium pl-6 leading-relaxed">
                        {order.customerSnapshot?.name}<br />
                        {order.shippingAddressSnapshot.street}<br />
                        {order.shippingAddressSnapshot.city}, {order.shippingAddressSnapshot.state} {order.shippingAddressSnapshot.postalCode}<br />
                        {order.shippingAddressSnapshot.country}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm font-bold text-content-primary mb-2">
                        <Truck className="w-4 h-4 text-brand-600" /> Method
                      </div>
                      <div className="text-sm text-content-secondary font-medium pl-6">
                        {order.channel || 'Standard'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
