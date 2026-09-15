'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ArrowLeft, Save, Trash2, Image as ImageIcon, MoreVertical, Globe, AlertCircle
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useApiQuery, useApiMutation } from '@/lib/api-client';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { data: product, isLoading, error: fetchError } = useApiQuery<any>(`/api/v1/products/${productId}`);
  const { trigger: updateProduct, isMutating } = useApiMutation(`/api/v1/products/${productId}`);

  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    status: 'DRAFT'
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        status: product.status || 'DRAFT'
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError(null);
    try {
      await updateProduct({
        method: 'PATCH',
        body: {
          name: formData.name,
          description: formData.description,
          status: formData.status
        }
      });
      // Handle success locally (e.g. toast), for now just ignore
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-content-muted">Loading product...</div>
      </DashboardLayout>
    );
  }

  if (fetchError || !product) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-danger-text">Failed to load product.</div>
      </DashboardLayout>
    );
  }

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
                <h1 className="text-2xl font-extrabold text-content-primary tracking-tight">{product.name}</h1>
                <Badge variant={product.status === 'ACTIVE' ? 'success' : 'neutral'}>{product.status}</Badge>
              </div>
              <p className="text-content-secondary text-sm mt-1 font-medium flex items-center gap-2">
                SKU: <code className="bg-surface-secondary px-1.5 py-0.5 rounded text-content-primary">{product.sku}</code>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-surface">
                <Globe className="w-4 h-4 mr-2" /> View on Store
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={isMutating}>
                <Save className="w-4 h-4 mr-2" /> {isMutating ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" size="icon" className="bg-surface ml-1">
                <MoreVertical className="w-4 h-4 text-content-secondary" />
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

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
                  <Input 
                    label="Product Name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange as any}
                  />
                  <div>
                    <label className="block text-sm font-medium text-content-primary mb-1.5">Description</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full h-32 bg-surface border border-border rounded-lg p-3 text-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors shadow-sm"
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
                  {product.images?.map((img: string, i: number) => (
                    <div key={i} className="aspect-square bg-surface-secondary rounded-xl border border-border relative group overflow-hidden">
                      <img src={img} alt="Product" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-content-primary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="danger" size="sm" className="h-7 text-[10px]">Remove</Button>
                      </div>
                    </div>
                  ))}
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
                    <label className="block text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">Status</label>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors shadow-sm"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="ACTIVE">Active</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {product.tags?.map((tag: string) => (
                        <span key={tag} className="bg-surface-secondary text-content-secondary text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium border border-border">
                          {tag} <button className="text-content-muted hover:text-content-primary">&times;</button>
                        </span>
                      ))}
                    </div>
                    <Input placeholder="Add tag..." />
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
