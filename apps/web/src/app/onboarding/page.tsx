'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Building2,
  Store,
  Globe,
  Coins,
  Palette,
  Package,
  CreditCard,
  Truck,
  Puzzle,
  Link as LinkIcon,
  Rocket,
  User,
  Upload,
  Search,
  Check,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Mail,
  Activity
} from 'lucide-react';
import { useApiQuery, useApiMutation } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id: 'account', title: 'Account', icon: User },
  { id: 'business', title: 'Business', icon: Building2 },
  { id: 'store', title: 'Store', icon: Store },
  { id: 'country', title: 'Country', icon: Globe },
  { id: 'currency', title: 'Currency', icon: Coins },
  { id: 'theme', title: 'Theme', icon: Palette },
  { id: 'products', title: 'Products', icon: Package },
  { id: 'payments', title: 'Payments', icon: CreditCard },
  { id: 'shipping', title: 'Shipping', icon: Truck },
  { id: 'integrations', title: 'Integrations', icon: Puzzle },
  { id: 'domain', title: 'Domain', icon: LinkIcon },
  { id: 'launch', title: 'Launch', icon: Rocket },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set(['account']));
  const [isLaunched, setIsLaunched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: user, isLoading } = useApiQuery<any>('/api/v1/auth/me');
  const { trigger: provisionTenant, isMutating: isProvisioning } = useApiMutation('/api/v1/tenant/provision');

  const [formData, setFormData] = useState({
    businessName: '',
    storeName: '',
    storeSlug: '',
    country: 'Pakistan',
    currency: 'PKR',
    theme: null as any,
  });

  const handleNext = () => {
    const stepId = STEPS[currentStepIndex].id;
    setCompletedSteps(prev => new Set(Array.from(prev).concat(stepId)));
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(curr => curr + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(curr => curr - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleLaunch = async () => {
    setErrorMsg('');
    try {
      const res: any = await provisionTenant({
        method: 'POST',
        body: {
          businessName: formData.businessName,
          storeName: formData.storeName,
          storeSlug: formData.storeSlug,
          country: formData.country,
          currency: formData.currency,
          themeId: formData.theme?.id
        }
      });
      // Set local storage store id context
      if (res?.store?.storeId) {
        localStorage.setItem('sellzy_store_id', res.store.storeId);
      }
      
      const stepId = STEPS[currentStepIndex].id;
      setCompletedSteps(prev => new Set(Array.from(prev).concat(stepId)));
      setIsLaunched(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to provision store');
    }
  };

  const currentStep = STEPS[currentStepIndex];

  if (isLaunched) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="max-w-2xl w-full text-center">
          <div className="w-24 h-24 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border-4 border-brand-100 shadow-sm relative">
            <div className="absolute inset-0 bg-brand-400 rounded-3xl animate-ping opacity-20"></div>
            <Rocket className="w-12 h-12 text-brand-600 relative z-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Your store is live.</h1>
          <p className="text-lg font-medium text-slate-500 mb-10">
            Congratulations, Arif Rana! {formData.storeName || 'Your Store'} has been successfully launched on Sellzy and is now accepting orders.
          </p>
          
          <Card className="shadow-lg border-slate-200 mb-10 text-left bg-white overflow-hidden">
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="bg-slate-800 rounded-md px-3 py-1 text-slate-300 text-xs font-mono flex-1 text-center">
                https://{formData.storeSlug || 'store'}.sellzy.shop
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Theme</p>
                  <p className="font-bold text-slate-900">{formData.theme?.name || 'Dawn Minimal'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Country</p>
                  <p className="font-bold text-slate-900">{formData.country}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Currency</p>
                  <p className="font-bold text-slate-900">{formData.currency}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <Badge variant="success" className="bg-emerald-50 text-emerald-700 font-bold border-emerald-100 px-2 py-0.5 text-xs">Accepting Orders</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-6 px-8 shadow-md w-full sm:w-auto text-base" onClick={() => router.push('/')}>
              Go to Dashboard
            </Button>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 font-bold py-6 px-8 shadow-sm w-full sm:w-auto text-base hover:bg-slate-50" onClick={() => window.open(`http://${formData.storeSlug}.localhost:3000`, '_blank')}>
              View Storefront
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg leading-none mt-[-2px]">S</span>
            </div>
            <span className="font-extrabold text-slate-900 text-xl tracking-tight hidden sm:block">Sellzy</span>
            <div className="h-5 w-px bg-slate-300 mx-2 hidden sm:block"></div>
            <span className="font-bold text-slate-500 text-sm hidden sm:block">Setup your store</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Owner</p>
              <p className="text-sm font-bold text-slate-900">{user?.name || 'Loading...'}</p>
            </div>
            <div className="w-10 h-10 bg-brand-50 text-brand-700 rounded-full flex items-center justify-center font-bold border border-brand-100 uppercase">
              {user?.name?.substring(0, 2) || 'US'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-8 lg:gap-12 relative animate-in fade-in duration-300">
        
        {/* Sidebar Progress (Desktop) */}
        <div className="hidden md:block w-64 shrink-0 sticky top-24 h-max">
          <div className="mb-6">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Onboarding Progress</h2>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-brand-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(completedSteps.size / STEPS.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-2">{Math.round((completedSteps.size / STEPS.length) * 100)}% Complete</p>
          </div>
          
          <nav className="space-y-1 relative before:absolute before:inset-0 before:ml-[11px] before:top-[16px] before:h-[calc(100%-32px)] before:w-0.5 before:bg-slate-200">
            {STEPS.map((step, idx) => {
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = currentStepIndex === idx;
              const isUpcoming = !isCompleted && !isCurrent;
              
              return (
                <div key={step.id} className="relative flex items-center gap-3 py-2 z-10 group cursor-default">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isCompleted ? 'bg-brand-500 text-white shadow-sm' :
                    isCurrent ? 'bg-white border-2 border-brand-500 ring-4 ring-brand-50' :
                    'bg-slate-100 border border-slate-300'
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : isCurrent ? <div className="w-2 h-2 rounded-full bg-brand-500"></div> : null}
                  </div>
                  <span className={`text-sm font-bold transition-colors ${
                    isCompleted ? 'text-slate-900' :
                    isCurrent ? 'text-brand-600' :
                    'text-slate-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-brand-600 mb-1">Step {currentStepIndex + 1} of {STEPS.length}</p>
            <p className="font-extrabold text-slate-900">{currentStep.title}</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-brand-500"
                strokeDasharray={`${(completedSteps.size / STEPS.length) * 100}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
            <span className="text-[10px] font-bold text-slate-600">{Math.round((completedSteps.size / STEPS.length) * 100)}%</span>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 max-w-3xl">
          <Card className="shadow-lg border-slate-200/60 overflow-hidden bg-white min-h-[500px] flex flex-col">
            <div className="bg-slate-50/50 border-b border-slate-100 p-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-600">
                <currentStep.icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{currentStep.title}</h2>
                <p className="text-sm font-medium text-slate-500">
                  {currentStep.id === 'account' && 'Your account is ready.'}
                  {currentStep.id === 'business' && 'Tell us about your business.'}
                  {currentStep.id === 'store' && 'Name your storefront and claim your URL.'}
                  {currentStep.id === 'country' && 'Your store country determines the default local currency and market settings.'}
                  {currentStep.id === 'currency' && 'Checkout pricing and currency conversion are controlled by Sellzy\'s backend.'}
                  {currentStep.id === 'theme' && 'Choose a premium theme for your storefront. Your products and data remain safe when changing themes.'}
                  {currentStep.id === 'products' && 'Import or add your first products.'}
                  {currentStep.id === 'payments' && 'Configure how you want to get paid.'}
                  {currentStep.id === 'shipping' && 'Set up shipping methods and rates.'}
                  {currentStep.id === 'integrations' && 'Connect essential tools for your business.'}
                  {currentStep.id === 'domain' && 'Set up your custom domain or use a free Sellzy subdomain.'}
                  {currentStep.id === 'launch' && 'Review your setup and launch your store.'}
                </p>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8 flex-1">
              
              {/* ACCOUNT STEP */}
              {currentStep.id === 'account' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex items-start gap-4">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-extrabold text-emerald-900 text-base">Your account is fully secured and ready.</h3>
                      <p className="text-sm font-medium text-emerald-800 mt-1">Logged in as {user?.email || 'Loading...'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Full Name</label>
                      <input type="text" value={user?.name || ''} disabled className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-500 font-medium" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Email Address</label>
                      <input type="email" value={user?.email || ''} disabled className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-500 font-medium" />
                    </div>
                  </div>
                </div>
              )}

              {/* BUSINESS STEP */}
              {currentStep.id === 'business' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Registered Business Name</label>
                    <input type="text" placeholder="e.g. Acme Corp" className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-3 text-slate-900 font-medium transition-all" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Business Type</label>
                      <select className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-3 text-slate-900 font-medium transition-all appearance-none">
                        <option value="">Select type...</option>
                        <option value="sole">Sole Proprietorship</option>
                        <option value="llc">LLC / Private Limited</option>
                        <option value="partnership">Partnership</option>
                        <option value="individual">Individual / Unregistered</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700">Industry</label>
                      <select className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-3 text-slate-900 font-medium transition-all appearance-none">
                        <option value="">Select industry...</option>
                        <option value="fashion">Fashion & Apparel</option>
                        <option value="electronics">Electronics</option>
                        <option value="beauty">Beauty & Cosmetics</option>
                        <option value="home">Home & Furniture</option>
                        <option value="grocery">Grocery & Food</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Business Address (Optional)</label>
                    <textarea rows={3} placeholder="Street address, City, Region" className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-3 text-slate-900 font-medium transition-all"></textarea>
                  </div>
                </div>
              )}

              {/* STORE STEP */}
              {currentStep.id === 'store' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Store Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. My Awesome Store" className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-3 text-slate-900 font-medium transition-all" value={formData.storeName} onChange={e => {
                      const name = e.target.value;
                      setFormData({...formData, storeName: name, storeSlug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')});
                    }} />
                  </div>
                  
                  <div className="space-y-1.5 pt-2">
                    <label className="text-sm font-bold text-slate-700">Store URL / Slug</label>
                    <div className="flex rounded-lg overflow-hidden border border-slate-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                      <div className="bg-slate-50 px-4 py-3 text-slate-500 font-medium border-r border-slate-300">
                        https://
                      </div>
                      <input type="text" className="flex-1 bg-white px-4 py-3 text-slate-900 font-bold focus:outline-none" value={formData.storeSlug} onChange={e => setFormData({...formData, storeSlug: e.target.value})} placeholder="your-store" />
                      <div className="bg-slate-50 px-4 py-3 text-slate-500 font-medium border-l border-slate-300">
                        .sellzy.shop
                      </div>
                    </div>
                    {formData.storeSlug && (
                      <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> URL is available</p>
                    )}
                  </div>
                  
                  <div className="space-y-1.5 pt-2">
                    <label className="text-sm font-bold text-slate-700">Store Description</label>
                    <textarea rows={3} placeholder="Briefly describe what you sell..." className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-3 text-slate-900 font-medium transition-all"></textarea>
                  </div>
                </div>
              )}

              {/* COUNTRY / MARKET STEP */}
              {currentStep.id === 'country' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Primary Country / Market</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-4 text-slate-900 font-extrabold text-lg transition-all appearance-none shadow-sm"
                        value={formData.country}
                        onChange={e => setFormData({...formData, country: e.target.value})}
                      >
                        <option value="Pakistan">Pakistan</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Timezone</p>
                      <p className="font-bold text-blue-900">Asia/Karachi (PKT)</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Locale</p>
                      <p className="font-bold text-blue-900">en-PK / ur-PK</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CURRENCY STEP */}
              {currentStep.id === 'currency' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Primary Currency</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-white border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-4 text-slate-900 font-extrabold text-lg transition-all appearance-none shadow-sm"
                        value={formData.currency}
                        onChange={e => setFormData({...formData, currency: e.target.value})}
                      >
                        <option value="PKR">Pakistani Rupee (PKR)</option>
                        <option value="AED">UAE Dirham (AED)</option>
                        <option value="SAR">Saudi Riyal (SAR)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="GBP">British Pound (GBP)</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <p className="text-sm font-bold text-slate-900 mb-2">Secondary Reference Currency (Optional)</p>
                    <p className="text-xs font-medium text-slate-500 mb-4">Display a secondary currency for international customers.</p>
                    <select className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 font-medium appearance-none">
                      <option value="">None</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* THEME STEP */}
              {currentStep.id === 'theme' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: 't-1', name: 'Dawn Minimal', category: 'Fashion', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80' },
                      { id: 't-2', name: 'Luxe Beauty', category: 'Cosmetics', img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80' },
                      { id: 't-4', name: 'Home Living', category: 'Furniture', img: 'https://images.unsplash.com/photo-1618220179428-22790b46a013?w=800&q=80' },
                      { id: 't-5', name: 'Fresh Grocery', category: 'Food', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80' }
                    ].map(theme => (
                      <div 
                        key={theme.id}
                        className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${formData.theme?.id === theme.id ? 'border-brand-500 shadow-md ring-4 ring-brand-50' : 'border-slate-200 hover:border-brand-300'}`}
                        onClick={() => setFormData({...formData, theme})}
                      >
                        <div className="h-40 bg-slate-100 overflow-hidden relative">
                          <img src={theme.img} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          {formData.theme?.id === theme.id && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-sm">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="p-4 bg-white">
                          <h4 className="font-extrabold text-slate-900">{theme.name}</h4>
                          <p className="text-xs font-bold text-slate-500">{theme.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PRODUCTS STEP */}
              {currentStep.id === 'products' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border border-slate-200 rounded-xl p-5 hover:border-brand-300 hover:shadow-sm transition-all cursor-pointer bg-white group flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base group-hover:text-brand-600 transition-colors">Import from CSV</h4>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">Bulk upload products using our standard template.</p>
                    </div>
                  </div>
                  
                  <div className="border border-slate-200 rounded-xl p-5 hover:border-brand-300 hover:shadow-sm transition-all cursor-pointer bg-white group flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform border border-blue-100">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base group-hover:text-brand-600 transition-colors">Import from Shopify</h4>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">Connect your Shopify store to migrate products instantly.</p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-5 hover:border-brand-300 hover:shadow-sm transition-all cursor-pointer bg-white group flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform border border-purple-100">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base group-hover:text-brand-600 transition-colors">Add Manually</h4>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">Create your first product from scratch.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENTS STEP */}
              {currentStep.id === 'payments' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#635BFF]/10 text-[#635BFF] rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900">Stripe</h4>
                        <p className="text-xs font-medium text-slate-500">Credit cards & Wallets</p>
                      </div>
                    </div>
                    <Button variant="outline" className="font-bold">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                        <Coins className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900">Cash on Delivery</h4>
                        <p className="text-xs font-medium text-slate-500">Offline payment method</p>
                      </div>
                    </div>
                    <Badge variant="success" className="bg-emerald-50 text-emerald-700">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900">Bank Transfer</h4>
                        <p className="text-xs font-medium text-slate-500">Manual verification</p>
                      </div>
                    </div>
                    <Button variant="outline" className="font-bold">Configure</Button>
                  </div>
                </div>
              )}

              {/* SHIPPING STEP */}
              {currentStep.id === 'shipping' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <h4 className="font-extrabold text-slate-900 mb-4">Domestic Shipping (Pakistan)</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Standard Flat Rate</p>
                          <p className="text-xs text-slate-500 font-medium">3-5 business days</p>
                        </div>
                        <p className="font-extrabold text-slate-900">PKR 250</p>
                      </div>
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Free Shipping</p>
                          <p className="text-xs text-slate-500 font-medium">For orders over PKR 5,000</p>
                        </div>
                        <Badge variant="success" className="bg-emerald-50 text-emerald-700">Active</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-brand-600 font-bold hover:bg-brand-50 mt-3 w-full border border-dashed border-brand-200">
                      + Add Shipping Rate
                    </Button>
                  </div>
                </div>
              )}

              {/* INTEGRATIONS STEP */}
              {currentStep.id === 'integrations' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="text-sm font-bold text-slate-700 mb-4">Recommended for your store:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-slate-200 rounded-xl p-4 bg-white flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">WhatsApp Business</h4>
                          <p className="text-xs font-medium text-slate-500 mt-1">Order confirmations & support</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="font-bold">Add</Button>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 bg-white flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">Mailchimp</h4>
                          <p className="text-xs font-medium text-slate-500 mt-1">Email marketing & newsletters</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="font-bold">Add</Button>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 bg-white flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">Google Analytics</h4>
                          <p className="text-xs font-medium text-slate-500 mt-1">Traffic & conversion tracking</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="font-bold">Add</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* DOMAIN STEP */}
              {currentStep.id === 'domain' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border-2 border-brand-500 bg-brand-50 rounded-xl p-5 relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <Badge variant="success" className="bg-brand-100 text-brand-700 border-none mb-2 text-[10px] font-bold uppercase tracking-wider">Free Subdomain</Badge>
                        <h4 className="font-extrabold text-slate-900 text-lg mb-1">{formData.storeSlug || 'your-store'}.sellzy.shop</h4>
                        <p className="text-sm font-medium text-slate-600">Your store will be instantly accessible here.</p>
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-brand-600" />
                    </div>
                  </div>

                  <div className="border border-slate-200 bg-white rounded-xl p-5 hover:border-slate-300 transition-colors">
                    <h4 className="font-extrabold text-slate-900 text-base mb-1">Connect Custom Domain</h4>
                    <p className="text-sm font-medium text-slate-500 mb-4">Use a domain you already own (e.g. www.yourbrand.com).</p>
                    <div className="flex gap-2">
                      <input type="text" placeholder="yourbrand.com" className="flex-1 bg-slate-50 border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-lg px-4 py-2 text-slate-900 font-medium transition-all" />
                      <Button variant="outline" className="font-bold">Connect</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* LAUNCH STEP */}
              {currentStep.id === 'launch' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-2xl font-extrabold text-slate-900 text-center mb-6">Final Review</h3>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                    <ul className="divide-y divide-slate-200">
                      <li className="p-4 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="font-bold text-slate-700">Business & Store Details</span>
                        </div>
                        <span className="text-sm font-extrabold text-slate-900">{formData.storeName || 'Store Name'}</span>
                      </li>
                      <li className="p-4 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="font-bold text-slate-700">Country & Currency</span>
                        </div>
                        <span className="text-sm font-extrabold text-slate-900">{formData.country} ({formData.currency})</span>
                      </li>
                      <li className="p-4 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="font-bold text-slate-700">Theme Selected</span>
                        </div>
                        <span className="text-sm font-extrabold text-slate-900">{formData.theme?.name || 'Dawn Minimal'}</span>
                      </li>
                      <li className="p-4 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="font-bold text-slate-700">Store Domain</span>
                        </div>
                        <span className="text-sm font-extrabold text-slate-900">{formData.storeSlug || 'store'}.sellzy.shop</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-center text-sm font-bold text-slate-500">
                    Everything looks good! Your store is ready to launch.
                  </p>
                  
                  {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-bold">
                      {errorMsg}
                    </div>
                  )}
                </div>
              )}

            </CardContent>

            {/* Footer Navigation */}
            <div className="bg-slate-50/80 border-t border-slate-200 p-4 sm:p-6 flex items-center justify-between mt-auto">
              <Button 
                variant="ghost" 
                className={`font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-200 ${currentStepIndex === 0 ? 'invisible' : ''}`}
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              
              <div className="flex gap-3">
                {currentStep.id !== 'account' && currentStep.id !== 'business' && currentStep.id !== 'store' && currentStep.id !== 'launch' && (
                  <Button variant="outline" className="bg-white border-slate-200 font-bold text-slate-600 hidden sm:flex" onClick={handleNext}>
                    Skip for now
                  </Button>
                )}
                
                {currentStep.id === 'launch' ? (
                  <Button variant="primary" className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 shadow-md" onClick={handleLaunch} disabled={isProvisioning}>
                    {isProvisioning ? 'Launching...' : 'Launch Store'} <Rocket className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 shadow-sm"
                    onClick={handleNext}
                    disabled={currentStep.id === 'store' && (!formData.storeName || !formData.storeSlug)}
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
