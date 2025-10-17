// components/SkeletonBlock.tsx
interface SkeletonBlockProps {
    width?: string;
    height?: string;
    className?: string;
    rounded?: boolean;
  }
  
  export default function SkeletonBlock({
    width = "w-full",
    height = "h-4",
    className = "",
    rounded = true,
  }: SkeletonBlockProps) {
    return (
      <div
        className={`bg-gray-200 animate-pulse ${width} ${height} ${
          rounded ? "rounded-md" : ""
        } ${className}`}
      />
    );
  }
  