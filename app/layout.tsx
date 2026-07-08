import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import AuthLayout from "./AuthLayout";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME || "African Market Hub Admin",
    description:
        process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
        "Welcome to African Market Hub Admin",
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

