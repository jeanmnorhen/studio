// src/app/page.tsx
// O middleware agora lida com o redirecionamento da página raiz.
// Se o usuário não estiver autenticado, será redirecionado para /login.
// Se estiver autenticado, será redirecionado para /admin/agents.
// Este conteúdo não deve ser exibido normalmente.

import { BrainCircuit } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <header className="mb-10">
           <BrainCircuit className="mx-auto h-20 w-20 text-primary mb-6" />
          <h1 className="text-5xl font-bold tracking-tight text-primary">Visionary AI</h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Painel de Controle de Agentes de IA.
          </p>
        </header>
        <p className="text-sm text-muted-foreground pt-8">
          Você será redirecionado para a página de login ou para o painel de controle.
        </p>
      </div>
    </main>
  );
}
