'use client';

import React, { useState } from 'react';

export default function ShippingDashboardPage() {
  const [metrics] = useState({
    readyToShip: 14,
    pickupScheduled: 8,
    inTransit: 42,
    outForDelivery: 19,
    deliveredToday: 65,
    failedDelivery: 3,
    rtoInitiated: 2,
    deliverySuccessRate: 96.2,
    rtoRate: 2.1
  });

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAF8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', margin: 0 }}>Shipping & Fulfillment Dashboard</h1>
        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Overview of active shipments, courier SLAs, delivery performance, and RTO metrics.
        </p>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Ready to Ship</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', marginTop: '0.5rem' }}>{metrics.readyToShip}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>In Transit</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#3B82F6', marginTop: '0.5rem' }}>{metrics.inTransit}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Out For Delivery</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#8B5CF6', marginTop: '0.5rem' }}>{metrics.outForDelivery}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Delivered Today</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#10B981', marginTop: '0.5rem' }}>{metrics.deliveredToday}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>RTO Rate</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#EF4444', marginTop: '0.5rem' }}>{metrics.rtoRate}%</div>
        </div>
      </div>

      {/* Carrier Performance Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>Active Courier Performance</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
              <th style={{ padding: '0.75rem' }}>Courier Name</th>
              <th style={{ padding: '0.75rem' }}>Active Shipments</th>
              <th style={{ padding: '0.75rem' }}>On-Time Delivery</th>
              <th style={{ padding: '0.75rem' }}>Avg. Transit Time</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '0.75rem', fontWeight: 600 }}>TCS Logistics</td>
              <td style={{ padding: '0.75rem' }}>45</td>
              <td style={{ padding: '0.75rem', color: '#10B981', fontWeight: 600 }}>98.4%</td>
              <td style={{ padding: '0.75rem' }}>1.4 Days</td>
              <td style={{ padding: '0.75rem' }}><span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>ACTIVE</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '0.75rem', fontWeight: 600 }}>Leopards Courier</td>
              <td style={{ padding: '0.75rem' }}>28</td>
              <td style={{ padding: '0.75rem', color: '#10B981', fontWeight: 600 }}>95.8%</td>
              <td style={{ padding: '0.75rem' }}>1.8 Days</td>
              <td style={{ padding: '0.75rem' }}><span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>ACTIVE</span></td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem', fontWeight: 600 }}>Trax Express</td>
              <td style={{ padding: '0.75rem' }}>11</td>
              <td style={{ padding: '0.75rem', color: '#F59E0B', fontWeight: 600 }}>91.2%</td>
              <td style={{ padding: '0.75rem' }}>2.1 Days</td>
              <td style={{ padding: '0.75rem' }}><span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>ACTIVE</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
