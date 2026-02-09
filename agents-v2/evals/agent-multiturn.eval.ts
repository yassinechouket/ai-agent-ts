import { evaluate } from "@lmnr-ai/lmnr";
import { llmJudge } from "./evaluators.ts";
import type { MultiTurnEvalData, MultiTurnTarget,MultiTurnResult } from "./types.ts";
import dataset from "./data/agent-multiturn.json" with { type: "json" };
import { multiTurnWithMocks } from "./executors.ts";

const executor = async (data: MultiTurnEvalData): Promise<MultiTurnResult> => {
  return multiTurnWithMocks(data);
};

evaluate({
  data: dataset as any,
  executor,
  evaluators: {
    // LLM judge evaluates if the agent's response correctly uses tool results
    judgeScore: async (output, target: any) => {
      return await llmJudge(output, target);
    },
  },
  config: {
    projectApiKey: process.env.LMNR_PROJECT_API_KEY,
  },
  groupName: "Multi-turn Agent Evaluation with LLM Judge",
});
