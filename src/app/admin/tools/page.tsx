
// src/app/admin/tools/page.tsx
import { availableTools } from '@/lib/agent-registry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Palette, Info } from 'lucide-react'; // Replaced Wrench with Palette

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <Palette className="mr-3 h-8 w-8" /> Tool Management
        </h1>
        <p className="text-muted-foreground">View available Genkit tools that agents can use.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Available Tools</CardTitle>
          <CardDescription>
            These are the Genkit tools defined in the system that can be utilized by agents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableTools.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Description</TableHead>
                  {/* <TableHead className="text-right">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableTools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell>{tool.description}</TableCell>
                    {/* <TableCell className="text-right">
                       <Button variant="ghost" size="sm" disabled>Details</Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="flex flex-col items-center justify-center py-12 text-center">
              <Palette className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">No Tools Defined</h3>
              <p className="text-muted-foreground">
                There are currently no tools registered in the system.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
       <Card className="mt-6 bg-muted/30 border-dashed">
        <CardHeader className="flex flex-row items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <CardTitle className="text-lg">About Tools</CardTitle>
            <CardDescription>
             "Tools" are specific capabilities (defined using `ai.defineTool`) that Genkit agents (Flows) can invoke to perform actions or retrieve information. They promote modularity and reusability in your AI logic.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
