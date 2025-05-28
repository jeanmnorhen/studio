// src/lib/agent-registry.ts
/**
 * @fileOverview Defines structures for AI agents and tools and provides a registry.
 */
import { z, type ZodTypeAny } from 'zod';
import { IdentifyObjectsToolInputSchema, IdentifyObjectsToolOutputSchema } from '@/ai/tools/image-analysis-tools';
import { ObjectIdentificationAgentInputSchema, ObjectIdentificationAgentOutputSchema } from '@/ai/flows/object-identification-flow';


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
export const objectIdentifierTool: ToolDefinition = {
  id: 'tool-identify-objects-in-image',
  name: 'Identify Objects in Image Tool',
  description: 'Identifica objetos em uma imagem fornecida como data URI.',
  inputSchema: IdentifyObjectsToolInputSchema,
  outputSchema: IdentifyObjectsToolOutputSchema,
};

export const availableTools: ToolDefinition[] = [
  objectIdentifierTool,
];

// --- Available Agents (Flows) ---
export const objectIdentificationAgent: AgentDefinition = {
  id: 'agent-object-identifier',
  name: 'Object Identification Agent',
  description: 'Um agente que identifica objetos em imagens usando a ferramenta de identificação de objetos.',
  inputSchema: ObjectIdentificationAgentInputSchema,
  outputSchema: ObjectIdentificationAgentOutputSchema,
  associatedTools: [objectIdentifierTool],
};

export const availableAgents: AgentDefinition[] = [
  objectIdentificationAgent,
];
