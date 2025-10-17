'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LayoutWrapper from './LayoutWrapper';

const publicAuthRoutes = [
    '/auth/login',
    '/auth/forget-password',
    '/auth/confirm-reset-code',
    '/auth/reset-password',
];
const semiPrivateRoute = '/auth/change-password';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {
        const cookies = document.cookie
            .split('; ')
            .reduce((acc: Record<string, string>, cookie) => {
                const [key, val] = cookie.split('=');
                acc[key] = decodeURIComponent(val);
                return acc;
            }, {});

        const token = cookies['token'];
        const user = cookies['user'];

        if (!token || !user) {
            if (![...publicAuthRoutes].includes(pathname)) {
                router.replace('/auth/login');
            }
            setIsAuthenticated(false);
        } else {
            if (publicAuthRoutes.includes(pathname)) {
                router.replace('/');
            } else {
                setIsAuthenticated(true);
            }
        }

        setIsChecking(false);
    }, [pathname, router]);

    if (isChecking) return null;

    if (!isAuthenticated && !publicAuthRoutes.includes(pathname)) return null;

    if (publicAuthRoutes.includes(pathname)) return children;

    if (pathname === semiPrivateRoute) return children;

    return <LayoutWrapper>{children}</LayoutWrapper>;
}
