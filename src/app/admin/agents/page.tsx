
// src/app/admin/agents/page.tsx
import { availableAgents } from '@/lib/agent-registry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { BrainCog, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function AgentsPage() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <BrainCog className="mr-3 h-8 w-8" /> Agent Management
          </h1>
          <p className="text-muted-foreground">View and manage your AI agents (Genkit Flows).</p>
        </div>
        {/* Placeholder for "Create Agent" button - Future Scope */}
        {/* <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Agent
        </Button> */}
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Registered Agents</CardTitle>
          <CardDescription>
            The following agents (Genkit flows) are defined in the system. 
            "Control over creation" via UI is planned for future updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableAgents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Associated Tools</TableHead>
                  {/* <TableHead className="text-right">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.description}</TableCell>
                    <TableCell>
                      {agent.associatedTools.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {agent.associatedTools.map(tool => (
                            <TooltipProvider key={tool.id} delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="secondary" className="cursor-help">
                                    {tool.name}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="font-semibold">{tool.name}</p>
                                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    {/* <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>Manage</Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BrainCog className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">No Agents Defined</h3>
              <p className="text-muted-foreground">
                There are currently no agents registered in the system.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
       <Card className="mt-6 bg-muted/30 border-dashed">
        <CardHeader className="flex flex-row items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <CardTitle className="text-lg">About Agents</CardTitle>
            <CardDescription>
              In this system, "Agents" are represented by Genkit Flows. They orchestrate tasks, potentially using one or more "Tools" to achieve their goals. The "Main Function" of an agent is its exported flow function.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
