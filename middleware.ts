
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'fb-studio-auth-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso a páginas de autenticação, arquivos estáticos e rotas de API
  // Essas são verificadas primeiro e, se corresponderem, o middleware encerra aqui.
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/_next/') || // Essencial para o funcionamento do Next.js
    pathname.startsWith('/api/') ||   // Rotas de API
    pathname.includes('.')           // Arquivos estáticos (ex: favicon.ico, images)
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);

  // REGRA PRINCIPAL: Se o usuário não estiver logado E estiver tentando acessar a página inicial
  if (pathname === '/' && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Proteção para rotas /admin
  if (pathname.startsWith('/admin')) {
    if (!sessionCookie) {
      // Redirecionar para login se tentar acessar páginas de admin sem sessão
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname); // Opcional: redirecionar de volta após o login
      return NextResponse.redirect(loginUrl);
    }
    // Se tem cookie e está no admin, permite implicitamente (o NextResponse.next() no final cuidará disso)
  }

  // Opcional: Se o usuário estiver logado e acessar a página inicial,
  // você poderia redirecioná-lo para o dashboard, por exemplo.
  // Descomente o bloco abaixo se desejar este comportamento:
  /*
  if (pathname === '/' && sessionCookie) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  */

  // Se nenhuma das condições de redirecionamento acima for atendida, permite o acesso.
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
     * Isso garante que o middleware seja executado para a página inicial '/'
     * e para as rotas '/admin'.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
