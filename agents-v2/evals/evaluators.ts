
import type{SingleTurnResult,MultiTurnResult}from "./types.js";
import type{EvalTarget,MultiTurnTarget}from "./types.js";
import {z} from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";

const judgeSchema = z.object({
  score: z
    .number()
    .min(1)
    .max(10)
    .describe("Score from 1-10 where 10 is perfect"),
  reason: z.string().describe("Brief explanation for the score"),

});
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const MODEL_NAME = "gpt-4o-mini";

export async function llmJudge(
  output: MultiTurnResult,
  target: MultiTurnTarget,
):Promise<number>{
  const result=await generateObject({
    model: openai(MODEL_NAME),
    schema: judgeSchema,
    schemaName: "evaluation",
    providerOptions:{
     google:{
      reasoningEffort: "high",
     },
    },
    schemaDescription: "Evaluation of an AI agent response",
    messages: [
      {
        role: "system",
        content: `You are an evaluation judge. Score the agent's response on a scale of 1-10.

        Scoring criteria:
        - 10: Response fully addresses the task using tool results correctly
        - 7-9: Response is mostly correct with minor issues
        - 4-6: Response partially addresses the task
        - 1-3: Response is mostly incorrect or irrelevant`,
              
      },
       {
        role: "user",
        content: `Task: ${target.originalTask}

          Tools called: ${JSON.stringify(output.toolCallOrder)}
          Tool results provided: ${JSON.stringify(target.mockToolResults)}

          Agent's final response:
          ${output.text}

          Evaluate if this response correctly uses the tool results to answer the task.`,
      },
    ]
  });

   return result.object.score / 10;
}



export function toolsSelectedScore(
  output:SingleTurnResult,
  target:EvalTarget,
):number{
  if(!target.expectedTools?.length){
    return output.selectedAny ? 0.5:1;
  }
  const expected =new Set(target.expectedTools);
  const selected =new Set(output.toolNames);

  const hits = output.toolNames
  .filter((t) => expected.has(t))
  .length;
  const precision =
  selected.size > 0 ? hits / selected.size : 0;
  const recall =
  expected.size > 0 ? hits / expected.size : 0;
  if (precision + recall === 0) return 0;

  return (2 * precision * recall) / (precision + recall);
}


  
