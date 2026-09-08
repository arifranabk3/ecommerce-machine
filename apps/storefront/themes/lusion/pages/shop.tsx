import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { ProductCard } from '../components/ProductCard';
import { Filter, ChevronDown, Check } from 'lucide-react';

const PRODUCTS = [
  { id: '1', name: 'Sony WH-1000XM5', price: 348.00, category: 'Audio', badge: 'new' as const, image: '' },
  { id: '2', name: 'Apple Watch Series 9', price: 399.00, compareAtPrice: 429.00, category: 'Wearables', badge: 'sale' as const, image: '' },
  { id: '3', name: 'DJI Mini 3 Pro', price: 759.00, category: 'Drones', image: '' },
  { id: '4', name: 'Keychron K2 Wireless', price: 79.00, category: 'Accessories', badge: 'sold-out' as const, image: '' },
  { id: '5', name: 'Logitech MX Master 3S', price: 99.00, category: 'Accessories', image: '' },
  { id: '6', name: 'Samsung Odyssey G9', price: 1299.00, compareAtPrice: 1499.00, category: 'Monitors', badge: 'sale' as const, image: '' },
  { id: '7', name: 'Bose QuietComfort Earbuds II', price: 299.00, category: 'Audio', image: '' },
  { id: '8', name: 'Oura Ring Gen3', price: 299.00, category: 'Wearables', image: '' },
];

export default function LusionShop({ store, themeConfig }: { store: any, themeConfig: any }) {
  return (
    <MainLayout store={store} themeConfig={themeConfig}>
      
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Shop All Products</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover our entire collection of premium electronics and accessories. 
            Designed for performance and built to last.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-28 space-y-8">
              
              {/* Categories */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-blue-600">All Products</span>
                    <span className="text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full text-xs">24</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 hover:text-blue-600 cursor-pointer transition">Audio</span>
                    <span className="text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full text-xs">8</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 hover:text-blue-600 cursor-pointer transition">Wearables</span>
                    <span className="text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full text-xs">5</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 hover:text-blue-600 cursor-pointer transition">Accessories</span>
                    <span className="text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full text-xs">11</span>
                  </li>
                </ul>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Price</h3>
                <div className="flex items-center gap-4">
                  <div className="border border-gray-200 rounded p-2 flex-1">
                    <span className="text-xs text-gray-400 block mb-1">From</span>
                    <span className="text-sm font-semibold">$0.00</span>
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="border border-gray-200 rounded p-2 flex-1">
                    <span className="text-xs text-gray-400 block mb-1">To</span>
                    <span className="text-sm font-semibold">$2,000.00</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Status</h3>
                <label className="flex items-center gap-3 mb-3 cursor-pointer">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 transition">
                    <Check className="w-3 h-3 text-white opacity-0" />
                  </div>
                  <span className="text-sm text-gray-600">In Stock (18)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="w-5 h-5 border-2 border-blue-600 bg-blue-600 rounded flex items-center justify-center transition">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-gray-900 font-medium">On Sale (6)</span>
                </label>
              </div>

            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-100 gap-4">
              <div className="text-sm text-gray-500 font-medium">
                Showing 1–8 of 24 results
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 lg:hidden">
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 font-medium hidden sm:block">Sort by:</span>
                  <button className="flex items-center gap-2 text-sm font-semibold text-gray-900 bg-gray-50 px-4 py-2 rounded border border-gray-200">
                    Latest <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-blue-600 transition disabled:opacity-50" disabled>
                  Prev
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded bg-blue-600 text-white font-bold shadow">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-600 font-semibold hover:border-blue-600 hover:text-blue-600 transition">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-600 font-semibold hover:border-blue-600 hover:text-blue-600 transition">
                  3
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-900 font-medium hover:text-blue-600 transition">
                  Next
                </button>
              </nav>
            </div>
          </main>

        </div>
      </div>
    </MainLayout>
  );
}
