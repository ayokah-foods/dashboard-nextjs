"use client";
import { useState, useEffect } from "react";
import { getBannerByType } from "@/lib/api_/banners";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const [backgroundUrl, setBackgroundUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchBackground() {
            try {
                const backgroundResponse = await getBannerByType("auth");
                if (
                    backgroundResponse.status === "success" &&
                    backgroundResponse.data?.banner
                ) {
                    setBackgroundUrl(backgroundResponse.data.banner);
                } else if (backgroundResponse.message) {
                    console.info(backgroundResponse.message);
                }
            } catch (error) {
                console.error("Failed to fetch background asset:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBackground();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg text-gray-500">
                Loading assets...
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-white text-gray-500">
            <div
                className="h-40 md:h-full md:w-1/2 bg-cover bg-center"
                style={{
                    backgroundImage: backgroundUrl
                        ? `url(${backgroundUrl})`
                        : "none",
                    backgroundColor: "#f0f0f0",
                }}
            ></div>

            <div className="flex-1 md:w-1/2 flex flex-col justify-center items-center px-6 py-8 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
