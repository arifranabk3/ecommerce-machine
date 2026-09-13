'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ArrowLeft,
  Save,
  Trash2,
  Image as ImageIcon,
  MoreVertical,
  Globe
} from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto space-y-6 pb-12 animate-fade-in">
        
        {/* Breadcrumb & Header */}
        <div>
          <Link href="/products" className="text-[11px] font-bold text-content-muted hover:text-content-primary uppercase tracking-wider flex items-center gap-1 w-fit mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">AirMax Pro Wireless</h1>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-content-secondary text-sm mt-1 font-medium flex items-center gap-2">
                SKU: <code className="bg-surface-secondary px-1.5 py-0.5 rounded text-content-primary">AUDIO-001</code>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-surface">
                <Globe className="w-4 h-4 mr-2" /> View on Store
              </Button>
              <Button variant="primary">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
              <Button variant="outline" size="icon" className="bg-surface ml-1">
                <MoreVertical className="w-4 h-4 text-content-secondary" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
            {['overview', 'variants', 'inventory', 'pricing', 'seo', 'activity'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap py-3 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-colors
                  ${activeTab === tab 
                    ? 'border-brand-600 text-brand-600' 
                    : 'border-transparent text-content-muted hover:text-content-secondary hover:border-border'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column (Main Form) */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest mb-6 border-b border-border pb-4">General Information</h3>
                <div className="space-y-5">
                  <Input label="Product Name" defaultValue="AirMax Pro Wireless" />
                  <div>
                    <label className="block text-sm font-medium text-content-primary mb-1.5">Description</label>
                    <textarea 
                      className="w-full h-32 bg-surface border border-border rounded-lg p-3 text-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors shadow-sm"
                      defaultValue="Premium wireless headphones featuring active noise cancellation and 30-hour battery life."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest mb-6 border-b border-border pb-4">Media</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="aspect-square bg-surface border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-content-muted hover:border-brand-600 hover:text-brand-600 transition-colors cursor-pointer group hover:bg-brand-50">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-bold">Add Media</span>
                  </div>
                  <div className="aspect-square bg-surface-secondary rounded-xl border border-border relative group overflow-hidden">
                    <div className="absolute inset-0 bg-content-primary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="danger" size="sm" className="h-7 text-[10px]">Remove</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                  <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest">Variants</h3>
                  <Button variant="outline" size="sm" className="bg-surface text-content-secondary">Add Variant</Button>
                </div>
                <div className="bg-surface rounded-lg border border-border overflow-hidden">
                  <div className="grid grid-cols-4 p-3 text-[10px] font-bold text-content-secondary uppercase tracking-wider border-b border-border bg-surface-secondary">
                    <div className="col-span-2">Variant</div>
                    <div>SKU</div>
                    <div>Price</div>
                  </div>
                  <div className="grid grid-cols-4 p-3 items-center hover:bg-surface-hover transition-colors border-b border-border text-sm text-content-primary font-medium">
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="w-8 h-8 bg-surface-secondary rounded shrink-0 border border-border"></div>
                      Matte Black
                    </div>
                    <div>AUDIO-001-BLK</div>
                    <div>$299.00</div>
                  </div>
                  <div className="grid grid-cols-4 p-3 items-center hover:bg-surface-hover transition-colors text-sm text-content-primary font-medium">
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="w-8 h-8 bg-surface-secondary rounded shrink-0 border border-border"></div>
                      Lunar White
                    </div>
                    <div>AUDIO-001-WHT</div>
                    <div>$299.00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Sidebar form items) */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest mb-6 border-b border-border pb-4">Organization</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">Category</label>
                    <select className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors shadow-sm">
                      <option>Electronics</option>
                      <option>Audio</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">Vendor</label>
                    <select className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors shadow-sm">
                      <option>Acme Corp</option>
                      <option>TechSource</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-surface-secondary text-content-secondary text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium border border-border">
                        audio <button className="text-content-muted hover:text-content-primary">&times;</button>
                      </span>
                      <span className="bg-surface-secondary text-content-secondary text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium border border-border">
                        premium <button className="text-content-muted hover:text-content-primary">&times;</button>
                      </span>
                    </div>
                    <Input placeholder="Add tag..." />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-widest mb-6 border-b border-border pb-4">Channels</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-content-muted bg-surface transition-colors">
                    <span className="text-sm font-bold text-content-primary">Online Store</span>
                    <div className="w-8 h-4 bg-success rounded-full relative">
                      <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-content-muted bg-surface transition-colors">
                    <span className="text-sm font-bold text-content-primary">B2B Portal</span>
                    <div className="w-8 h-4 bg-surface-secondary border border-border rounded-full relative">
                      <div className="w-3 h-3 bg-content-muted rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="danger" className="w-full bg-danger-subtle text-danger-text hover:bg-danger-subtle/80 border-danger-subtle">
              <Trash2 className="w-4 h-4 mr-2" /> Delete Product
            </Button>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
