/**
 * @fileOverview Ferramentas de análise de imagem.
 * - identifyObjectsInImageTool: Uma ferramenta Genkit para identificar objetos em uma imagem.
 * - IdentifyObjectsToolInputSchema: Schema de entrada para a ferramenta.
 * - IdentifyObjectsToolOutputSchema: Schema de saída para a ferramenta.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const IdentifyObjectsToolInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A imagem para análise, como um data URI que deve incluir um MIME type e usar codificação Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyObjectsToolInput = z.infer<
  typeof IdentifyObjectsToolInputSchema
>;

export const IdentifyObjectsToolOutputSchema = z.object({
  objects: z
    .array(
      z.object({
        name: z.string().describe('O nome do objeto identificado.'),
        // confidence: z.number().min(0).max(1).optional().describe('Opcional: A confiança da identificação.'),
      })
    )
    .describe('Uma lista dos objetos identificados na imagem.'),
});
export type IdentifyObjectsToolOutput = z.infer<
  typeof IdentifyObjectsToolOutputSchema
>;

export const identifyObjectsInImageTool = ai.defineTool(
  {
    name: 'identifyObjectsInImageTool',
    description:
      'Identifica objetos em uma imagem fornecida como data URI. Retorna uma lista de nomes de objetos.',
    inputSchema: IdentifyObjectsToolInputSchema,
    outputSchema: IdentifyObjectsToolOutputSchema,
  },
  async (input: IdentifyObjectsToolInput) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest', // Modelo multimodal
      prompt: `Analise a imagem fornecida e liste os objetos distintos que você identifica.
Concentre-se nos objetos mais proeminentes.
Retorne a saída como um objeto JSON com uma chave "objects", onde "objects" é um array de objetos, cada um com uma chave "name".
Imagem: {{media url=${input.imageDataUri}}}`,
      output: {
        format: 'json',
        schema: IdentifyObjectsToolOutputSchema,
      },
      config: {
        temperature: 0.2, // Baixa temperatura para tarefas de extração factual
      }
    });
    return output || { objects: [] };
  }
);
