import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const userCookie = request.cookies.get("user")?.value;
    const pathname = request.nextUrl.pathname; 
    const staticAssetRegex = /\.(jpg|jpeg|png|gif|svg|webp|ico|css|js|map|json|woff2?|ttf|eot)$/i;
    if (staticAssetRegex.test(pathname) || pathname.startsWith('/images') || pathname === '/login.jpg') {
        return NextResponse.next();
    }

    const isAuthRoute = pathname.startsWith('/auth');

    // 🚀 Make all /auth routes public
    if (isAuthRoute) {
        return NextResponse.next();
    }

    let mustChangePassword = false;

    if (userCookie) {
        try {
            const user = JSON.parse(decodeURIComponent(userCookie));
            mustChangePassword = !user.password_changed_at;
        } catch {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Force user to change password if required
    if (token && mustChangePassword) {
        return NextResponse.redirect(
            new URL("/auth/change-password", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico).*)"],
};
