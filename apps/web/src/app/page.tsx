'use client';
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Box,
  CheckCircle2,
  Package,
  Calendar,
  ChevronDown,
  ArrowRight,
  Activity,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { useApiQuery } from '@/lib/api-client';

export default function DashboardPage() {
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useApiQuery<any>('/api/v1/analytics/overview');
  const { data: customersStats } = useApiQuery<any>('/api/v1/analytics/customers');
  const { data: customersData, isLoading: customersLoading, error: customersError } = useApiQuery<any>('/api/v1/customers?limit=5');
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useApiQuery<any>('/api/v1/orders?limit=5');
  const { data: productsData, isLoading: productsLoading, error: productsError } = useApiQuery<any>('/api/v1/products?limit=5');
  const { data: inventoryHealth, isLoading: inventoryLoading, error: inventoryError } = useApiQuery<any>('/api/v1/analytics/inventory');
  const { data: automationData } = useApiQuery<any>('/api/v1/analytics/automation');
  const { data: financeOverview, error: financeError } = useApiQuery<any>('/api/v1/finance');

  const ordersList = ordersData?.items || ordersData?.data?.items || ordersData?.data || [];
  const productsList = productsData?.items || productsData?.data?.items || productsData?.data || [];
  const customersList = customersData?.items || customersData?.data?.items || customersData?.data || [];

  const formatCurrency = (minor: number | undefined) => {
    if (minor === undefined) return 'Rs 0';
    return `Rs ${(minor / 100).toLocaleString()}`;
  };

  const chartData = overview?.salesChartData || [];

  const inventoryData = inventoryHealth ? [
    { name: 'Available', value: inventoryHealth.totalAvailableStock || 0, color: '#10B981' },
    { name: 'Reserved', value: inventoryHealth.totalReservedStock || 0, color: '#F59E0B' },
  ] : [];
  
  const totalInventoryItems = inventoryHealth?.totalOnHandStock || 0;

  const vendorPayables = financeOverview?.vendorPayablesMinor || 0;
  const availableCash = financeOverview?.availableCashMinor || 0;
  const hasCashWarning = vendorPayables > availableCash;

  return (
    <DashboardLayout>
      <div className="max-w-[1440px] mx-auto space-y-6 pb-12 animate-fade-in p-2 md:p-6">
        
        {/* Header & Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-content-primary tracking-tight">Good morning, Arif</h1>
            <p className="text-content-secondary text-base mt-1.5 font-medium">Here&apos;s what&apos;s happening with your store today.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="hidden md:block text-right mr-4">
              <p className="text-[13px] font-bold text-content-primary italic">&quot;Build. Sell. Grow.&quot;</p>
              <p className="text-[11px] text-content-secondary">— Sellzy</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-bold text-content-primary shadow-sm hover:bg-surface-hover transition-colors">
              <Calendar className="w-4 h-4 text-content-secondary" />
              Last 30 days
              <ChevronDown className="w-4 h-4 text-content-secondary ml-2" />
            </button>
          </div>
        </div>

        {/* System Error Alerts */}
        {(overviewError || financeError) && (
          <div className="bg-danger-subtle border border-danger p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-danger-text font-extrabold text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" /> API FETCH ERROR
              </h3>
              <p className="text-danger-text/80 text-xs mt-1 font-medium">
                Unable to fetch live dashboard metrics. Data displayed below may be incomplete.
              </p>
            </div>
            <button onClick={() => window.location.reload()} className="px-3 py-1.5 bg-danger text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90">
              Retry
            </button>
          </div>
        )}

        {/* Critical Alerts */}
        {(hasCashWarning || automationData?.failedRuns > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hasCashWarning && (
              <div className="bg-danger-subtle border border-danger p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-danger-text font-extrabold text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4" /> CRITICAL WARNING
                  </h3>
                  <p className="text-danger-text/80 text-xs mt-1 font-medium">
                    Vendor Payables ({formatCurrency(vendorPayables)}) exceed Available Cash ({formatCurrency(availableCash)}).
                  </p>
                </div>
                <button className="px-3 py-1.5 bg-danger text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90">
                  View Finance
                </button>
              </div>
            )}
            
            {automationData?.failedRuns > 0 && (
              <div className="bg-warning-subtle border border-warning p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-warning-text font-extrabold text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4" /> FAILED AUTOMATIONS
                  </h3>
                  <p className="text-warning-text/80 text-xs mt-1 font-medium">
                    {automationData.failedRuns} automation run(s) have failed and require attention.
                  </p>
                </div>
                <button className="px-3 py-1.5 bg-warning text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90">
                  View Failures
                </button>
              </div>
            )}
          </div>
        )}

        {/* High-Level KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Revenue', value: overviewLoading ? '...' : formatCurrency(overview?.netSalesMinor), trend: `${overview?.revenueGrowth > 0 ? '+' : ''}${overview?.revenueGrowth || 0}%`, up: (overview?.revenueGrowth || 0) >= 0, icon: TrendingUp, color: 'text-brand-600', bg: 'bg-brand-50' },
            { label: 'Orders', value: overviewLoading ? '...' : (overview?.totalOrders?.toLocaleString() || '0'), trend: `${overview?.orderGrowth > 0 ? '+' : ''}${overview?.orderGrowth || 0}%`, up: (overview?.orderGrowth || 0) >= 0, icon: ShoppingBag, color: 'text-accent', bg: 'bg-accent-subtle' },
            { label: 'Customers', value: customersStats === undefined ? '...' : (customersStats?.totalCustomers?.toLocaleString() || '0'), trend: `${customersStats?.customerGrowth > 0 ? '+' : ''}${customersStats?.customerGrowth || 0}%`, up: (customersStats?.customerGrowth || 0) >= 0, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
            { label: 'Delivery Success', value: overviewLoading ? '...' : `${overview?.deliverySuccessRate || 0}%`, trend: `${overview?.deliveryGrowth > 0 ? '+' : ''}${overview?.deliveryGrowth || 0}%`, up: (overview?.deliveryGrowth || 0) >= 0, icon: CheckCircle2, color: 'text-pink-600', bg: 'bg-pink-50' },
            { label: 'Average Order Value', value: overviewLoading ? '...' : formatCurrency(overview?.aovMinor), trend: `${overview?.aovGrowth > 0 ? '+' : ''}${overview?.aovGrowth || 0}%`, up: (overview?.aovGrowth || 0) >= 0, icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <Card key={i} className="hover:border-border-subtle hover:shadow-premium-hover transition-all duration-300 rounded-2xl">
              <CardContent className="p-5 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-content-muted cursor-pointer hover:text-content-secondary" />
                </div>
                <div>
                  <h3 className="text-[12px] font-bold text-content-secondary mb-1">{stat.label}</h3>
                  <div className="text-2xl font-extrabold text-content-primary mb-2 tracking-tight">{stat.value}</div>
                  <div className={`flex items-center text-[12px] font-bold ${stat.up ? 'text-success-text' : 'text-danger-text'}`}>
                    {stat.up ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                    {stat.trend}
                    <span className="text-content-muted font-medium ml-1.5 whitespace-nowrap">vs. previous period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Middle Row (70/30) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          
          {/* Main Revenue Chart */}
          <div className="lg:col-span-7">
            <Card className="h-full rounded-2xl">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-content-primary">Revenue Overview</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-3xl font-extrabold text-content-primary">{overviewLoading ? '...' : formatCurrency(overview?.netSalesMinor)}</span>
                      <div className={`flex items-center text-sm font-bold px-2 py-0.5 rounded-md ${
                        (overview?.revenueGrowth || 0) >= 0 
                          ? 'text-success-text bg-success-subtle' 
                          : 'text-danger-text bg-danger-subtle'
                      }`}>
                        {(overview?.revenueGrowth || 0) >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                        {overview?.revenueGrowth !== undefined ? `${overview.revenueGrowth > 0 ? '+' : ''}${overview.revenueGrowth}%` : '0%'}
                      </div>
                    </div>
                    <p className="text-[13px] font-medium text-content-secondary mt-1">vs. previous 30 days</p>
                  </div>
                  
                  <div className="flex bg-surface-secondary p-1 rounded-xl border border-border">
                    {['7D', '30D', '90D', '12M'].map((period) => (
                      <button
                        key={period}
                        className={`px-4 py-1.5 text-[13px] font-bold rounded-lg transition-colors ${
                          period === '30D' 
                            ? 'bg-surface text-brand-600 shadow-sm border border-border' 
                            : 'text-content-secondary hover:text-content-primary'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="h-[280px] w-full mt-4 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#633BFF" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#633BFF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F3F4F6" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#98A2B3', fontSize: 12, fontWeight: 500 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#98A2B3', fontSize: 12, fontWeight: 500 }}
                        tickFormatter={(value) => `Rs ${value/1000}k`}
                      />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(17,26,58,0.05)', padding: '12px' }}
                        itemStyle={{ color: '#111A3A', fontWeight: 700, fontSize: '14px' }}
                        labelStyle={{ color: '#667085', fontWeight: 500, marginBottom: '6px', fontSize: '13px' }}
                        formatter={(value: any) => [`Rs ${Number(value).toLocaleString()}`, 'Revenue']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="previous" 
                        stroke="#20C7E8" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="transparent" 
                        name="Previous period"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#633BFF" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        name="Current period"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-600"></div>
                    <span className="text-[13px] font-medium text-content-secondary">Current period</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-accent border-dashed"></div>
                    <span className="text-[13px] font-medium text-content-secondary">Previous period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Orders */}
          <div className="lg:col-span-3">
            <Card className="h-full rounded-2xl flex flex-col">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="p-5 border-b border-border flex justify-between items-center">
                  <h3 className="text-base font-bold text-content-primary">Recent Orders</h3>
                  <button className="text-[13px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group">
                    View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
                <div className="divide-y divide-border flex-1 overflow-hidden">
                  {ordersLoading ? (
                    <div className="p-8 text-center text-content-muted text-sm font-medium">Loading orders...</div>
                  ) : ordersList?.length === 0 ? (
                    <div className="p-8 text-center text-content-muted text-sm font-medium">No recent orders found.</div>
                  ) : (
                    ordersList?.map((order: any, i: number) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-hover transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-secondary flex items-center justify-center border border-border shadow-sm group-hover:border-border-subtle transition-colors shrink-0">
                            <ImageIcon className="w-4 h-4 text-content-muted" />
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-content-primary">#{order.orderNumber || order._id.substring(0,8).toUpperCase()}</div>
                            <div className="text-[11px] text-content-secondary mt-0.5 font-medium">{order.itemCount} {order.itemCount === 1 ? 'item' : 'items'} · {formatCurrency(order.totalMinor)}</div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            order.status === 'PAID' || order.status === 'COMPLETED' ? 'bg-success-subtle text-success-text' : 
                            order.status === 'PROCESSING' || order.status === 'CONFIRMED' ? 'bg-brand-50 text-brand-600' :
                            order.status === 'SHIPPED' ? 'bg-accent-subtle text-accent-hover' : 
                            'bg-warning-subtle text-warning-text'
                          }`}>
                            {order.status}
                          </span>
                          <div className="text-[11px] font-medium text-content-muted">Recent</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
        
        {/* Lower Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Top Products */}
          <Card className="rounded-2xl flex flex-col h-[400px]">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-5 border-b border-border flex justify-between items-center shrink-0">
                <h3 className="text-base font-bold text-content-primary">Top Products</h3>
                <button className="text-[13px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group">
                  View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-surface-secondary/50">
                      <th className="py-2.5 px-4 text-[11px] font-bold text-content-secondary uppercase tracking-wider">#</th>
                      <th className="py-2.5 px-4 text-[11px] font-bold text-content-secondary uppercase tracking-wider">Product</th>
                      <th className="py-2.5 px-4 text-[11px] font-bold text-content-secondary uppercase tracking-wider">Status</th>
                      <th className="py-2.5 px-4 text-[11px] font-bold text-content-secondary uppercase tracking-wider text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {productsLoading ? (
                      <tr><td colSpan={4} className="py-8 text-center text-content-muted text-sm font-medium">Loading products...</td></tr>
                    ) : productsList?.length === 0 ? (
                      <tr><td colSpan={4} className="py-8 text-center text-content-muted text-sm font-medium">No products found.</td></tr>
                    ) : (
                      productsList?.map((product: any, i: number) => (
                        <tr key={i} className="hover:bg-surface-hover transition-colors">
                          <td className="py-3 px-4 text-[13px] font-bold text-content-muted">{i + 1}</td>
                          <td className="py-3 px-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border shrink-0 flex items-center justify-center">
                              <ImageIcon className="w-3 h-3 text-content-muted" />
                            </div>
                            <span className="text-[13px] font-bold text-content-primary truncate max-w-[120px] sm:max-w-xs">{product.name}</span>
                          </td>
                          <td className="py-3 px-4 text-[13px] font-medium text-content-secondary">{product.status}</td>
                          <td className="py-3 px-4 text-[13px] font-bold text-content-primary text-right">{formatCurrency(product.priceMinor)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Health */}
          <Card className="rounded-2xl flex flex-col h-[400px]">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-5 border-b border-border flex justify-between items-center shrink-0">
                <h3 className="text-base font-bold text-content-primary">Inventory Health</h3>
              </div>
              <div className="flex-1 flex flex-col justify-center items-center relative p-6">
                <div className="w-full h-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inventoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={4}
                      >
                        {inventoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(17,26,58,0.08)' }}
                        itemStyle={{ color: '#111A3A', fontWeight: 700, fontSize: '13px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-content-primary leading-none">{totalInventoryItems.toLocaleString()}</span>
                    <span className="text-[11px] font-bold text-content-secondary uppercase tracking-wider mt-1">Total Items</span>
                  </div>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-y-3 mt-4">
                  {inventoryData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[12px] font-medium text-content-secondary">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-surface-secondary border-t border-border flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-content-secondary" />
                  <span className="text-[13px] font-bold text-content-secondary">Total Value: {formatCurrency(inventoryHealth?.totalInventoryValueMinor)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Customers */}
          <Card className="rounded-2xl flex flex-col h-[400px]">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-5 border-b border-border flex justify-between items-center shrink-0">
                <h3 className="text-base font-bold text-content-primary">Recent Customers</h3>
                <button className="text-[13px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group">
                  View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-5">
                <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  <div className="space-y-6">
                    {customersLoading ? (
                      <div className="p-8 text-center text-content-muted text-sm font-medium">Loading customers...</div>
                    ) : customersList?.length === 0 ? (
                      <div className="p-8 text-center text-content-muted text-sm font-medium">No customers found.</div>
                    ) : (
                      customersList?.map((customer: any, i: number) => {
                        const init = customer.firstName ? customer.firstName.substring(0, 1) + (customer.lastName ? customer.lastName.substring(0, 1) : '') : 'CU';
                        return (
                          <div key={i} className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-surface-secondary border border-border flex items-center justify-center shadow-sm z-10 shrink-0 relative">
                                <span className="text-[12px] font-bold text-content-primary uppercase">{init}</span>
                              </div>
                              <div>
                                <p className="text-[13px] font-bold text-content-primary leading-tight">{customer.firstName} {customer.lastName}</p>
                                <p className="text-[12px] text-content-secondary mt-0.5">{customer.email}</p>
                              </div>
                            </div>
                            <div className="text-[11px] font-bold text-content-muted whitespace-nowrap ml-4">
                              {new Date(customer.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Bottom Performance Banner */}
        <div className="mt-8 bg-gradient-to-r from-[#633BFF] to-[#6D45FF] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-premium relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-extrabold text-white mb-2">Your store is performing great!</h2>
            <p className="text-brand-100 font-medium text-sm md:text-base">
              You&apos;re up <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-md">{overview?.revenueGrowth || 0}%</span> compared to last month. Keep it up!
            </p>
          </div>
          <button className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-600 rounded-xl text-sm font-bold shadow-lg hover:bg-surface-hover transition-all active:scale-95 whitespace-nowrap">
            <Zap className="w-4 h-4 text-brand-600" fill="currentColor" />
            View Detailed Analytics
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}
