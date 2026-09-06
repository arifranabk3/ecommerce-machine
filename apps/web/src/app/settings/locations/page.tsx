'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Warehouse, Plus, MapPin, Check } from 'lucide-react';

export default function LocationsPage() {
  const locations = [
    {
      id: 'loc_1',
      name: 'Main Central Warehouse',
      code: 'WH-MAIN',
      type: 'WAREHOUSE',
      isDefault: true,
      address: 'Plot 45, Industrial Zone, Karachi, Pakistan'
    },
    {
      id: 'loc_2',
      name: 'Gulberg Retail Store',
      code: 'STR-GULBERG',
      type: 'STORE',
      isDefault: false,
      address: 'Main Boulevard, Gulberg III, Lahore, Pakistan'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-900 tracking-tight">Locations & Warehouses</h1>
            <p className="text-sm text-slate-500 mt-1">Manage physical warehouses, stores, and fulfillment centers</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Location
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((loc) => (
            <Card key={loc.id} className="p-5 space-y-4 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-50 text-brand-700 rounded-xl">
                    <Warehouse className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-900 text-base">{loc.name}</h3>
                    <span className="font-mono text-xs text-slate-400">{loc.code}</span>
                  </div>
                </div>
                {loc.isDefault && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <Check className="w-3 h-3" /> Default
                  </Badge>
                )}
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{loc.address}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <Badge variant="outline">{loc.type}</Badge>
                <Button variant="ghost" size="sm">Edit Location</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
