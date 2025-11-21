import type { PipelineExecution } from './types';

export const mockExecutions: PipelineExecution[] = [
  {
    id: 'exec-1',
    prompt: 'What was the approximate revenue of NVIDIA in their 2023 fiscal year?',
    pipelineDefinition: JSON.stringify({
      "steps": [
        {"action": "Find fiscal year 2023 revenue for NVIDIA.", "input": "NVIDIA"},
        {"action": "Format the result.", "input": "Result of step 1"}
      ]
    }, null, 2),
    reasoningSteps: [
      {
        step: 1,
        title: 'Initial Thought',
        thought: 'I need to find a specific financial data point: NVIDIA\'s revenue for fiscal year 2023. This requires a search.',
        observation: 'The plan is to use a search tool to find financial reports or news articles with this information.',
      },
      {
        step: 2,
        title: 'Execute Search',
        thought: 'I will use a search engine to get the revenue data.',
        tool: 'Search',
        toolInput: 'NVIDIA revenue fiscal year 2023',
        observation: 'Search results point to official financial statements and reports. Multiple sources state the revenue was approximately $27 billion.',
      },
      {
        step: 3,
        title: 'Synthesize & Verify',
        thought: 'The figure of ~$27 billion appears consistent across reliable sources. I will now formulate the final answer.',
        observation: 'No conflicting information was found. The conclusion is ready.',
      }
    ],
    finalConclusion: 'NVIDIA\'s revenue for its 2023 fiscal year was approximately $27 billion.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'completed',
  },
  {
    id: 'exec-2',
    prompt: 'Write a short, uplifting poem about the sunrise.',
    pipelineDefinition: JSON.stringify({
      "steps": [
        {"action": "Brainstorm themes for an uplifting sunrise poem.", "input": "sunrise, hope, new beginnings"},
        {"action": "Draft poem using themes.", "input": "Result of step 1"},
        {"action": "Refine poem for flow and imagery.", "input": "Result of step 2"}
      ]
    }, null, 2),
    reasoningSteps: [
       {
        step: 1,
        title: 'Analyze Request',
        thought: 'The user wants a short, uplifting poem about the sunrise. Key concepts are "short", "uplifting", and "sunrise".',
        observation: 'I should focus on imagery of light, warmth, and the theme of new opportunities.',
      },
      {
        step: 2,
        title: 'Drafting',
        thought: 'I will now generate a few lines combining the ideas of light overcoming darkness and the start of a new day.',
        observation: 'The initial draft is complete. It has the right tone.',
      }
    ],
    finalConclusion: 'A canvas painted gold and red,\nA new day\'s promise lies ahead.\nThe shadows flee, the darkness wanes,\nAs morning\'s gentle light remains.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
  }
];
