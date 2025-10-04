import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Permitir acesso às rotas do cliente sem autenticação obrigatória
    if (pathname.startsWith("/barber_app/client")) {
      return NextResponse.next();
    }

    // Para outras rotas do barber_app, exigir autenticação
    if (
      pathname.startsWith("/barber_app") &&
      !pathname.startsWith("/barber_app/client")
    ) {
      if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Permitir acesso às rotas do cliente sem token
        if (pathname.startsWith("/barber_app/client")) {
          return true;
        }

        // Para outras rotas protegidas, exigir token
        if (
          pathname.startsWith("/barber_app") &&
          !pathname.startsWith("/barber_app/client")
        ) {
          return !!token;
        }

        // Para outras rotas, usar comportamento padrão
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/barber_app/:path*", "/dashboard/:path*", "/api/protected/:path*"],
};
