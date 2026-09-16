import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApiMutation, useApiQuery } from '@/lib/api-client';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  warehouses: { _id: string, name: string }[];
}

export function AdjustStockModal({ isOpen, onClose, onSuccess, warehouses }: AdjustStockModalProps) {
  const { trigger, isMutating } = useApiMutation('/api/v1/inventory/adjustments');
  const { data: productsData } = useApiQuery<{ items: { _id: string, name: string, sku: string }[] }>('/api/v1/products?limit=100');
  
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    quantityChange: 0,
    reason: 'Stock correction'
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await trigger({ method: 'POST', body: formData });
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to adjust stock');
      } else {
        setError('Failed to adjust stock');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">Adjust Stock</h2>
        {error && <div className="mb-4 text-sm text-danger-text bg-danger-subtle p-2 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm"
              required
            >
              <option value="">Select Product...</option>
              {productsData?.items?.map(p => (
                <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <select
              name="warehouseId"
              value={formData.warehouseId}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm"
              required
            >
              <option value="">Select Location...</option>
              {warehouses.map(w => (
                <option key={w._id} value={w._id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity Change (use negative for reduction)</label>
            <Input
              type="number"
              name="quantityChange"
              value={formData.quantityChange}
              onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm"
              required
            >
              <option value="Stock correction">Stock correction</option>
              <option value="Damaged/Expired">Damaged/Expired</option>
              <option value="Found inventory">Found inventory</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isMutating}>
              {isMutating ? 'Adjusting...' : 'Adjust Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
