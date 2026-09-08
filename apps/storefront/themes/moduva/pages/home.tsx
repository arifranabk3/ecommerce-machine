import React from 'react';

export default function ModuvaHome({ store }: { store: any }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-6 px-12 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tighter uppercase">{store.name}</h1>
        <nav className="flex gap-8 text-sm font-medium">
          <a href="/" className="text-black">Home</a>
          <a href="/shop" className="text-gray-500 hover:text-black transition">Shop</a>
          <a href="/cart" className="text-gray-500 hover:text-black transition">Cart</a>
        </nav>
      </header>
      
      <main className="px-12 py-24">
        <div className="max-w-4xl">
          <h2 className="text-6xl font-light tracking-tight leading-tight mb-6">
            Minimalist Fashion <br />
            <span className="font-semibold">Reimagined.</span>
          </h2>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl">
            Welcome to the Moduva Theme. A highly optimized, isolated theme environment.
          </p>
          <a href="/shop" className="bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition">
            Explore Collection
          </a>
        </div>
      </main>
    </div>
  );
}
