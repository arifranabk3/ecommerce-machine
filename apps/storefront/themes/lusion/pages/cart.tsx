'use client';

import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LusionCart({ store, themeConfig }: { store: any, themeConfig: any }) {
  const [items, setItems] = useState([
    { id: '1', name: 'Sony WH-1000XM5', price: 348.00, quantity: 1, image: '', color: 'Silver' },
    { id: '2', name: 'Apple Watch Series 9', price: 399.00, quantity: 2, image: '', color: 'Midnight' },
  ]);

  const updateQuantity = (id: string, newQ: number) => {
    if (newQ < 1) return;
    setItems(items.map(item => item.id === id ? { ...item, quantity: newQ } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 15.00;
  const total = subtotal + shipping;

  return (
    <MainLayout store={store} themeConfig={themeConfig}>
      
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Your Cart</h1>
          <p className="text-gray-500 font-medium">
            You have {items.length} items in your cart.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is currently empty.</h2>
            <Link href="/shop" className="inline-flex bg-blue-600 text-white px-8 py-4 font-bold rounded hover:bg-blue-700 transition shadow">
              Return to Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Cart Items */}
            <div className="flex-1">
              <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-bold text-gray-900 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              <div className="divide-y divide-gray-100">
                {items.map(item => (
                  <div key={item.id} className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    
                    <div className="col-span-1 sm:col-span-6 flex gap-4 items-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
                        Image
                      </div>
                      <div>
                        <Link href={`/product/${item.id}`} className="font-bold text-gray-900 hover:text-blue-600 transition block mb-1">
                          {item.name}
                        </Link>
                        <div className="text-sm text-gray-500 font-medium">Color: {item.color}</div>
                        
                        {/* Mobile controls */}
                        <div className="sm:hidden mt-4 flex items-center justify-between w-full">
                          <div className="font-bold text-blue-600">${item.price.toFixed(2)}</div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-200 rounded">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:text-blue-600"><Minus className="w-3 h-3"/></button>
                              <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-blue-600"><Plus className="w-3 h-3"/></button>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:block col-span-2 text-center font-bold text-gray-900">
                      ${item.price.toFixed(2)}
                    </div>

                    <div className="hidden sm:flex col-span-2 justify-center">
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-gray-500 hover:bg-gray-50 hover:text-blue-600 transition">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="hidden sm:flex col-span-2 justify-end items-center gap-4">
                      <span className="font-bold text-blue-600 text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded font-medium text-sm w-full sm:w-auto">
                  <ShieldCheck className="w-5 h-5" /> All returns are free within 30 days.
                </div>
                <button className="text-sm font-bold text-gray-900 hover:text-blue-600 uppercase tracking-widest transition w-full sm:w-auto text-right">
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 sticky top-28">
                <h3 className="text-xl font-black text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-semibold text-green-600">Free</span>
                    ) : (
                      <span className="font-semibold text-gray-900">${shipping.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes</span>
                    <span className="font-semibold text-gray-900">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-3xl font-black text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white h-14 rounded-lg font-black tracking-wide text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 mb-4">
                  PROCEED TO CHECKOUT
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <Link href="/shop" className="w-full flex items-center justify-center text-sm font-bold text-blue-600 hover:text-blue-800 transition">
                  Continue Shopping
                </Link>

              </div>
            </div>

          </div>
        )}
      </div>

    </MainLayout>
  );
}
