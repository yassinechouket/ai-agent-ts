import "dotenv/config";
import { generateText, type ModelMessage } from "ai";
import {executeTool} from "./executeTool.ts";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getTracer,Laminar } from "@lmnr-ai/lmnr";
import { SYSTEM_PROMPT } from "./system/prompt.ts";

import type { AgentCallbacks } from "../types.ts";
import { tools } from "./tools/index.ts";
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});


Laminar.initialize({
  projectApiKey:process.env.LMNR_API_KEY,
})

const MODEL_NAME = "gemini-3-flash-preview";

export const runAgent = async (
  userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks,
): Promise<ModelMessage[]> => {
    const {text}=await generateText({
    model: google(MODEL_NAME),
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

