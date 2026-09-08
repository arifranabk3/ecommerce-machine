import React from 'react';

export default function LusionHome({ store }: { store: any }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-blue-600 flex items-center justify-center font-bold rounded">L</div>
          <h1 className="text-xl font-bold">{store.name}</h1>
        </div>
        <nav className="flex gap-6 text-sm font-semibold">
          <a href="/" className="hover:text-blue-200">Home</a>
          <a href="/shop" className="hover:text-blue-200">Products</a>
          <a href="/cart" className="hover:text-blue-200">Cart</a>
        </nav>
      </header>
      
      <main className="px-8 py-16 text-center">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
          Next-Gen Electronics Store
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          Welcome to the Lusion Theme. A vibrant, tech-focused isolated theme environment.
        </p>
        <div className="flex justify-center gap-4">
          <a href="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Shop Now
          </a>
          <a href="/categories" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition border border-gray-200">
            Browse Categories
          </a>
        </div>
      </main>
    </div>
  );
}
