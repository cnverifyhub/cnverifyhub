'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Critical Layout Error:', error);
  }, [error]);

  return (
    <html lang="zh">
      <body className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-950 text-white font-sans">
        <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-950/50 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Critical System Failure</h2>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            The application experienced a top-level runtime crash.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition duration-200"
          >
            Reload Platform
          </button>
        </div>
      </body>
    </html>
  );
}
