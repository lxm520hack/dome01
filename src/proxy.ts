import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { decrypt } from "@/lib/session-token"

const protectedRoutes = ["/", "/products", "/orders", "/users", "/categories", "/settings"]

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtected = protectedRoutes.includes(path)
  const isLoginPage = path === "/login"

  const cookie = req.cookies.get("session")?.value
  const session = cookie ? await decrypt(cookie) : null

  if (isProtected && !session) {
    const url = new URL("/login", req.nextUrl)
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js)$).*)",
  ],
}
