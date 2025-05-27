// src/app/page.tsx (Anteriormente src/app/login/page.tsx)
"use client";

import type React from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, LogIn, BrainCircuit } from 'lucide-react';
import { loginWithEmail } from '@/app/auth-actions';
import Link from 'next/link';
import { Spinner } from '@/components/loader';

export default function LoginPage() { // O nome da função pode continuar LoginPage para clareza, mas é a página raiz
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await loginWithEmail({ email, password });

    setIsLoading(false);
    if (result.success) {
      const redirectPath = searchParams.get('redirect') || '/admin/agents';
      router.push(redirectPath);
      router.refresh(); // Adicionado para forçar a atualização do estado do middleware/auth
    } else {
      setError(result.error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="text-center mb-8">
        <BrainCircuit className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-primary">Visionary AI Panel</h1>
        <p className="mt-2 text-lg text-muted-foreground">Bem-vindo! Faça login para gerenciar seus agentes de IA.</p>
      </div>
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-primary">Acessar Painel</CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Falha no Login</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={isLoading}>
              {isLoading ? <Spinner size={20} className="mr-2" /> : <LogIn className="mr-2 h-5 w-5" />}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
