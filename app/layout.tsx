import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import AuthLayout from "./AuthLayout";
import { Toaster } from "react-hot-toast";
import 'react-loading-skeleton/dist/skeleton.css' 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME || "My App",
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Welcome to my app",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <AuthLayout>{children}</AuthLayout> 
                <Toaster />
            </body>
        </html>
    );
}

