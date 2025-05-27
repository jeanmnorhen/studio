
// src/ai/tools/image-analysis-tools.ts
'use server';
/**
 * @fileOverview Provides AI tools related to image analysis.
 *
 * - identifyObjectsTool - A Genkit tool to identify objects in an image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Schema for the input of the identifyObjectsTool
const IdentifyObjectsToolInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyObjectsToolInput = z.infer<typeof IdentifyObjectsToolInputSchema>;

// Schema for the output of the identifyObjectsTool
const IdentifyObjectsToolOutputSchema = z.object({
  objects: z.array(z.string()).describe('A list of objects identified in the image.'),
});
export type IdentifyObjectsToolOutput = z.infer<typeof IdentifyObjectsToolOutputSchema>;

// Define the Genkit Tool
export const identifyObjectsTool = ai.defineTool(
  {
    name: 'identifyObjectsInImage', // Tool name used in prompts
    description: 'Identifies objects present in a given image. Takes a data URI of an image as input.',
    inputSchema: IdentifyObjectsToolInputSchema,
    outputSchema: IdentifyObjectsToolOutputSchema,
  },
  async (input: IdentifyObjectsToolInput): Promise<IdentifyObjectsToolOutput> => {
    // This tool uses ai.generate directly with a specific prompt.
    // For more complex tools, you might define a separate ai.definePrompt here.
    const { output } = await ai.generate({
      prompt: `You are an expert AI object identifier.
Analyze the provided image and identify the objects present.
Respond with a list of objects identified in the image.
Image: {{media url=${input.photoDataUri}}}`, // Directly embed, or pass input and use Handlebars if more complex
      output: {
        format: 'json', // Request JSON output
        schema: IdentifyObjectsToolOutputSchema, // Guide the LLM to produce output matching this schema
      },
       // model: 'googleai/gemini-pro-vision' // or your preferred vision model
    });
    
    if (!output) {
        // This case should ideally be handled by Genkit if the LLM fails to produce structured output
        // according to the schema, but good to have a fallback.
        console.error('identifyObjectsTool: LLM did not produce valid output according to schema.');
        return { objects: [] }; // Return empty or throw an error
    }
    return output;
  }
);
