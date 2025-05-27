// src/app/admin/dashboard/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCog, Palette, Activity } from "lucide-react";
import { availableAgents, availableTools } from '@/lib/agent-registry';

export default function DashboardPage() {
  const agentCount = availableAgents.length;
  const toolCount = availableTools.length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview and management of your AI agents and tools.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Agents</CardTitle>
            <BrainCog className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently active agents.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Tools</CardTitle>
            <Palette className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{toolCount}</div>
            <p className="text-xs text-muted-foreground">
              Tools usable by agents.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">+573</div> */}
            <p className="text-xs text-muted-foreground">
              Monitoring features coming soon.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Welcome, Admin!</CardTitle>
            <CardDescription>
              This is your central hub for managing AI agents. You can view available agents,
              their tools, and eventually monitor their performance and create new ones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Use the sidebar navigation to explore different sections.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
