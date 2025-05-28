'use server';
/**
 * @fileOverview Fluxo do agente de identificação de objetos.
 *
 * - identifyObjectsInPhoto - Função principal do agente que identifica objetos em uma foto.
 * - ObjectIdentificationAgentInputSchema - Tipo de entrada para o agente.
 * - ObjectIdentificationAgentOutputSchema - Tipo de saída do agente.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  identifyObjectsInImageTool,
  IdentifyObjectsToolInputSchema, // Usado internamente pelo prompt se necessário, mas o input do agente é o mesmo
  IdentifyObjectsToolOutputSchema,
} from '@/ai/tools/image-analysis-tools';

export const ObjectIdentificationAgentInputSchema = IdentifyObjectsToolInputSchema;
export type ObjectIdentificationAgentInput = z.infer<
  typeof ObjectIdentificationAgentInputSchema
>;

export const ObjectIdentificationAgentOutputSchema = IdentifyObjectsToolOutputSchema;
export type ObjectIdentificationAgentOutput = z.infer<
  typeof ObjectIdentificationAgentOutputSchema
>;

// Este prompt instrui o LLM a usar a ferramenta.
const agentPrompt = ai.definePrompt({
  name: 'objectIdentificationAgentPrompt',
  input: { schema: ObjectIdentificationAgentInputSchema },
  output: { schema: ObjectIdentificationAgentOutputSchema },
  tools: [identifyObjectsInImageTool],
  prompt: `Você é um assistente de IA especialista em analisar imagens.
O usuário forneceu uma imagem e quer identificar os objetos nela.
Utilize a ferramenta 'identifyObjectsInImageTool' com a imagem fornecida para obter a lista de objetos.
Imagem: {{media url=imageDataUri}}
Apresente os resultados obtidos pela ferramenta.`,
});

const objectIdentificationAgentFlow = ai.defineFlow(
  {
    name: 'objectIdentificationAgentFlow',
    inputSchema: ObjectIdentificationAgentInputSchema,
    outputSchema: ObjectIdentificationAgentOutputSchema,
  },
  async (input: ObjectIdentificationAgentInput) => {
    // O LLM, através do prompt e da ferramenta disponível, fará a chamada à ferramenta.
    const { output } = await agentPrompt(input);
    
    // O output do prompt já deve ser o resultado da ferramenta,
    // pois o prompt instrui a usar a ferramenta e apresentar seus resultados.
    // Se o output for null, significa que o LLM não conseguiu usar a ferramenta ou gerar uma resposta.
    if (!output) {
      console.error("O prompt do agente de identificação de objetos não retornou um output válido.");
      return { objects: [] };
    }
    return output;
  }
);

export async function identifyObjectsInPhoto(
  input: ObjectIdentificationAgentInput
): Promise<ObjectIdentificationAgentOutput> {
  return objectIdentificationAgentFlow(input);
}
