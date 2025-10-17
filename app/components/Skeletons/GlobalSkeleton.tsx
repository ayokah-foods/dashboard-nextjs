// components/GlobalSkeleton.tsx

import SkeletonBlock from "./SkeletonBlock";

 
export default function GlobalSkeleton() {
  return (
    <div className="p-6 bg-white h-screen rounded-xl w-full shadow animate-pulse space-y-6">
      {/* Header */}
      <SkeletonBlock width="w-1/4" height="h-6" />
      <SkeletonBlock width="w-1/2" height="h-4" />

      {/* Content section */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonBlock width="w-full" height="h-4" />
            <SkeletonBlock width="w-5/6" height="h-4" />
            <SkeletonBlock width="w-1/3" height="h-3" />
          </div>
        ))}
      </div>

      {/* Footer / button area */}
      <div className="flex gap-3 mt-6">
        <SkeletonBlock width="w-24" height="h-10" />
        <SkeletonBlock width="w-24" height="h-10" />
      </div>
    </div>
  );
}
