'use server';
/**
 * @fileOverview Summarizes the reasoning steps and final conclusion of a completed pipeline execution.
 *
 * - summarizeReasoningChain - A function that summarizes the reasoning chain.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReasoningChainInputSchema = z.object({
  reasoningSteps: z.array(z.string()).describe('The individual reasoning steps from the pipeline execution.'),
  finalConclusion: z.string().describe('The final conclusion reached by the pipeline.'),
});

const SummarizeReasoningChainOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the reasoning steps and the final conclusion.'),
});

export async function summarizeReasoningChain(
  input: z.infer<typeof SummarizeReasoningChainInputSchema>
): Promise<z.infer<typeof SummarizeReasoningChainOutputSchema>> {
  return summarizeReasoningChainFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeReasoningChainPrompt',
  input: {schema: SummarizeReasoningChainInputSchema},
  output: {schema: SummarizeReasoningChainOutputSchema},
  prompt: `Summarize the following reasoning steps and final conclusion in a concise manner:\n\nReasoning Steps:\n{{#each reasoningSteps}}\n- {{{this}}}{{/each}}\n\nFinal Conclusion: {{{finalConclusion}}}`,
});

const summarizeReasoningChainFlow = ai.defineFlow(
  {
    name: 'summarizeReasoningChainFlow',
    inputSchema: SummarizeReasoningChainInputSchema,
    outputSchema: SummarizeReasoningChainOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
