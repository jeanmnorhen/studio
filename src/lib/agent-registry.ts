// src/lib/agent-registry.ts
/**
 * @fileOverview Defines structures for AI agents and tools and provides a registry.
 */
import type { ZodTypeAny } from 'zod';
import { identifyObjectsTool, IdentifyObjectsToolInputSchema, IdentifyObjectsToolOutputSchema } from '@/ai/tools/image-analysis-tools';
import { identifyObjects, IdentifyObjectsInputSchema, IdentifyObjectsOutputSchema } from '@/ai/flows/identify-objects'; // This is our "agent"

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
  // mainFunction: (input: any) => Promise<any>; // Reference to the exported flow function
  inputSchema: ZodTypeAny;
  outputSchema: ZodTypeAny;
  associatedTools: ToolDefinition[]; // Tools this agent is configured to use or primarily interacts with
}

// --- Available Tools ---
export const availableTools: ToolDefinition[] = [
  {
    id: 'tool-identify-objects',
    name: 'Object Identifier In Image',
    description: 'A Genkit tool that identifies objects in a given image data URI.',
    inputSchema: IdentifyObjectsToolInputSchema,
    outputSchema: IdentifyObjectsToolOutputSchema,
    // genkitToolReference: identifyObjectsTool // Store the actual tool
  },
  // Add other tools here as they are created
];

// --- Available Agents (Flows) ---
export const availableAgents: AgentDefinition[] = [
  {
    id: 'agent-image-object-identifier',
    name: 'Image Object Identifier Agent',
    description: 'An agent (Genkit flow) that utilizes the "Object Identifier In Image" tool to analyze images and report found objects.',
    // mainFunction: identifyObjects, // The exported function of the flow
    inputSchema: IdentifyObjectsInputSchema, // The agent's own input schema
    outputSchema: IdentifyObjectsOutputSchema, // The agent's own output schema
    associatedTools: availableTools.filter(t => t.id === 'tool-identify-objects'),
  },
  // Add other agents here
];
