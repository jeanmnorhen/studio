// src/app/admin/layout.tsx
"use client";

import type React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  // SidebarTrigger, // Não usado no momento
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { signOutUser } from '@/app/auth-actions';
import { useAuth } from '@/hooks/use-auth';
import { Home, Settings, Palette, BrainCircuit, LogOut, FlaskConical } from 'lucide-react';
import Image from 'next/image';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const handleSignOut = async () => {
    const result = await signOutUser();
    if (result.success) {
      router.push('/'); // Redirecionar para a raiz (que é a página de login)
      router.refresh(); // Adicionado para forçar a atualização do estado do middleware/auth
    } else {
      // Handle error, maybe show a toast
      console.error("Sign out failed:", result.error);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Settings className="h-12 w-12 animate-spin text-primary" /> Loading Admin...</div>;
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4">
           <Link href="/admin/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <BrainCircuit className="h-8 w-8 text-sidebar-primary group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
            <h1 className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">Visionary AI Panel</h1>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/admin/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <SidebarSeparator className="my-4" />

          <SidebarGroup>
            <SidebarGroupLabel>Gerenciamento de IA</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Agentes">
                  <Link href="/admin/agents">
                    <BrainCircuit />
                    <span>Agentes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Ferramentas">
                  <Link href="/admin/tools">
                    <Palette /> 
                    <span>Ferramentas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator className="my-4" />
          
          <SidebarGroup>
            <SidebarGroupLabel>Desenvolvimento</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Playground">
                  <Link href="/admin/playground">
                    <FlaskConical />
                    <span>Playground</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-sidebar-border">
          {user && (
            <div className="flex items-center gap-3 mb-4 group-data-[collapsible=icon]:hidden">
               <Image
                  src={`https://placehold.co/40x40.png?text=${user.email?.[0]?.toUpperCase() ?? 'U'}`}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-sidebar-accent"
                  data-ai-hint="user avatar"
                />
              <div className="text-sm">
                <p className="font-medium text-sidebar-foreground">{user.email}</p>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-0 border-sidebar-accent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-6 sm:p-8 md:p-10 bg-background min-h-screen">
         {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
