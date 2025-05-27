
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'fb-studio-auth-session';
const DEFAULT_LOGGED_IN_PAGE = '/admin/agents';
const LOGIN_PAGE = '/login';
const SIGNUP_PAGE = '/signup';

const PUBLIC_PATHS_FOR_UNAUTHENTICATED = [
  LOGIN_PAGE,
  SIGNUP_PAGE,
];

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

  // 2. Lógica para usuários autenticados
  if (isAuthenticated) {
    // Se autenticado e tentando acessar login ou signup, redirecionar para o painel
    if (pathname === LOGIN_PAGE || pathname === SIGNUP_PAGE) {
      return NextResponse.redirect(new URL(DEFAULT_LOGGED_IN_PAGE, request.url));
    }
    // Se autenticado e tentando acessar a raiz, redirecionar para o painel
    if (pathname === '/') {
      return NextResponse.redirect(new URL(DEFAULT_LOGGED_IN_PAGE, request.url));
    }
    // Se autenticado e acessando qualquer outra rota (incluindo /admin/*), permitir
    return NextResponse.next();
  }

  // 3. Lógica para usuários NÃO autenticados
  // (Neste ponto, sabemos que isAuthenticated é false)
  // Se não autenticado e tentando acessar uma rota pública definida (login/signup), permitir
  if (PUBLIC_PATHS_FOR_UNAUTHENTICATED.includes(pathname)) {
    return NextResponse.next();
  }

  // Se não autenticado e tentando acessar qualquer outra rota (incluindo / e /admin/*),
  // redirecionar para login.
  // Guardar a URL original para redirecionar de volta após o login, se não for a raiz ou uma página de autenticação.
  let redirectParam = '';
  if (pathname !== '/' && !PUBLIC_PATHS_FOR_UNAUTHENTICATED.includes(pathname)) {
    redirectParam = `?redirect=${encodeURIComponent(pathname + request.nextUrl.search)}`;
  }
  return NextResponse.redirect(new URL(`${LOGIN_PAGE}${redirectParam}`, request.url));
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
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
