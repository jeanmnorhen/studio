// src/app/actions.ts
'use server';

import { z } from 'zod';
import { identifyObjectsInPhoto, type ObjectIdentificationAgentInput, type ObjectIdentificationAgentOutput } from '@/ai/flows/object-identification-flow';
import { getDatabase, ref, push, serverTimestamp } from 'firebase/database';
import { app } from '@/lib/firebase'; // Sua inicialização do Firebase

// Schema para a entrada da ação do agente de identificação de objetos
const RunObjectIdentificationAgentInputSchema = z.object({
  imageDataUri: z.string().refine((val) => val.startsWith('data:image/'), {
    message: 'Image data URI must be a valid image data URI.',
  }),
});

type RunObjectIdentificationAgentResult = 
  | { success: true; data: ObjectIdentificationAgentOutput }
  | { success: false; error: string };

export async function runObjectIdentificationAgentAction(
  data: unknown
): Promise<RunObjectIdentificationAgentResult> {
  const validationResult = RunObjectIdentificationAgentInputSchema.safeParse(data);

  if (!validationResult.success) {
    return { success: false, error: validationResult.error.errors.map(e => e.message).join(', ') };
  }

  const agentInput: ObjectIdentificationAgentInput = validationResult.data;

  try {
    const result = await identifyObjectsInPhoto(agentInput);

    // Salvar no Firebase Realtime Database
    if (result && result.objects && result.objects.length > 0) {
      try {
        const db = getDatabase(app);
        const objectsRef = ref(db, 'identifiedObjects');
        await push(objectsRef, {
          timestamp: serverTimestamp(),
          imageDataUriSnippet: agentInput.imageDataUri.substring(0, 100) + '...', // Snippet para referência
          identifiedObjects: result.objects,
        });
      } catch (dbError: any) {
        console.error("Firebase DB Error ao salvar objetos:", dbError);
        // Continuar mesmo se o salvamento no DB falhar, mas logar o erro.
      }
    }
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Erro ao executar o agente de identificação de objetos:", error);
    return { success: false, error: error.message || "Falha ao analisar a imagem com o agente." };
  }
}


// Exemplo de como adicionar uma nova ação no futuro:
/*
const ExampleInputSchema = z.object({
  message: z.string(),
});

export async function exampleAction(
  data: unknown
): Promise<{ success: true; data: string } | { success: false; error: string }> {
  const validationResult = ExampleInputSchema.safeParse(data);

  if (!validationResult.success) {
    return { success: false, error: validationResult.error.errors.map(e => e.message).join(', ') };
  }

  // Lógica da ação aqui
  return { success: true, data: `Recebido: ${validationResult.data.message}` };
}
*/
