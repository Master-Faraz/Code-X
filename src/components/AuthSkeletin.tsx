// LoginSkeleton.jsx
import React from 'react';

export default function AuthSkeleton() {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-[#fff1eb] to-[#ace0f9] ">
      {/* Left: Form Skeleton */}
      <div className="flex-1 max-w-lg p-8 flex flex-col space-y-6 h-screen">
        <div className="mt-36 h-8 w-3/5 bg-gray-300 rounded animate-pulse" />
        <div>
          <div className="h-4 w-1/3 bg-gray-300 rounded mb-2 animate-pulse" />
          <div className="h-10 w-full bg-gray-300 rounded animate-pulse" />
        </div>

        <div>
          <div className="h-4 w-1/3 bg-gray-300 rounded mb-2 animate-pulse" />
          <div className="h-10 w-4/5 bg-gray-300 rounded animate-pulse relative">
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between items-center space-x-4">
          <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse" />
          <div className="h-10 flex-1 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="h-4 w-2/5 bg-gray-200 rounded animate-pulse mt-4" />
      </div>

      {/* Right: Image Placeholder */}
      <div className="flex-1 p-8 flex items-center justify-center ">
        <div className="h-64 w-64 bg-gray-300 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
