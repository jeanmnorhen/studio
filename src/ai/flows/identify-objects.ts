
// src/ai/flows/identify-objects.ts
'use server';
/**
 * @fileOverview An AI agent (flow) that identifies objects in an image using a dedicated tool.
 *
 * - identifyObjects - A function that handles the object identification process.
 * - IdentifyObjectsInput - The input type for the identifyObjects function.
 * - IdentifyObjectsOutput - The return type for the identifyObjects function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { identifyObjectsTool, IdentifyObjectsToolInputSchema, type IdentifyObjectsToolInput, type IdentifyObjectsToolOutput } from '@/ai/tools/image-analysis-tools';

// Input schema for the flow (agent) - remains the same
const IdentifyObjectsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyObjectsInput = z.infer<typeof IdentifyObjectsInputSchema>;

// Output schema for the flow (agent) - remains the same
const IdentifyObjectsOutputSchema = z.object({
  objects: z.array(z.string()).describe('The objects identified in the image.'),
});
export type IdentifyObjectsOutput = z.infer<typeof IdentifyObjectsOutputSchema>;


// The main exported function that clients call
export async function identifyObjects(input: IdentifyObjectsInput): Promise<IdentifyObjectsOutput> {
  // The flow will now internally call the tool.
  // The input for the flow might be the same as the tool, or it could be different
  // if the flow did some pre-processing. Here, it's the same.
  const toolInput: IdentifyObjectsToolInput = { photoDataUri: input.photoDataUri };
  
  const result = await identifyObjectsAgentFlow(toolInput);
  return result;
}

// This prompt now instructs the LLM to use the tool
const agentPrompt = ai.definePrompt({
  name: 'identifyObjectsAgentPrompt',
  input: { schema: IdentifyObjectsToolInputSchema }, // The prompt expects the tool's input
  output: { schema: IdentifyObjectsOutputSchema },   // The agent's final output schema
  tools: [identifyObjectsTool], // Make the tool available to this prompt
  prompt: `You are an image analysis agent. Your task is to identify objects in the provided image.
Please use the 'identifyObjectsInImage' tool to perform this task.
The image to analyze is: {{media url=photoDataUri}}

Ensure the final list of identified objects is returned.`,
});


const identifyObjectsAgentFlow = ai.defineFlow(
  {
    name: 'identifyObjectsAgentFlow', // This is effectively our "Agent"
    inputSchema: IdentifyObjectsToolInputSchema, // Agent flow takes tool input
    outputSchema: IdentifyObjectsOutputSchema,   // Agent flow produces the final output
    // tools: [identifyObjectsTool], // Tools can also be defined at flow level if not prompt specific
  },
  async (input: IdentifyObjectsToolInput): Promise<IdentifyObjectsOutput> => {
    // The flow now calls the agentPrompt, which is configured to use the tool.
    // Genkit's LLM will decide to call `identifyObjectsTool` based on the prompt.
    const llmResponse = await agentPrompt(input); 
    
    // The llmResponse.output() should match IdentifyObjectsOutputSchema
    // If the tool was called, its output is part of the LLM's reasoning process to arrive at this final output.
    const finalOutput = llmResponse.output;

    if (!finalOutput) {
      // Handle cases where the LLM didn't produce the expected output,
      // possibly because the tool wasn't called as expected or an error occurred.
      console.error("IdentifyObjectsAgentFlow: LLM did not produce the expected final output.");
      return { objects: ["Error: Could not identify objects or LLM failed to use the tool correctly."] };
    }
    
    return finalOutput;
  }
);

