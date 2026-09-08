'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-slate-900">Something went wrong!</h2>
      <p className="text-slate-500 text-sm">We could not load the storefront content.</p>
      <button
        className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm text-white transition-colors hover:bg-slate-800"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
