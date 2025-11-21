import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-reasoning-chain.ts';
import '@/ai/flows/analyze-reasoning-for-errors.ts';
import '@/ai/flows/generate-pipeline-from-prompt.ts';