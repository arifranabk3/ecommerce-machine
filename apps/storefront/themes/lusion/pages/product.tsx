'use client';

import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { ProductCard } from '../components/ProductCard';
import { Star, Heart, Share2, Plus, Minus, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LusionProduct({ store, themeConfig }: { store: any, themeConfig: any }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Related products mock
  const RELATED = [
    { id: '2', name: 'Apple Watch Series 9', price: 399.00, category: 'Wearables', image: '' },
    { id: '7', name: 'Bose QuietComfort Earbuds II', price: 299.00, category: 'Audio', image: '' },
    { id: '8', name: 'Oura Ring Gen3', price: 299.00, category: 'Wearables', image: '' },
    { id: '4', name: 'Keychron K2 Wireless', price: 79.00, category: 'Accessories', image: '' },
  ];

  return (
    <MainLayout store={store} themeConfig={themeConfig}>
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm font-medium text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-blue-600 transition">Audio</Link>
          <span>/</span>
          <span className="text-gray-900">Sony WH-1000XM5</span>
        </div>
      </div>

      {/* Main Product Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left: Gallery */}
          <div className="w-full lg:w-1/2 flex gap-4">
            <div className="flex flex-col gap-4 w-20 shrink-0">
              <div className="aspect-square bg-gray-100 rounded border-2 border-blue-600 cursor-pointer"></div>
              <div className="aspect-square bg-gray-100 rounded border-2 border-transparent hover:border-blue-300 cursor-pointer transition"></div>
              <div className="aspect-square bg-gray-100 rounded border-2 border-transparent hover:border-blue-300 cursor-pointer transition"></div>
              <div className="aspect-square bg-gray-100 rounded border-2 border-transparent hover:border-blue-300 cursor-pointer transition"></div>
            </div>
            <div className="flex-1 aspect-[4/5] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              Product Image Main
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Audio</span>
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
              Sony WH-1000XM5 Wireless Noise Canceling Headphones
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-400 gap-0.5">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current text-gray-300" />
              </div>
              <span className="text-sm font-semibold text-gray-500 underline cursor-pointer">128 Reviews</span>
            </div>

            <div className="flex items-end gap-3 mb-8">
              <span className="text-3xl font-black text-blue-600">$348.00</span>
              <span className="text-lg font-semibold text-gray-400 line-through mb-1">$398.00</span>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded mb-1.5 ml-2">Save $50</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              The WH-1000XM5 headphones rewrite the rules for distraction-free listening. 
              Two processors control 8 microphones for unprecedented noise cancellation and 
              exceptional call quality. With a newly developed driver, DSEE – Extreme and 
              Hires audio support, these headphones provide awe-inspiring audio quality.
            </p>

            <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-6">
              {/* Color Selection */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex justify-between">
                  Color: <span className="text-gray-500 font-medium">Silver</span>
                </h4>
                <div className="flex gap-3">
                  <button className="w-8 h-8 rounded-full bg-[#E5E5E5] ring-2 ring-offset-2 ring-blue-600"></button>
                  <button className="w-8 h-8 rounded-full bg-[#111111] ring-2 ring-offset-2 ring-transparent hover:ring-gray-300 transition"></button>
                  <button className="w-8 h-8 rounded-full bg-[#1A237E] ring-2 ring-offset-2 ring-transparent hover:ring-gray-300 transition"></button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 text-center font-bold text-gray-900">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button className="flex-1 bg-blue-600 text-white h-14 rounded-lg font-black tracking-wide text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                ADD TO CART
              </button>
              <button className="w-14 h-14 rounded-lg border border-gray-300 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-600 transition">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-gray-50 p-3 rounded">
                <Truck className="w-5 h-5 text-blue-600" /> Free Shipping
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-gray-50 p-3 rounded">
                <RotateCcw className="w-5 h-5 text-blue-600" /> 30-Day Return
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600 bg-gray-50 p-3 rounded">
                <ShieldCheck className="w-5 h-5 text-blue-600" /> 1 Year Warranty
              </div>
            </div>

            {/* Meta */}
            <div className="text-sm font-medium space-y-2">
              <div className="flex">
                <span className="w-24 text-gray-900">SKU:</span>
                <span className="text-gray-500">SONY-WH1000-SLV</span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-900">Availability:</span>
                <span className="text-green-600">In Stock (34 items)</span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-900">Share:</span>
                <span className="text-gray-500 flex items-center gap-3 cursor-pointer hover:text-blue-600 transition">
                  <Share2 className="w-4 h-4" /> Click to copy link
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="border-t border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-12 border-b-2 border-transparent">
            <button 
              onClick={() => setActiveTab('description')}
              className={`py-6 text-lg font-bold border-b-2 transition-colors ${activeTab === 'description' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('details')}
              className={`py-6 text-lg font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              Additional Info
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`py-6 text-lg font-bold border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              Reviews (128)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activeTab === 'description' && (
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p>Industry-leading noise cancellation optimized to you. The WH-1000XM5 headphones with Multiple Noise Sensor technology and Auto NC Optimizer.</p>
            <ul>
              <li>Industry-leading noise cancellation optimized to you.</li>
              <li>Magnificent Sound, engineered to perfection.</li>
              <li>Crystal clear hands-free calling.</li>
              <li>Up to 30-hour battery life with quick charging.</li>
              <li>Ultra-comfortable, lightweight design with soft fit leather.</li>
            </ul>
          </div>
        )}
        {activeTab === 'details' && (
          <div className="text-gray-600 text-center py-12 font-medium">Additional Specifications Table would go here.</div>
        )}
        {activeTab === 'reviews' && (
          <div className="text-gray-600 text-center py-12 font-medium">Customer Reviews List would go here.</div>
        )}
      </div>

      {/* Related Products */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-gray-900 mb-10 text-center">You May Also Like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {RELATED.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

    </MainLayout>
  );
}
