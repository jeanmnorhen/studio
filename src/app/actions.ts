// src/app/actions.ts
'use server';

import { identifyObjects, type IdentifyObjectsInput } from '@/ai/flows/identify-objects';
import { z } from 'zod';

const AnalyzeImageInputSchema = z.object({
  photoDataUri: z.string().min(1, { message: 'Image data URI cannot be empty.' }),
});

export async function analyzeImageAction(
  data: unknown
): Promise<{ success: true; data: string[] } | { success: false; error: string }> {
  const validationResult = AnalyzeImageInputSchema.safeParse(data);

  if (!validationResult.success) {
    return { success: false, error: validationResult.error.errors.map(e => e.message).join(', ') };
  }

  const input: IdentifyObjectsInput = {
    photoDataUri: validationResult.data.photoDataUri,
  };

  try {
    const result = await identifyObjects(input);
    return { success: true, data: result.objects };
  } catch (error) {
    console.error('Error in analyzeImageAction:', error);
    return { success: false, error: 'Failed to analyze image. Please try again.' };
  }
}
