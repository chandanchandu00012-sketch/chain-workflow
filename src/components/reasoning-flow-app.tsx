'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  BrainCircuit,
  FileText,
  History,
  Loader2,
  Plus,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { PipelineExecution } from '@/lib/types';
import { mockExecutions } from '@/lib/mock-data';
import { PipelineVisualization } from './pipeline-visualization';
import { useToast } from '@/hooks/use-toast';
import { generatePipelineFromPrompt } from '@/ai/flows/generate-pipeline-from-prompt';
import { executeReasoningPipeline } from '@/ai/flows/execute-reasoning-pipeline';
import { formatDistanceToNow } from 'date-fns';


export function ReasoningFlowApp() {
  const [executions, setExecutions] = React.useState<PipelineExecution[]>(mockExecutions);
  const [activeExecutionId, setActiveExecutionId] = React.useState<string | null>(executions[0]?.id || null);
  const [prompt, setPrompt] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const activeExecution = React.useMemo(() => {
    return executions.find((e) => e.id === activeExecutionId) || null;
  }, [executions, activeExecutionId]);

  const handleGenerateAndExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    let newExecutionId = `exec-${Date.now()}`;
    try {
      // 1. Generate the pipeline definition
      const pipelineDefResult = await generatePipelineFromPrompt({ prompt });
      const pipelineDefinition = pipelineDefResult.pipelineDefinition;
      
      // 2. Create the initial execution object
      const newExecution: PipelineExecution = {
        id: newExecutionId,
        timestamp: new Date().toISOString(),
        prompt,
        pipelineDefinition,
        reasoningSteps: [],
        finalConclusion: '',
        status: 'running',
      };

      setExecutions(prev => [newExecution, ...prev]);
      setActiveExecutionId(newExecution.id);
      setPrompt('');

      // 3. Execute the pipeline
      const executionResult = await executeReasoningPipeline({ prompt, pipelineDefinition });

      // 4. Update the execution with the results
      setExecutions(prev => prev.map(exec => 
        exec.id === newExecutionId 
          ? { 
              ...exec, 
              reasoningSteps: executionResult.reasoningSteps,
              finalConclusion: executionResult.finalConclusion, 
              status: 'completed' 
            }
          : exec
      ));

    } catch (error) {
      console.error('Failed to generate or execute pipeline:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while processing your request.',
      });
      // Mark the execution as failed
      setExecutions(prev => prev.map(exec => 
        exec.id === newExecutionId 
          ? { ...exec, status: 'failed', finalConclusion: 'The AI failed to complete the request.' }
          : exec
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-sidebar-border">
        <SidebarHeader>
          <div className="flex items-center gap-2.5 p-2">
            <BrainCircuit className="text-primary size-7" />
            <h1 className="font-bold text-lg text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              ReasoningFlow
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveExecutionId(null)}
                isActive={activeExecutionId === null}
                tooltip="New Pipeline"
              >
                <Plus />
                <span>New Pipeline</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator />
          <div className="px-4 text-xs font-medium text-sidebar-foreground/70 mb-2 group-data-[collapsible=icon]:hidden">
            History
          </div>
          <SidebarMenu>
            {executions.map((exec) => (
              <SidebarMenuItem key={exec.id}>
                <SidebarMenuButton
                  onClick={() => setActiveExecutionId(exec.id)}
                  isActive={exec.id === activeExecutionId}
                  tooltip={{
                    children: exec.prompt,
                    side: 'right',
                    align: 'start',
                    className: 'max-w-xs'
                  }}
                >
                  <History />
                  <div className="flex flex-col items-start truncate">
                    <span className="truncate">{exec.prompt}</span>
                    <span className="text-xs text-sidebar-foreground/60">
                      {formatDistanceToNow(new Date(exec.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="group-data-[collapsible=icon]:hidden">
          <p className="text-xs text-sidebar-foreground/50 px-4">
            Data is stored in-memory for demo.
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="max-h-svh flex flex-col">
        <header className="flex items-center gap-3 p-4 border-b">
          <SidebarTrigger className="md:hidden" />
          {activeExecutionId === null ? (
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bot className="text-primary" /> Create New Reasoning Pipeline
            </h2>
          ) : (
            <h2 className="text-xl font-semibold flex items-center gap-2 truncate">
              <FileText className="text-primary" />
              <span className="truncate">{activeExecution?.prompt}</span>
            </h2>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeExecution ? (
            <PipelineVisualization execution={activeExecution} key={activeExecution.id} />
          ) : (
            <div className="max-w-3xl mx-auto">
              <h3 className="text-lg font-medium mb-4">Describe the task for the LLM</h3>
              <form onSubmit={handleGenerateAndExecute} className="space-y-4">
                <Textarea
                  placeholder="e.g., 'What is the capital of France and what is its population?'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  className="text-base"
                />
                <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full sm:w-auto">
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <BrainCircuit />
                  )}
                  <span>Generate & Execute</span>
                </Button>
              </form>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
