import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center gap-4">
      <h2 className="text-3xl font-extrabold text-slate-900">404</h2>
      <p className="text-slate-500 text-lg">Page not found</p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm text-white transition-colors hover:bg-slate-800"
      >
        Return Home
      </Link>
    </div>
  );
}
