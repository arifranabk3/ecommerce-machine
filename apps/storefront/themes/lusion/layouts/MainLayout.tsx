import React from 'react';
import { ShoppingBag, Search, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { StoreContext } from '@/storefront';
import { ThemeConfig } from '../../index';

interface MainLayoutProps {
  children: React.ReactNode;
  store: StoreContext;
  themeConfig: ThemeConfig;
}

export function MainLayout({ children, store, themeConfig }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: themeConfig.colors.bg }}>
      {/* Top Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 text-center font-medium tracking-wide">
        FREE SHIPPING ON ALL ORDERS OVER $50.00
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button type="button" className="text-gray-900 hover:text-blue-600 p-2">
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start">
              <Link href="/" className="text-3xl font-black tracking-tighter text-blue-600 uppercase">
                {store.name}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:space-x-10 items-center h-full">
              <Link href="/" className="text-sm font-semibold text-gray-900 hover:text-blue-600 h-full flex items-center border-b-2 border-transparent hover:border-blue-600 transition-all">
                Home
              </Link>
              <Link href="/shop" className="text-sm font-semibold text-gray-900 hover:text-blue-600 h-full flex items-center border-b-2 border-transparent hover:border-blue-600 transition-all">
                Shop
              </Link>
              <Link href="/categories" className="text-sm font-semibold text-gray-900 hover:text-blue-600 h-full flex items-center border-b-2 border-transparent hover:border-blue-600 transition-all">
                Categories
              </Link>
              <Link href="/blog" className="text-sm font-semibold text-gray-900 hover:text-blue-600 h-full flex items-center border-b-2 border-transparent hover:border-blue-600 transition-all">
                Blog
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              <button className="text-gray-900 hover:text-blue-600 transition hidden sm:block">
                <Search className="h-5 w-5" />
              </button>
              <Link href="/login" className="text-gray-900 hover:text-blue-600 transition hidden sm:block">
                <User className="h-5 w-5" />
              </Link>
              <Link href="/cart" className="text-gray-900 hover:text-blue-600 transition relative flex items-center">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="text-2xl font-black tracking-tighter text-blue-600 uppercase mb-6 inline-block">
                {store.name}
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Premium quality electronics and digital lifestyle products. Designed for the modern world.
              </p>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-bold mb-6 tracking-wide">SHOP</h4>
              <ul className="space-y-4">
                <li><Link href="/shop" className="text-gray-500 hover:text-blue-600 text-sm transition">All Products</Link></li>
                <li><Link href="/categories/electronics" className="text-gray-500 hover:text-blue-600 text-sm transition">Electronics</Link></li>
                <li><Link href="/categories/accessories" className="text-gray-500 hover:text-blue-600 text-sm transition">Accessories</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-900 font-bold mb-6 tracking-wide">SUPPORT</h4>
              <ul className="space-y-4">
                <li><Link href="/faq" className="text-gray-500 hover:text-blue-600 text-sm transition">FAQ</Link></li>
                <li><Link href="/shipping" className="text-gray-500 hover:text-blue-600 text-sm transition">Shipping & Returns</Link></li>
                <li><Link href="/contact" className="text-gray-500 hover:text-blue-600 text-sm transition">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-900 font-bold mb-6 tracking-wide">NEWSLETTER</h4>
              <p className="text-gray-500 text-sm mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              <form className="flex border border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-blue-600">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-3 text-sm outline-none"
                />
                <button className="bg-blue-600 text-white px-6 py-3 font-bold text-sm hover:bg-blue-700 transition">
                  SUBSCRIBE
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2026 {store.name}. All Rights Reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm font-medium">Secure Payments</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
