'use client';

import type { PipelineExecution, ReasoningStep } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { BrainCircuit, CheckCircle2, FileText, Lightbulb, Loader2, Search, Target } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Mock animation with framer-motion since it's a common pattern, even if not in deps.
// This will gracefully degrade. If not, simple presence is fine.
// Let's remove framer-motion and use CSS.

const StepIcon = ({ step }: { step: ReasoningStep }) => {
  if (step.tool === 'Search') return <Search className="size-5" />;
  return <Lightbulb className="size-5" />;
};

export function PipelineVisualization({ execution }: { execution: PipelineExecution }) {

  const getStatusBadge = (status: PipelineExecution['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Completed</Badge>;
      case 'running':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 animate-pulse">Running</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-6 before:h-full before:w-0.5 before:bg-border/70 before:content-['']">
        
        {/* Initial Prompt */}
        <div className="relative">
          <div className="absolute top-5 left-6 -ml-[13px] mt-0.5 h-6 w-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
            <FileText className="size-3 text-primary" />
          </div>
          <Card className="ml-16 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">Initial Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{execution.prompt}</p>
            </CardContent>
          </Card>
        </div>

        {/* Reasoning Steps */}
        {execution.reasoningSteps.map((step, index) => (
          <div key={step.step} className="relative animate-fade-in" style={{ animationDelay: `${index * 100}ms`}}>
             <div className="absolute top-5 left-6 -ml-[13px] mt-0.5 h-6 w-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
               <BrainCircuit className="size-3 text-primary" />
            </div>
            <Card className="ml-16">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-3">
                  <StepIcon step={step} />
                  <span>{step.title}</span>
                </CardTitle>
                <CardDescription>Step {step.step}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1 text-sm">Thought</h4>
                  <p className="text-muted-foreground text-sm">{step.thought}</p>
                </div>
                {step.tool && step.toolInput && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Tool Used: <Badge variant="outline">{step.tool}</Badge></h4>
                    <pre className="bg-muted/50 p-3 rounded-md font-code text-sm overflow-x-auto">
                      <code>{step.toolInput}</code>
                    </pre>
                  </div>
                )}
                 <div>
                  <h4 className="font-semibold mb-1 text-sm">Observation</h4>
                  <p className="text-muted-foreground text-sm">{step.observation}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        
        {/* Running/Loading Indicator */}
        {execution.status === 'running' && (
           <div className="relative animate-fade-in">
             <div className="absolute top-5 left-6 -ml-[13px] mt-0.5 h-6 w-6 rounded-full bg-background border-2 border-accent flex items-center justify-center animate-spin">
               <Loader2 className="size-3 text-accent" />
             </div>
             <Card className="ml-16 bg-transparent border-dashed">
                <CardHeader>
                    <CardTitle className="text-lg text-muted-foreground">Generating...</CardTitle>
                </CardHeader>
             </Card>
           </div>
        )}
        
        {/* Final Conclusion */}
        {execution.status === 'completed' && (
          <div className="relative animate-fade-in">
            <div className="absolute top-5 left-6 -ml-[13px] mt-0.5 h-6 w-6 rounded-full bg-accent border-2 border-accent flex items-center justify-center">
              <Target className="size-3 text-accent-foreground" />
            </div>
            <Card className="ml-16 border-accent">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Final Conclusion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{execution.finalConclusion}</p>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
       <style jsx>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
            opacity: 0;
        }
    `}</style>
    </div>
  );
}
