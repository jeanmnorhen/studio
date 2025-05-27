
// src/app/actions.ts
'use server';

import { identifyObjects, type IdentifyObjectsInput } from '@/ai/flows/identify-objects';
import { z } from 'zod';
import { database } from '@/lib/firebase';
import { ref, push, set, serverTimestamp } from 'firebase/database';

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
    const aiResult = await identifyObjects(input);

    // Save to Firebase Realtime Database
    try {
      if (aiResult.objects && aiResult.objects.length > 0) {
        const identifiedObjectsRef = ref(database, 'identifiedObjects');
        const newIdentifiedObjectRef = push(identifiedObjectsRef);
        await set(newIdentifiedObjectRef, {
          objects: aiResult.objects,
          timestamp: serverTimestamp(),
          // You could store a part of the image URI or a hash for reference if needed
          // imageSample: input.photoDataUri.substring(0, 100) + '...' 
        });
      }
      return { success: true, data: aiResult.objects };

    } catch (dbError) {
      console.error('Error saving to Firebase:', dbError);
      let errorMessage = 'Image analyzed, but failed to save results to the database.';
      if (dbError instanceof Error) {
        errorMessage += ` Details: ${dbError.message.includes('permission_denied') ? 'Permission denied. Check Firebase rules.' : dbError.message}`;
      }
      // Even if DB save fails, the AI analysis was successful. 
      // You might want to return success:true but with a specific warning,
      // or fail the whole operation. For now, let's consider DB save failure as a partial failure.
      // However, to make it clear to the user that part of the operation failed, we return success:false here.
      return { success: false, error: errorMessage };
    }

  } catch (aiError) {
    console.error('Error in AI analysis:', aiError);
    let errorMessage = 'Failed to analyze image with AI.';
    if (aiError instanceof Error) {
        errorMessage += ` Details: ${aiError.message}`;
    }
    return { success: false, error: errorMessage };
  }
}
