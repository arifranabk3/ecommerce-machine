'use client';

import React, { useState } from 'react';

export default function ShipmentsListPage() {
  const [shipments] = useState([
    {
      id: 'shp_1',
      shipmentNumber: 'SHP-2026-000001',
      orderNumber: 'ORD-2026-000101',
      customerName: 'Ahmad Khan',
      courierName: 'TCS Logistics',
      trackingNumber: 'TRK-984210',
      status: 'IN_TRANSIT',
      codAmountMinor: 450000,
      createdAt: '2026-09-05'
    },
    {
      id: 'shp_2',
      shipmentNumber: 'SHP-2026-000002',
      orderNumber: 'ORD-2026-000102',
      customerName: 'Fatima Ali',
      courierName: 'Leopards Courier',
      trackingNumber: 'TRK-481029',
      status: 'DELIVERED',
      codAmountMinor: 0,
      createdAt: '2026-09-04'
    }
  ]);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAF8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Shipments List</h1>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>Track and manage all tenant outbound shipments.</p>
        </div>
        <button style={{ backgroundColor: '#A9C2B9', color: '#111827', fontWeight: 600, border: 'none', padding: '0.625rem 1.25rem', borderRadius: '8px', cursor: 'pointer' }}>
          + Create Shipment
        </button>
      </header>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
              <th style={{ padding: '0.75rem' }}>Shipment #</th>
              <th style={{ padding: '0.75rem' }}>Order</th>
              <th style={{ padding: '0.75rem' }}>Customer</th>
              <th style={{ padding: '0.75rem' }}>Courier</th>
              <th style={{ padding: '0.75rem' }}>Tracking #</th>
              <th style={{ padding: '0.75rem' }}>COD</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(shp => (
              <tr key={shp.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600, color: '#2563EB' }}>{shp.shipmentNumber}</td>
                <td style={{ padding: '0.75rem' }}>{shp.orderNumber}</td>
                <td style={{ padding: '0.75rem' }}>{shp.customerName}</td>
                <td style={{ padding: '0.75rem' }}>{shp.courierName}</td>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{shp.trackingNumber}</td>
                <td style={{ padding: '0.75rem' }}>PKR {(shp.codAmountMinor / 100).toLocaleString()}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ backgroundColor: shp.status === 'DELIVERED' ? '#ECFDF5' : '#EFF6FF', color: shp.status === 'DELIVERED' ? '#059669' : '#2563EB', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {shp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
