
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
  SidebarTrigger,
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
import { Home, Settings, Users, ListChecks, LogOut, Eye, Palette, BrainCog, Aperture, FlaskConical } from 'lucide-react';
import Image from 'next/image';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const handleSignOut = async () => {
    const result = await signOutUser();
    if (result.success) {
      router.push('/login');
    } else {
      // Handle error, maybe show a toast
      console.error("Sign out failed:", result.error);
    }
  };

  // If auth is still loading, or no user, you might want to show a loader or redirect
  // This check is more for client-side rendering scenarios after initial load
  // Middleware should handle the primary protection
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Settings className="h-12 w-12 animate-spin text-primary" /> Loading Admin...</div>;
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4">
           <Link href="/admin/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Aperture className="h-8 w-8 text-primary group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
            <h1 className="text-2xl font-semibold text-primary group-data-[collapsible=icon]:hidden">Visionary</h1>
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
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Object Identifier App">
                <Link href="/">
                  <Eye />
                  <span>Object ID App</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <SidebarSeparator className="my-4" />

          <SidebarGroup>
            <SidebarGroupLabel>AI Management</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Agents">
                  <Link href="/admin/agents">
                    <BrainCog />
                    <span>Agents</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Tools">
                  <Link href="/admin/tools">
                    <Palette /> {/* Replaced Wrench with Palette for "Tools" */}
                    <span>Tools</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator className="my-4" />
          
          <SidebarGroup>
            <SidebarGroupLabel>Development</SidebarGroupLabel>
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
            <div className="flex items-center gap-2 mb-4 group-data-[collapsible=icon]:hidden">
               <Image
                  src={`https://placehold.co/40x40.png?text=${user.email?.[0]?.toUpperCase() ?? 'U'}`}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
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
            className="w-full group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:p-0"
          >
            <LogOut className="group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 md:p-8">
         {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
