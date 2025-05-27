
// src/app/admin/playground/page.tsx
import ImageAnalysisForm from '@/components/image-analysis-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FlaskConical, Info } from 'lucide-react';
// TODO: Importar Select, SelectContent, SelectItem, SelectTrigger, SelectValue de '@/components/ui/select'
// TODO: Importar Label de '@/components/ui/label'
// TODO: Importar o hook useState de React
// TODO: Importar a lista de agentes disponíveis (estáticos + dinâmicos no futuro)

export default function PlaygroundPage() {
  // TODO: Adicionar estado para o agente selecionado:
  // const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(AGENT_ID_DO_ANALISADOR_DE_IMAGEM); // Default para o de imagem
  // TODO: Adicionar estado para os inputs específicos do agente selecionado.

  // TODO: Criar uma função para lidar com a mudança de agente selecionado,
  // que poderia resetar os inputs específicos do agente.

  // TODO: Criar uma função para renderizar os campos de formulário dinamicamente
  // com base no inputSchema do agente selecionado.

  // TODO: Criar uma função para lidar com o submit do formulário de teste,
  // que chamaria a função principal do agente selecionado com os dados do formulário.

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <FlaskConical className="mr-3 h-8 w-8" /> AI Playground
        </h1>
        <p className="text-muted-foreground">
          Teste e experimente com as funcionalidades de IA de sua aplicação.
        </p>
      </header>

      {/* 
        TODO: No futuro, esta seção se tornará mais dinâmica.
        1. Um dropdown permitirá selecionar qual agente testar (estático ou configurado dinamicamente).
        2. Abaixo do dropdown, os campos de input necessários para o agente selecionado serão renderizados.
           Isso exigirá ler o inputSchema do agente.
        3. Um botão "Executar Agente" chamará a função principal do agente com os dados fornecidos.
        4. Os resultados serão exibidos abaixo.

        Exemplo de como o seletor de agente poderia ser:
        <div className="mb-6">
          <Label htmlFor="agent-select">Selecionar Agente para Testar</Label>
          <Select 
            value={selectedAgentId} 
            onValueChange={setSelectedAgentId}
            name="agent-select" 
            id="agent-select"
          >
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Selecione um agente" />
            </SelectTrigger>
            <SelectContent>
              {availableAgents.map(agent => ( // availableAgents viria do agent-registry ou de uma função combinada
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      */}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Teste de Identificação de Objetos</CardTitle>
          <CardDescription>
            Use o formulário abaixo para fazer upload de uma imagem e testar a funcionalidade de identificação de objetos.
            Os resultados serão exibidos diretamente. Atualmente, este playground testa o agente padrão de identificação de objetos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto"> {/* Centralizando e largura máxima para o formulário */}
            <ImageAnalysisForm />
          </div>
        </CardContent>
      </Card>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Próximos Passos para o Playground</AlertTitle>
        <AlertDescription>
          Esta área de teste será expandida para permitir a seleção e execução de diferentes agentes de IA configurados no sistema.
          Os campos de entrada se adaptarão dinamicamente ao agente selecionado.
        </AlertDescription>
      </Alert>

    </div>
  );
}
