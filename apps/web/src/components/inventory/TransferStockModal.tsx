import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApiMutation, useApiQuery } from '@/lib/api-client';

interface TransferStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  warehouses: any[];
}

export function TransferStockModal({ isOpen, onClose, onSuccess, warehouses }: TransferStockModalProps) {
  const { trigger, isMutating } = useApiMutation('/api/v1/inventory/transfers');
  const { data: productsData } = useApiQuery<{ items: any[] }>('/api/v1/products?limit=100');
  
  const [formData, setFormData] = useState({
    productId: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    quantity: 0
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
    if (formData.fromWarehouseId === formData.toWarehouseId) {
      setError('Source and destination locations must be different');
      return;
    }
    if (formData.quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }
    
    try {
      await trigger({ method: 'POST', body: formData });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to transfer stock');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">Transfer Stock</h2>
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
              {productsData?.items?.map((p: any) => (
                <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">From Location</label>
            <select
              name="fromWarehouseId"
              value={formData.fromWarehouseId}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm"
              required
            >
              <option value="">Select Source Location...</option>
              {warehouses.map(w => (
                <option key={w._id} value={w._id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To Location</label>
            <select
              name="toWarehouseId"
              value={formData.toWarehouseId}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm"
              required
            >
              <option value="">Select Destination Location...</option>
              {warehouses.map(w => (
                <option key={w._id} value={w._id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange as any}
              min="1"
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isMutating}>
              {isMutating ? 'Transferring...' : 'Transfer Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
