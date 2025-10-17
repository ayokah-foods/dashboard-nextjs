import React from "react";

const SkeletonCard: React.FC = () => {
  return (
    <div className="flex items-start space-x-4 animate-pulse py-4">
      {/* Skeleton avatar */}
      <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        {/* Skeleton name */}
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        {/* Skeleton stars */}
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        {/* Skeleton comment */}
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  );
};

const RecentReviewsSkeleton: React.FC = () => {
  return (
    <div className="p-0">
      <h2 className="text-lg font-medium text-white mb-4">Recent Review</h2>
      <div className="divide-y divide-white/10">
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default RecentReviewsSkeleton;