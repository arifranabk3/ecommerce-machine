import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-brand-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="space-y-4">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              label="New Password"
              placeholder="••••••••"
            />
             <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              label="Confirm New Password"
              placeholder="••••••••"
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              variant="primary"
            >
              Reset Password
            </Button>
          </div>
        </form>

        <div className="text-center">
          <Link href="/login" className="font-medium text-brand-600 hover:text-brand-500 text-sm">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
