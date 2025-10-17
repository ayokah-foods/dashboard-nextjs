import React from "react";
import Image from "next/image";

interface AvatarProps {
    src?: string;
    alt: string;
    size?: number;
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    size = 10
}) => (
    src ? (
        <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            className={`w-${size} h-${size} object-cover rounded-full`}
            priority
        />
    ) : (
        <div
            className={`w-${size} h-${size} bg-gray-300 rounded-full flex items-center justify-center text-gray-600`}
        >
            ?
        </div>
    )
);

export default Avatar;