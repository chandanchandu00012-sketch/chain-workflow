'use server';

/**
 * @fileOverview This file defines a Genkit flow for executing a reasoning pipeline.
 *
 * It exports:
 * - `executeReasoningPipeline`: An async function that takes a prompt and a pipeline definition and returns the execution result.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReasoningStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  thought: z.string(),
  observation: z.string(),
  tool: z.string().optional(),
  toolInput: z.string().optional(),
});

const ExecuteReasoningPipelineInputSchema = z.object({
  prompt: z.string().describe('The user prompt.'),
  pipelineDefinition: z
    .string()
    .describe('A JSON string representing the pipeline definition.'),
});

const ExecuteReasoningPipelineOutputSchema = z.object({
  reasoningSteps: z.array(ReasoningStepSchema).describe("The steps the model took to reach the conclusion."),
  finalConclusion: z.string().describe('The final conclusion.'),
});

type ExecuteReasoningPipelineInput = z.infer<
  typeof ExecuteReasoningPipelineInputSchema
>;
type ExecuteReasoningPipelineOutput = z.infer<
  typeof ExecuteReasoningPipelineOutputSchema
>;

export async function executeReasoningPipeline(
  input: ExecuteReasoningPipelineInput
): Promise<ExecuteReasoningPipelineOutput> {
  return executeReasoningPipelineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'executeReasoningPipelinePrompt',
  input: {schema: ExecuteReasoningPipelineInputSchema},
  output: {schema: ExecuteReasoningPipelineOutputSchema},
  prompt: `You are an AI assistant that executes a reasoning pipeline to answer a user's prompt.
The user's prompt is: {{{prompt}}}

The reasoning pipeline you must follow is defined by this JSON:
{{{pipelineDefinition}}}

Execute the steps in the pipeline. For each step, provide a thought, an observation, and if applicable, the tool used and its input.
Your final output should be a JSON object containing the reasoning steps and the final conclusion.
`,
});

const executeReasoningPipelineFlow = ai.defineFlow(
  {
    name: 'executeReasoningPipelineFlow',
    inputSchema: ExecuteReasoningPipelineInputSchema,
    outputSchema: ExecuteReasoningPipelineOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
