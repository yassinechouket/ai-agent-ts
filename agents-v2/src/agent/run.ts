import "dotenv/config";
import { streamText, type ModelMessage, type Tool } from "ai";
import {executeTool} from "./executeTool.ts";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getTracer,Laminar } from "@lmnr-ai/lmnr";
import { SYSTEM_PROMPT } from "./system/prompt.ts";

import { filterCompatibleMessages } from "./system/filterMessages.ts";

import type { AgentCallbacks, ToolCallInfo } from "../types.ts";
import { tools } from "./tools/index.ts";
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});


Laminar.initialize({
  projectApiKey:process.env.LMNR_API_KEY,
})

const MODEL_NAME = "gemini-3-flash-preview";

export async function runAgent(
  userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks,
): Promise<ModelMessage[]> {
  const workingHistory = filterCompatibleMessages(conversationHistory);

  const messages: ModelMessage[] = [
    { role: "system",
      content: SYSTEM_PROMPT,
    },...workingHistory,
    { role: "user", content: userMessage },
  ];
  let fullResponse = "";
  
  

  while (true) {
    const result = streamText({
      model: google(MODEL_NAME),
      messages,
      tools,
      experimental_telemetry: {
        isEnabled: true,
        tracer: getTracer(),
      },
      

    });

    const toolCalls:ToolCallInfo[] = [];
    let currentText = "";
    let streamError: Error | null = null;

    try{
      for await(const chunk of result.fullStream) {
      if(chunk.type=="text-delta"){
        currentText += chunk.text;
        callbacks.onToken(chunk.text);
      }
      if(chunk.type === "tool-call") {
        const input="input" in chunk ? chunk.input : {};
        toolCalls.push({
          toolCallId: chunk.toolCallId,
          toolName: chunk.toolName,
          args: input as Record<string, unknown>,
        });
        callbacks.onToolCallStart(chunk.toolName, input);

      }
    }


    }
    catch(e){
      streamError=e as Error;

       if (
        !currentText &&
        !streamError.message.includes("No output generated")
      ) {
        throw streamError;
      }
    }

    fullResponse += currentText;

    if (streamError && !currentText) {
      // Add a fallback response
      fullResponse =
        "I apologize, but I wasn't able to generate a response. Could you please try rephrasing your message?";
      callbacks.onToken(fullResponse);
      break;
    }
    const finishReason=await result.finishReason;
    if (finishReason !== "tool-calls" || toolCalls.length === 0) {
      const responseMessages = await result.response;
      messages.push(...responseMessages.messages);
      break;
    }
    const responseMessages = await result.response;
    messages.push(...responseMessages.messages);
    for (const tc of toolCalls) {
      const result = await executeTool(tc.toolName, tc.args);
      callbacks.onToolCallEnd(tc.toolName, result);

      messages.push({
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolCallId: tc.toolCallId,
            toolName: tc.toolName,
            output: { type: "text", value: result },
          },
        ],
      });
    }
  }

  callbacks.onComplete(fullResponse);

  return messages;
  

};
