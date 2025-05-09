import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/authService";
type Role = keyof typeof roleBasedPrivateRotes;

const authRoutes = ["/login", "/register", "/", "/tutors", "/about"];

const roleBasedPrivateRotes = {
  user: [/^\/user/, /^\/create-shop/, /^\/tutor/, /^\/student/, /^\/student/],
  student: [/^\/student/, /^\/booking/],
  tutor: [/^\/tutor/],
  admin: [/^\/admin/],
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const userInfo = await getCurrentUser();

  if (!userInfo) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(
          // `http://localhost:3000/login?redirectPath=${pathname}`,
          `https://job-placement-tutorlink-client.vercel.app/login?redirectPath=${pathname}`,
          request.url
        )
      );
    }
  }

  if (userInfo?.role && roleBasedPrivateRotes[userInfo?.role as Role]) {
    const routes = roleBasedPrivateRotes[userInfo?.role as Role];
    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next();
    }
  }

  if (pathname.startsWith("/booking") && userInfo.role !== "student") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.redirect(new URL("/", request.url));
};

export const config = {
  matcher: [
    "/login",
    "/create-shop",
    "/admin",
    "/admin/:path*",
    "/user",
    "/user/:path*",
    "/student",
    "/student/:path*",
    "/tutor",
    "/tutor/:path*",
    "/booking",
    "/booking/:path*",
  ],
};
