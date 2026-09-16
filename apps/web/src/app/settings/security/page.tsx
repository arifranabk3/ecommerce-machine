'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Key, Laptop, AlertCircle, Smartphone } from 'lucide-react';
import { useApiQuery, useApiMutation } from '@/lib/api-client';

export default function SecuritySettingsPage() {
  const [mfaSetupData, setMfaSetupData] = useState<{ secret: string; qrCodeDataUrl: string } | null>(null);
  const [mfaVerifyCode, setMfaVerifyCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState('');

  const { data: sessionsData, mutate: refetchSessions, isLoading: isSessionsLoading } = useApiQuery<any>('/api/v1/auth/sessions');
  const { data: activityData, isLoading: isActivityLoading } = useApiQuery<any>('/api/v1/auth/security/activity');
  
  const sessions = sessionsData?.data || [];
  const securityActivity = activityData?.data || [];

  const { trigger: initiateMfaSetup, isMutating: isSettingUpMfa } = useApiMutation<any, any>('/api/v1/auth/mfa/setup');
  const { trigger: verifyMfaCode, isMutating: isVerifyingMfa } = useApiMutation<any, any>('/api/v1/auth/mfa/verify');
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  const startMfaSetup = async () => {
    setStatusMessage('');
    try {
      const res = await initiateMfaSetup({ method: 'POST' });
      if (res.data) setMfaSetupData(res.data);
      else setStatusMessage(res.error?.message || 'Failed to initiate MFA setup');
    } catch (e: any) {
      setStatusMessage(e.message || 'Failed to initiate MFA setup');
    }
  };

  const verifyMfa = async () => {
    try {
      const res = await verifyMfaCode({ method: 'POST', body: { token: mfaVerifyCode } });
      if (res.data?.recoveryCodes) {
        setRecoveryCodes(res.data.recoveryCodes);
        setMfaSetupData(null);
        setStatusMessage('MFA successfully enabled!');
      } else {
        setStatusMessage(res.error?.message || 'Verification failed');
      }
    } catch (e: any) {
      setStatusMessage(e.message || 'Verification failed');
    }
  };

  const revokeSession = async (sessionId: string) => {
    const token = localStorage.getItem('sellzy_token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      refetchSessions();
    } catch (e) {}
  };

  const logoutAllDevices = async () => {
    setIsLoggingOutAll(true);
    const token = localStorage.getItem('sellzy_token');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/logout-all`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      refetchSessions();
    } catch (e) {} finally { setIsLoggingOutAll(false); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-900">Security & Authentication</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage TOTP MFA, Active Devices, and View Security Logs</p>
        </div>

        {statusMessage && (
          <div className={`p-4 border rounded-xl text-sm font-bold ${statusMessage.includes('success') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {statusMessage}
          </div>
        )}

        {/* TOTP MFA Card */}
        <Card title="Two-Factor Authentication (TOTP MFA)" subtitle="Protect your account with Google Authenticator or Authy" className="shadow-sm border-slate-200">
          {!mfaSetupData && recoveryCodes.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-600">
                Enhance your SaaS operations account security by requiring an OTP code or single-use recovery code on login.
              </p>
              <Button variant="primary" onClick={startMfaSetup} isLoading={isSettingUpMfa} className="shadow-sm">
                <ShieldCheck className="w-4 h-4 mr-2" /> Configure TOTP MFA
              </Button>
            </div>
          )}

          {mfaSetupData && (
            <div className="space-y-5">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-6">
                {mfaSetupData.qrCodeDataUrl && (
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    {/* Using standard img for QR code as it's a data URL, not an external image needing optimization */}
                    <img src={mfaSetupData.qrCodeDataUrl} alt="MFA QR Code" className="w-32 h-32" />
                  </div>
                )}
                <div className="space-y-2.5">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-brand-600" /> Scan QR Code
                  </h4>
                  <p className="text-xs font-medium text-slate-500">
                    Or manually enter key:<br/>
                    <code className="bg-white border border-slate-200 px-2 py-1 rounded-md text-xs font-mono font-bold text-brand-700 mt-2 inline-block">
                      {mfaSetupData.secret}
                    </code>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-400" /> Enter 6-digit Code from Authenticator App
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="123456"
                    value={mfaVerifyCode}
                    onChange={(e) => setMfaVerifyCode(e.target.value)}
                    className="px-3.5 py-2.5 text-sm font-bold tracking-widest border border-slate-200 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow bg-slate-50 hover:bg-white"
                  />
                  <Button variant="primary" onClick={verifyMfa} isLoading={isVerifyingMfa} className="shadow-sm">
                    Verify & Enable
                  </Button>
                </div>
              </div>
            </div>
          )}

          {recoveryCodes.length > 0 && (
            <div className="space-y-4 p-5 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
              <h4 className="font-extrabold text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Save Your One-Time Recovery Codes
              </h4>
              <p className="text-sm font-medium text-amber-800">
                Store these recovery codes in a secure location. Each code can only be used once if you lose access to your authenticator app. <strong className="font-extrabold text-amber-900">They will not be displayed again!</strong>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs font-bold text-slate-700 bg-white p-4 border border-amber-200 rounded-xl shadow-sm">
                {recoveryCodes.map((code, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded-lg text-center border border-slate-200">{code}</div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Active Sessions Management Card */}
        <Card 
          title="Active Sessions & Device Management" 
          subtitle="Manage active login sessions across your devices"
          action={
            <Button variant="outline" size="sm" onClick={logoutAllDevices} isLoading={isLoggingOutAll} className="bg-white hover:bg-slate-50 shadow-sm border-slate-200">
              Logout All Other Devices
            </Button>
          }
          className="shadow-sm border-slate-200"
        >
          <div className="space-y-3">
            {isSessionsLoading ? (
              <div className="text-center py-6 text-sm text-slate-500 font-medium">Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-500 font-medium">No active sessions found.</div>
            ) : (
              sessions.map((sess: any) => (
                <div key={sess.sessionId} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-white transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                      <Laptop className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{sess.userAgent || 'Unknown Device'}</p>
                        {sess.isCurrent && <Badge variant="success" className="!text-[10px] !py-0">Current Session</Badge>}
                      </div>
                      <p className="text-xs font-medium text-slate-500 mt-1">
                        IP: {sess.ipAddress || '127.0.0.1'} • Last Active: {new Date(sess.lastActivityAt || sess.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!sess.isCurrent && (
                    <Button variant="danger" size="sm" onClick={() => revokeSession(sess.sessionId)} className="shadow-sm">
                      Revoke
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Security Audit Activity Feed */}
        <Card title="Recent Security Activity Log" subtitle="Audit trail of security events for your account" className="shadow-sm border-slate-200">
          <div className="space-y-1">
            {isActivityLoading ? (
              <div className="text-center py-6 text-sm text-slate-500 font-medium">Loading activity...</div>
            ) : securityActivity.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-500 font-medium">No recent security activity found.</div>
            ) : (
              securityActivity.map((log: any) => (
                <div key={log._id} className="flex items-center justify-between text-sm py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-brand-600" />
                    <span className="font-bold text-slate-800">{log.action || 'Unknown Action'}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{new Date(log.timestamp || log.createdAt).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
