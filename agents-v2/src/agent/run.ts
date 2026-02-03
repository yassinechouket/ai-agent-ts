import "dotenv/config";
import { generateText, type ModelMessage } from "ai";
import {executeTool} from "./executeTool.ts";
import { createOpenAI } from "@ai-sdk/openai";
import { getTracer,Laminar } from "@lmnr-ai/lmnr";
import { SYSTEM_PROMPT } from "./system/prompt.ts";

import type { AgentCallbacks } from "../types.ts";
import { tools } from "./tools/index.ts";
const groq = createOpenAI({
  apiKey: process.env.LLAMA_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});


Laminar.initialize({
  projectApiKey:process.env.LMNR_API_KEY,
})

const MODEL_NAME = "llama-3.1-8b-instant";

export const runAgent = async (
  userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks,
): Promise<ModelMessage[]> => {
    const {text}=await generateText({
    model: groq(MODEL_NAME),
    prompt:userMessage,
    system:SYSTEM_PROMPT,
    tools,
    experimental_telemetry: {
        isEnabled: true,
        tracer: getTracer(),
      },
    });
    console.log(text);

    console.log("done");
    
    return [
      ...conversationHistory,
      { role: "user", content: userMessage },
      { role: "assistant", content: text },
    ];
};

