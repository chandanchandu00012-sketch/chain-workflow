'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a pipeline definition from a user prompt.
 *
 * It exports:
 * - `generatePipelineFromPrompt`: An async function that takes a prompt and returns a pipeline definition.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePipelineFromPromptInputSchema = z.object({
  prompt: z.string().describe('A description of the desired reasoning pipeline.'),
});
type GeneratePipelineFromPromptInput = z.infer<typeof GeneratePipelineFromPromptInputSchema>;

const GeneratePipelineFromPromptOutputSchema = z.object({
  pipelineDefinition: z.string().describe('A JSON string representing the generated pipeline definition.'),
});
type GeneratePipelineFromPromptOutput = z.infer<typeof GeneratePipelineFromPromptOutputSchema>;

export async function generatePipelineFromPrompt(input: GeneratePipelineFromPromptInput): Promise<GeneratePipelineFromPromptOutput> {
  return generatePipelineFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePipelineFromPromptPrompt',
  input: {schema: GeneratePipelineFromPromptInputSchema},
  output: {schema: GeneratePipelineFromPromptOutputSchema},
  prompt: `You are an expert pipeline generator. Please create a pipeline definition based on the following description: {{{prompt}}}. The pipeline definition should be a JSON string.
`,
});

const generatePipelineFromPromptFlow = ai.defineFlow(
  {
    name: 'generatePipelineFromPromptFlow',
    inputSchema: GeneratePipelineFromPromptInputSchema,
    outputSchema: GeneratePipelineFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
