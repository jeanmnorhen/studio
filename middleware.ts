
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'fb-studio-auth-session';
const DEFAULT_LOGGED_IN_PAGE = '/admin/agents';
const LOGIN_PAGE = '/login';
const SIGNUP_PAGE = '/signup';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuthenticated = !!sessionCookie;

  // 1. Bypass para assets do Next.js, rotas de API e arquivos estáticos
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // Assume que arquivos como .png, .ico, .svg têm ponto
  ) {
    return NextResponse.next();
  }

  // 2. Lógica para páginas de autenticação (Login e Signup)
  if (pathname === LOGIN_PAGE || pathname === SIGNUP_PAGE) {
    if (isAuthenticated) {
      // Se autenticado e tentando acessar login/signup, redirecionar para o painel padrão
      return NextResponse.redirect(new URL(DEFAULT_LOGGED_IN_PAGE, request.url));
    }
    // Se não autenticado, permitir acesso ao login/signup
    return NextResponse.next();
  }

  // 3. Lógica para a página raiz ('/')
  if (pathname === '/') {
    if (isAuthenticated) {
      // Se autenticado e na raiz, redirecionar para o painel padrão
      return NextResponse.redirect(new URL(DEFAULT_LOGGED_IN_PAGE, request.url));
    } else {
      // Se não autenticado e na raiz, redirecionar para login
      return NextResponse.redirect(new URL(LOGIN_PAGE, request.url));
    }
  }

  // 4. Lógica para outras rotas (implicitamente protegidas, como /admin/*)
  // Neste ponto, sabemos que não é uma página de autenticação nem a raiz.
  if (!isAuthenticated) {
    // Se não autenticado e tentando acessar qualquer outra rota protegida, redirecionar para login
    // Guardar a URL original para redirecionar de volta após o login.
    const redirectUrl = new URL(LOGIN_PAGE, request.url);
    if (pathname !== LOGIN_PAGE) { // Evitar adicionar redirect para o próprio login
        redirectUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // Se autenticado e não se encaixa em nenhuma das condições de redirecionamento acima (ex: /admin/tools), permitir acesso.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Corresponder a todos os caminhos de solicitação, exceto aqueles que começam com:
     * - api (tratado internamente acima)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de otimização de imagem)
     * - favicon.ico (arquivo favicon)
     * O matcher é amplo; a lógica do middleware refina o comportamento.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
