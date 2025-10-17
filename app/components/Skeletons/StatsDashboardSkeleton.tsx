import React from "react";

const SkeletonCard: React.FC = () => {
  return (
    <div className="card p-6 w-full animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-8 bg-gray-600 rounded w-1/2"></div>
    </div>
  );
};

const StatsDashboardSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
};

export default StatsDashboardSkeleton;