import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-40 bg-gray-200 rounded"></div>
    </div>
  );
}
