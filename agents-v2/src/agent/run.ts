import "dotenv/config";
import { generateText, type ModelMessage } from "ai";
import {executeTool} from "./executeTool.ts";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import { SYSTEM_PROMPT } from "./system/prompt.ts";
import type { AgentCallbacks } from "../types.ts";
import { tools } from "./tools/index.ts";
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const MODEL_NAME = "gemini-3-flash-preview";

export const runAgent = async (
  userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks,
)=>{
    const {text,toolCalls}=await generateText({
    model: google(MODEL_NAME),
    prompt:userMessage,
    system:SYSTEM_PROMPT,
    tools,
    });
    console.log(text, toolCalls);

    toolCalls.forEach(async(tc)=>{
      console.log(await executeTool(tc.toolName, tc.input as Record<string, unknown>));
    });
};

runAgent("what is the current date and time?", [], {});