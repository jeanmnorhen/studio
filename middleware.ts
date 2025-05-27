
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'fb-studio-auth-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso a páginas de autenticação, arquivos estáticos e rotas de API
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') || // Permitir rotas de API
    pathname.includes('.') // Permitir arquivos estáticos como imagens, css
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);

  // Se o usuário não estiver logado e estiver na página inicial, redirecionar para login
  if ((pathname === '/' || pathname === '') && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se o usuário estiver tentando acessar rotas /admin
  if (pathname.startsWith('/admin')) {
    if (!sessionCookie) {
      // Redirecionar para login se tentar acessar páginas de admin sem sessão
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname); // Opcional: redirecionar de volta após o login
      return NextResponse.redirect(loginUrl);
    }
  } else if (sessionCookie && (pathname === '/' || pathname === '')) {
    // Opcional: Se logado e na página inicial, poderia redirecionar para o dashboard
    // return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    // Por enquanto, permite que usuários logados vejam a página inicial se navegarem diretamente.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Corresponder a todos os caminhos de solicitação, exceto aqueles que começam com:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (arquivo favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
