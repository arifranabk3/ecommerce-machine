'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Key, Laptop, AlertCircle } from 'lucide-react';

export default function SecuritySettingsPage() {
  const [mfaSetupData, setMfaSetupData] = useState<{ secret: string; qrCodeDataUrl: string } | null>(null);
  const [mfaVerifyCode, setMfaVerifyCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [securityActivity, setSecurityActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('sellzy_token') : null;

  useEffect(() => {
    if (token) {
      fetchSessions();
      fetchActivity();
    }
  }, [token]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setSessions(data.data || []);
    } catch (e) {}
  };

  const fetchActivity = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/security/activity', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setSecurityActivity(data.data || []);
    } catch (e) {}
  };

  const startMfaSetup = async () => {
    setIsLoading(true);
    setStatusMessage('');
    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/mfa/setup', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setMfaSetupData(data.data);
    } catch (e) {
      setStatusMessage('Failed to initiate MFA setup');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfa = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ token: mfaVerifyCode })
      });
      const data = await res.json();
      if (res.ok && data.data?.recoveryCodes) {
        setRecoveryCodes(data.data.recoveryCodes);
        setMfaSetupData(null);
        setStatusMessage('MFA successfully enabled!');
      } else {
        setStatusMessage(data.error?.message || 'Verification failed');
      }
    } catch (e) {
      setStatusMessage('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      await fetch(`http://localhost:4000/api/v1/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSessions();
    } catch (e) {}
  };

  const logoutAllDevices = async () => {
    try {
      await fetch('http://localhost:4000/api/v1/auth/logout-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSessions();
    } catch (e) {}
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-900">Security & Authentication Settings</h1>
          <p className="text-sm text-slate-500">Manage TOTP MFA, Active Devices, and View Security Logs</p>
        </div>

        {statusMessage && (
          <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl text-sm font-medium text-brand-900">
            {statusMessage}
          </div>
        )}

        {/* TOTP MFA Card */}
        <Card title="Two-Factor Authentication (TOTP MFA)" subtitle="Protect your account with Google Authenticator or Authy">
          {!mfaSetupData && recoveryCodes.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Enhance your SaaS operations account security by requiring an OTP code or single-use recovery code on login.
              </p>
              <Button variant="primary" onClick={startMfaSetup} isLoading={isLoading}>
                Configure TOTP MFA
              </Button>
            </div>
          )}

          {mfaSetupData && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-6">
                {mfaSetupData.qrCodeDataUrl && (
                  <img src={mfaSetupData.qrCodeDataUrl} alt="MFA QR Code" className="w-36 h-36 border border-slate-200 rounded-lg" />
                )}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-brand-900">Scan QR Code</h4>
                  <p className="text-xs text-slate-500">Or manually enter key: <code className="bg-slate-200 px-2 py-1 rounded text-xs font-mono">{mfaSetupData.secret}</code></p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 6-digit Code from Authenticator App</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="123456"
                    value={mfaVerifyCode}
                    onChange={(e) => setMfaVerifyCode(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-brand-300"
                  />
                  <Button variant="primary" onClick={verifyMfa} isLoading={isLoading}>
                    Verify & Enable
                  </Button>
                </div>
              </div>
            </div>
          )}

          {recoveryCodes.length > 0 && (
            <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h4 className="font-bold text-sm text-amber-900">Save Your One-Time Recovery Codes</h4>
              <p className="text-xs text-amber-800">
                Store these recovery codes in a secure location. Each code can only be used once if you lose access to your authenticator app. They will not be displayed again!
              </p>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs text-slate-800 bg-white p-3 border border-amber-200 rounded-lg">
                {recoveryCodes.map((code, idx) => (
                  <div key={idx} className="p-1 bg-slate-50 rounded text-center border border-slate-200">{code}</div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Active Sessions Management Card */}
        <Card 
          title="Active Sessions & Device Management" 
          subtitle="Manage active login sessions across your devices"
          action={<Button variant="outline" size="sm" onClick={logoutAllDevices}>Logout All Other Devices</Button>}
        >
          <div className="space-y-3">
            {sessions.map((sess) => (
              <div key={sess.sessionId} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <Laptop className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-slate-800">{sess.userAgent || 'Unknown Device'}</p>
                      {sess.isCurrent && <Badge variant="success">Current Session</Badge>}
                    </div>
                    <p className="text-[11px] text-slate-400">IP: {sess.ipAddress || '127.0.0.1'} • Last Active: {new Date(sess.lastActivityAt).toLocaleString()}</p>
                  </div>
                </div>
                {!sess.isCurrent && (
                  <Button variant="danger" size="sm" onClick={() => revokeSession(sess.sessionId)}>
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Security Audit Activity Feed */}
        <Card title="Recent Security Activity Log" subtitle="Audit trail of security events for your account">
          <div className="space-y-2">
            {securityActivity.map((log) => (
              <div key={log._id} className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-700" />
                  <span className="font-semibold text-slate-800">{log.action}</span>
                </div>
                <span className="text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
