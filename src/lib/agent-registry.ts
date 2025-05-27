// src/lib/agent-registry.ts
/**
 * @fileOverview Defines structures for AI agents and tools and provides a registry.
 */
import type { ZodTypeAny } from 'zod';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  inputSchema: ZodTypeAny;
  outputSchema: ZodTypeAny;
  // genkitToolReference?: any; // Optional: Actual Genkit tool object for advanced use
}

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  inputSchema: ZodTypeAny;
  outputSchema: ZodTypeAny;
  associatedTools: ToolDefinition[]; // Tools this agent is configured to use or primarily interacts with
}

// --- Available Tools ---
// A ferramenta de identificação de objetos foi removida.
export const availableTools: ToolDefinition[] = [
  // Exemplo de como adicionar uma nova ferramenta no futuro:
  /*
  {
    id: 'tool-example',
    name: 'Example Tool',
    description: 'A sample tool for demonstration.',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.object({ result: z.string() }),
  },
  */
];

// --- Available Agents (Flows) ---
// O agente de identificação de objetos foi removido.
export const availableAgents: AgentDefinition[] = [
  // Exemplo de como adicionar um novo agente no futuro:
  /*
  {
    id: 'agent-example',
    name: 'Example Agent',
    description: 'A sample agent that might use the example tool.',
    inputSchema: z.object({ task: z.string() }),
    outputSchema: z.object({ outcome: z.string() }),
    associatedTools: availableTools.filter(t => t.id === 'tool-example'),
  },
  */
];
