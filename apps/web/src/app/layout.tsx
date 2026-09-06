import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sellzy — Ecommerce Operations SaaS',
  description: 'Production-grade multi-tenant ecommerce operations platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
