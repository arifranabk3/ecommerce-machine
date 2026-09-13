'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeft,
  Monitor,
  Smartphone,
  CheckCircle2,
  Share2,
  Code
} from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ThemePreviewPage() {
  const params = useParams();
  const themeId = params.id as string;
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-950 border-b border-slate-800 text-slate-300">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/themes" className="hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-4 w-px bg-slate-700"></div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight capitalize">{themeId.replace('theme_', '')}</span>
              <span className="ml-2 px-1.5 py-0.5 bg-brand-500/20 text-brand-400 text-[10px] font-bold rounded uppercase tracking-wider">Preview Mode</span>
            </div>
          </div>
          
          {/* Device Toggles */}
          <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800">
            <button 
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-md transition-colors ${device === 'desktop' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-md transition-colors ${device === 'mobile' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button variant="primary" size="sm">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Publish Theme
            </Button>
          </div>
        </div>
      </header>

      {/* Preview Area */}
      <main className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div className={`transition-all duration-500 ease-in-out border-4 border-slate-800 bg-white shadow-2xl rounded-xl overflow-hidden
          ${device === 'desktop' ? 'w-full max-w-[1280px] h-full max-h-[800px]' : 'w-[375px] h-[812px]'}
        `}>
          {/* Mock Browser Bar for Desktop */}
          {device === 'desktop' && (
            <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="mx-4 flex-1 h-6 bg-white rounded border border-slate-200 flex items-center justify-center">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <span className="text-emerald-500">🔒</span> preview.sellzy.store
                </span>
              </div>
            </div>
          )}
          
          {/* Iframe Placeholder */}
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
            <Code className="w-12 h-12 mb-4 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-700">Theme Storefront Preview</h2>
            <p className="text-sm font-medium mt-2 max-w-sm text-center">In a full implementation, this area will render the actual storefront Next.js app in an iframe, applying the selected theme configuration.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
