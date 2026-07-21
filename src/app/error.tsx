'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Route Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 bg-red-950/50 text-red-500 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2 text-zinc-100">Route Error</h2>
      <p className="text-sm text-zinc-400 mb-6 max-w-md leading-relaxed">
        Failed to load this section of the marketplace. This might be a temporary network issue.
      </p>
      <button
        onClick={() => reset()}
        className="py-2.5 px-5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium transition duration-200 border border-zinc-700"
      >
        Reset Segment
      </button>
    </div>
  );
}
