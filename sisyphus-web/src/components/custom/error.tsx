import { AlertTriangle } from 'lucide-react';

export const ErrorState = ({ message }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center text-center w-full py-12 text-red-500">
    <AlertTriangle className="h-12 w-12 mb-4 text-red-400" />
    <p className="text-lg font-semibold">Something went wrong</p>
    <p className="text-sm text-red-400">
      {message || 'An unexpected error occurred. Please try again later.'}
    </p>
  </div>
);
