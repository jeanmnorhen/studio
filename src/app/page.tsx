// src/app/page.tsx
// Esta página não é mais o ponto de entrada principal devido ao middleware.
// O middleware redireciona para /login se não autenticado, ou /admin/agents se autenticado.
// Manteremos o conteúdo original caso haja alguma rota direta para ela no futuro,
// ou se o middleware for ajustado.

import ImageAnalysisForm from '@/components/image-analysis-form';
import { BrainCircuit } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <header className="mb-10">
           <BrainCircuit className="mx-auto h-20 w-20 text-primary mb-6" />
          <h1 className="text-5xl font-bold tracking-tight text-primary">Visionary AI</h1>
          <p className="mt-3 text-xl text-muted-foreground">
            Faça upload de uma imagem e deixe nossa IA identificar os objetos contidos nela.
          </p>
        </header>
        <ImageAnalysisForm />
        <p className="text-xs text-muted-foreground pt-8">
          Nota: Esta é a interface pública de demonstração. O painel de controle de agentes está disponível após o login.
        </p>
      </div>
    </main>
  );
}
