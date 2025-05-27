
// src/app/admin/agents/page.tsx
import { availableAgents } from '@/lib/agent-registry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrainCog, Info, PlusCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link';

export default function AgentsPage() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <BrainCog className="mr-3 h-8 w-8" /> Gerenciamento de Agentes
          </h1>
          <p className="text-muted-foreground">Visualize e gerencie seus agentes de IA (Fluxos Genkit).</p>
        </div>
        {/* 
          TODO: Implementar botão "Criar Novo Agente" e funcionalidade.
          Este botão levaria para uma nova página /admin/agents/new 
          onde o usuário poderia configurar e criar um novo agente.
        */}
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Agente (Em Breve)
        </Button>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Agentes Registrados (Estáticos)</CardTitle>
          <CardDescription>
            Os seguintes agentes (fluxos Genkit) estão definidos estaticamente no sistema.
            A listagem de agentes configurados dinamicamente e o controle sobre a criação via UI são planejados para atualizações futuras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableAgents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ferramentas Associadas</TableHead>
                  {/* <TableHead className="text-right">Ações</TableHead> */}
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
                        <span className="text-xs text-muted-foreground">Nenhuma</span>
                      )}
                    </TableCell>
                    {/* 
                      TODO: Adicionar botões de Ações (Editar, Excluir/Desabilitar)
                      quando a funcionalidade de agentes dinâmicos for implementada.
                      Ex: <Button variant="ghost" size="sm" asChild><Link href={`/admin/agents/edit/${agent.id}`}>Editar</Link></Button> 
                    */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BrainCog className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">Nenhum Agente Definido</h3>
              <p className="text-muted-foreground">
                Atualmente não há agentes registrados no sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
       <Card className="mt-6 bg-muted/30 border-dashed">
        <CardHeader className="flex flex-row items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <CardTitle className="text-lg">Sobre Agentes</CardTitle>
            <CardDescription>
              Neste sistema, "Agentes" são representados por Fluxos Genkit. Eles orquestram tarefas, potencialmente usando uma ou mais "Ferramentas" para atingir seus objetivos. A "Função Principal" de um agente é sua função de fluxo exportada. Agentes configuráveis dinamicamente serão armazenados no Firebase.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
