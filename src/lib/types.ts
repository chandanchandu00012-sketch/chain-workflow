export interface ReasoningStep {
  step: number;
  title: string;
  thought: string;
  observation: string;
  tool?: string;
  toolInput?: string;
}

export interface PipelineExecution {
  id: string;
  prompt: string;
  pipelineDefinition: string;
  reasoningSteps: ReasoningStep[];
  finalConclusion: string;
  timestamp: string;
  status: 'completed' | 'running' | 'failed';
}
