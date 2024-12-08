'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ProfilesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An error occurred while loading profiles.'}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
} 