'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { useApiQuery } from '@/lib/api-client';
import { 
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Users,
  Download,
  Calendar,
  ChevronDown,
  RefreshCw,
  Store,
  ArrowUpRight,
  ShoppingCart
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const [dateRange, setDateRange] = useState('30D');

  // Compute dates based on range
  const getDates = () => {
    const end = new Date();
    const start = new Date();
    if (dateRange === '7D') start.setDate(end.getDate() - 7);
    else if (dateRange === '30D') start.setDate(end.getDate() - 30);
    else if (dateRange === '90D') start.setDate(end.getDate() - 90);
    else if (dateRange === '12M') start.setFullYear(end.getFullYear() - 1);
    
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  };

  const { startDate, endDate } = getDates();
  const queryParams = `startDate=${startDate}&endDate=${endDate}`;

  // Fetch real data
  const { data: overviewData, mutate: refetchOverview, isLoading: loadingOverview } = useApiQuery<any>(`/api/v1/analytics/overview?${queryParams}`);
  const { data: customerData, mutate: refetchCustomers, isLoading: loadingCustomers } = useApiQuery<any>(`/api/v1/analytics/customers?${queryParams}`);
  const { data: productsData, mutate: refetchProducts, isLoading: loadingProducts } = useApiQuery<any>(`/api/v1/products?limit=5`);

  const overview = overviewData || {};
  const customers = customerData || {};
  const topProducts = productsData?.items || productsData?.data?.items || productsData?.data || [];

  const handleRefresh = () => {
    refetchOverview();
    refetchCustomers();
    refetchProducts();
  };

  const formatCurrency = (minor: number | undefined) => {
    if (minor === undefined) return 'PKR 0';
    return `PKR ${(minor / 100).toLocaleString()}`;
  };

  const isLoading = loadingOverview || loadingCustomers || loadingProducts;

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-fade-in">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analytics Workspace</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Comprehensive insights and performance metrics for your business.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100">
              <Store className="w-4 h-4 mr-2 text-slate-500" />
              All Stores
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {['7D', '30D', '90D', '12M'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setDateRange(p)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${dateRange === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            <Button variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100">
              <Calendar className="w-4 h-4 mr-2 text-slate-500" />
              Custom Date
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <Button 
              variant="outline" 
              className={`bg-white border-slate-200 text-slate-700 hover:bg-slate-50 ${isLoading ? 'opacity-50' : ''}`} 
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* TOP KPI ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Total Revenue</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(overview.netSalesMinor)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Total Orders</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {(overview.totalOrders || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Average Order Value</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(overview.aovMinor)}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Contribution Profit</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(overview.contributionProfitMinor)}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-300 border-slate-200/60 group md:col-span-3 xl:col-span-1">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-500 mb-1">Total Customers</p>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {(customers.totalCustomers || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RECENT PRODUCTS TABLE */}
        <Card className="!p-0 overflow-hidden shadow-sm border-slate-200">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white">
            <h3 className="text-base font-extrabold text-slate-900">Recent Products</h3>
            <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700">View All Products</Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th className="pl-6 font-bold text-slate-600">Product</Th>
                  <Th className="font-bold text-slate-600">Category</Th>
                  <Th className="text-right font-bold text-slate-600">Stock</Th>
                  <Th className="text-right font-bold text-slate-600">Price</Th>
                  <Th className="text-right pr-6 font-bold text-slate-600">Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {topProducts.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} className="text-center py-8 text-slate-500">No products found</Td>
                  </Tr>
                ) : (
                  topProducts.map((item: any) => (
                    <Tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                      <Td className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                            <ShoppingCart className="w-4 h-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{item.title}</p>
                            <p className="text-xs font-medium text-slate-500 font-mono mt-0.5">{item.sku || 'N/A'}</p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <Badge variant="outline" className="bg-white text-slate-600 font-semibold text-xs border-slate-200">
                          {item.categoryId?.name || 'Uncategorized'}
                        </Badge>
                      </Td>
                      <Td className="text-right font-bold text-slate-700">
                        {item.inventory?.available || 0}
                      </Td>
                      <Td className="text-right font-extrabold text-slate-900">
                        {formatCurrency(item.pricing?.priceMinor)}
                      </Td>
                      <Td className="text-right pr-6">
                        <Badge 
                          variant={item.status === 'ACTIVE' ? 'success' : item.status === 'DRAFT' ? 'warning' : 'neutral'}
                          className="text-[10px]"
                        >
                          {item.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
