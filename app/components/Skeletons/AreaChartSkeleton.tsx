import React from "react";

const AreaChartSkeleton: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        {/* Skeleton for title */}
        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
        {/* Skeleton for dropdown */}
        <div className="h-8 bg-gray-700 rounded w-32"></div>
      </div>

      <div className="mt-4">
        {/* Skeleton for chart */}
        <div className="h-64 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default AreaChartSkeleton;