'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Building2,
  Store,
  CreditCard,
  CheckCircle2,
  Rocket,
  Globe,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-lg text-slate-900">Sellzy</span>
          </div>
          <div className="text-sm font-semibold text-slate-500">
            Step {step} of 3
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-2xl">
          
          {/* Progress Bar */}
          <div className="mb-8 flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 rounded-full z-0 transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'bg-white border border-slate-300 text-slate-400'}`}>
                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className={`text-xs font-bold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Business Profile</span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'bg-white border border-slate-300 text-slate-400'}`}>
                {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </div>
              <span className={`text-xs font-bold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>First Store</span>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'bg-white border border-slate-300 text-slate-400'}`}>
                3
              </div>
              <span className={`text-xs font-bold ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Select Plan</span>
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-premium border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <CardContent className="p-8 md:p-10">
              
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-100">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Welcome to Sellzy</h2>
                    <p className="text-slate-500 font-medium mt-2">Let&apos;s start by setting up your organization profile.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
                      <Input placeholder="e.g. Acme Corporation" className="w-full bg-slate-50 border-slate-200 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Industry</label>
                      <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors">
                        <option value="">Select an industry...</option>
                        <option value="apparel">Apparel & Fashion</option>
                        <option value="electronics">Electronics & Gadgets</option>
                        <option value="home">Home & Furniture</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Country</label>
                      <div className="relative">
                        <Globe className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors">
                          <option value="US">United States</option>
                          <option value="GB">United Kingdom</option>
                          <option value="PK">Pakistan</option>
                          <option value="AE">United Arab Emirates</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                      <Store className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Create your first store</h2>
                    <p className="text-slate-500 font-medium mt-2">You can always create more stores later under the same organization.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Store Name</label>
                      <Input placeholder="e.g. Acme US Store" className="w-full bg-slate-50 border-slate-200 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Store URL Prefix</label>
                      <div className="flex rounded-lg overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all">
                        <input type="text" placeholder="acme" className="flex-1 px-4 py-2.5 bg-slate-50 text-sm focus:outline-none focus:bg-white" />
                        <div className="bg-slate-100 px-4 py-2.5 text-sm text-slate-500 font-semibold border-l border-slate-200 flex items-center">
                          .sellzy.store
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Base Currency</label>
                      <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors">
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="PKR">PKR (₨)</option>
                        <option value="AED">AED (د.إ)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-100">
                      <CreditCard className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Choose a Plan</h2>
                    <p className="text-slate-500 font-medium mt-2">Select the plan that best fits your business needs. 14-day free trial included.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-brand-500 rounded-xl p-5 relative bg-brand-50 cursor-pointer shadow-sm">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                        Recommended
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">Growth</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-slate-900">$49</span>
                        <span className="text-sm font-semibold text-slate-500">/mo</span>
                      </div>
                      <ul className="mt-4 space-y-2 text-sm font-medium text-slate-600">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> Up to 2 Stores</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> Advanced Analytics</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" /> Priority Support</li>
                      </ul>
                    </div>
                    
                    <div className="border border-slate-200 rounded-xl p-5 cursor-pointer hover:border-slate-300 transition-colors bg-white">
                      <h3 className="font-bold text-slate-900 text-lg">Starter</h3>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-slate-900">$19</span>
                        <span className="text-sm font-semibold text-slate-500">/mo</span>
                      </div>
                      <ul className="mt-4 space-y-2 text-sm font-medium text-slate-600">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> 1 Store</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Basic Analytics</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400" /> Standard Support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100">
                <Button 
                  variant="ghost" 
                  onClick={prevStep}
                  className={step === 1 ? 'invisible' : ''}
                >
                  Back
                </Button>
                
                {step < 3 ? (
                  <Button variant="primary" onClick={nextStep} className="px-8 shadow-md">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Link href="/">
                    <Button variant="primary" className="px-8 shadow-md bg-emerald-600 hover:bg-emerald-700">
                      Start 14-Day Free Trial <Rocket className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>

            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
