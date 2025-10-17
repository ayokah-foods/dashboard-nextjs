import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const userCookie = request.cookies.get("user")?.value;
    const pathname = request.nextUrl.pathname;

    const isLogin = pathname === "/auth/login";
    const isChangePassword = pathname === "/auth/change-password";

    let mustChangePassword = false;

    if (userCookie) {
        try {
            const user = JSON.parse(decodeURIComponent(userCookie));
            mustChangePassword = !user.password_changed_at;
        } catch {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    if (!token && !isLogin) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (token && mustChangePassword) {
        if (!isChangePassword) {
            return NextResponse.redirect(
                new URL("/auth/change-password", request.url)
            );
        }
        return NextResponse.next();
    }

    if (token && isLogin) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico).*)"],
};
