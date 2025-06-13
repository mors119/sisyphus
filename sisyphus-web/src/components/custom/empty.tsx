import { FileX2 } from 'lucide-react';

export const EmptyState = ({ message }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center text-center w-full py-12 text-gray-500">
    <FileX2 className="h-12 w-12 mb-4 text-gray-400" />
    <p className="text-lg font-semibold">No Data Found</p>
    <p className="text-sm text-gray-400">
      {message || 'There are no items to display here.'}
    </p>
  </div>
);
