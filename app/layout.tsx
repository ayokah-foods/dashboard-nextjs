import { Instrument_Sans } from "next/font/google"; 
import "./globals.css";
import { Metadata } from "next";
import AuthLayout from "./AuthLayout";
import { Toaster } from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";

const instrumentalSans = Instrument_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-instrumental-sans",
});

export const metadata: Metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME || "My App",
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Welcome to my app",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${instrumentalSans.className} antialiased`}>
                <AuthLayout>{children}</AuthLayout>
                <Toaster />
            </body>
        </html>
    );
}
