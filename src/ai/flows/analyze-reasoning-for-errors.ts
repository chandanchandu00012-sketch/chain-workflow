'use server';
/**
 * @fileOverview Analyzes reasoning steps for errors and inconsistencies.
 *
 * - analyzeReasoningForErrors - Analyzes the captured reasoning steps and highlights potential errors or inconsistencies.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeReasoningForErrorsInputSchema = z.object({
  reasoningSteps: z.string().describe('The captured reasoning steps to analyze.'),
});

const AnalyzeReasoningForErrorsOutputSchema = z.object({
  errors: z.array(z.string()).describe('A list of potential errors or inconsistencies found in the reasoning steps.'),
  suggestions: z.array(z.string()).describe('Suggestions for improving the reasoning pipeline.'),
});

export async function analyzeReasoningForErrors(input: z.infer<typeof AnalyzeReasoningForErrorsInputSchema>): Promise<z.infer<typeof AnalyzeReasoningForErrorsOutputSchema>> {
  return analyzeReasoningForErrorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeReasoningForErrorsPrompt',
  input: {schema: AnalyzeReasoningForErrorsInputSchema},
  output: {schema: AnalyzeReasoningForErrorsOutputSchema},
  prompt: `You are an AI expert in analyzing reasoning pipelines for errors and inconsistencies. Analyze the following reasoning steps and identify potential errors or inconsistencies in the logic. Provide suggestions for improving the reasoning pipeline.

Reasoning Steps:
{{{reasoningSteps}}}
`,
});

const analyzeReasoningForErrorsFlow = ai.defineFlow(
  {
    name: 'analyzeReasoningForErrorsFlow',
    inputSchema: AnalyzeReasoningForErrorsInputSchema,
    outputSchema: AnalyzeReasoningForErrorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
