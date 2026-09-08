import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Zap, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const FEATURED_PRODUCTS = [
  { id: '1', name: 'Sony WH-1000XM5', price: 348.00, category: 'Audio', badge: 'new' as const, image: '' },
  { id: '2', name: 'Apple Watch Series 9', price: 399.00, compareAtPrice: 429.00, category: 'Wearables', badge: 'sale' as const, image: '' },
  { id: '3', name: 'DJI Mini 3 Pro', price: 759.00, category: 'Drones', image: '' },
  { id: '4', name: 'Keychron K2 Wireless', price: 79.00, category: 'Accessories', badge: 'sold-out' as const, image: '' },
];

export default function LusionHome({ store, themeConfig }: { store: any, themeConfig: any }) {
  return (
    <MainLayout store={store} themeConfig={themeConfig}>
      
      {/* Hero Section */}
      <section className="relative bg-slate-100 h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex">
          <div className="max-w-xl">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">New Arrivals 2026</span>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              The Future of <br/>
              <span className="text-blue-600">Smart Audio</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-md">
              Experience the next generation of noise cancellation with our latest wireless headphones collection.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 group">
              Shop Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Free Global Delivery</h3>
                <p className="text-sm text-gray-500">On all orders over $150</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Secure Payment</h3>
                <p className="text-sm text-gray-500">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">24/7 Support</h3>
                <p className="text-sm text-gray-500">Dedicated online support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Trending Now</h2>
              <p className="text-gray-500">Top viewed and hyped products this week.</p>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-2 font-bold text-blue-600 hover:text-blue-800 transition">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-10 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category 1 */}
            <Link href="/category/audio" className="group relative h-[300px] rounded-2xl overflow-hidden block">
              <div className="absolute inset-0 bg-slate-800"></div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                <h3 className="text-2xl font-bold text-white mb-2">Smart Audio</h3>
                <span className="text-white/80 font-medium text-sm flex items-center gap-1 group-hover:text-white transition">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
            
            {/* Category 2 */}
            <Link href="/category/wearables" className="group relative h-[300px] rounded-2xl overflow-hidden block">
              <div className="absolute inset-0 bg-blue-800"></div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                <h3 className="text-2xl font-bold text-white mb-2">Wearables</h3>
                <span className="text-white/80 font-medium text-sm flex items-center gap-1 group-hover:text-white transition">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Category 3 */}
            <Link href="/category/gaming" className="group relative h-[300px] rounded-2xl overflow-hidden block md:hidden lg:block">
              <div className="absolute inset-0 bg-purple-800"></div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                <h3 className="text-2xl font-bold text-white mb-2">Gaming</h3>
                <span className="text-white/80 font-medium text-sm flex items-center gap-1 group-hover:text-white transition">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </MainLayout>
  );
}
