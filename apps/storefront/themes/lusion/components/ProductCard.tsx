import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  badge?: 'new' | 'sale' | 'sold-out';
  category: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-gray-100 mb-4 overflow-hidden rounded-sm">
        {/* Badges */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.badge === 'sale' && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                Sale
              </span>
            )}
            {product.badge === 'new' && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                New
              </span>
            )}
            {product.badge === 'sold-out' && (
              <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                Sold Out
              </span>
            )}
          </div>
        )}

        {/* Product Image Placeholder */}
        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
          Product Image
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex justify-center gap-2">
          <button className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-lg">
            <Heart className="w-4 h-4" />
          </button>
          <button className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-lg">
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button className="bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-lg">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="text-center">
        <div className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">
          {product.category}
        </div>
        <Link href={`/product/${product.id}`} className="text-base font-semibold text-gray-900 hover:text-blue-600 transition block mb-1">
          {product.name}
        </Link>
        <div className="flex justify-center items-center gap-2">
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
          <span className="text-sm font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
