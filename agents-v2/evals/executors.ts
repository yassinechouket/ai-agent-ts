import { generateText, stepCountIs, tool, type ToolSet } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

import type {
  EvalData,
  SingleTurnResult,
  MultiTurnEvalData,
  MultiTurnResult,
} from "./types.ts";
import { buildMessages, buildMockedTools } from "./utils.ts";

// Use mock mode if EVAL_MOCK_MODE is set (useful for testing with quota limits)
const MOCK_MODE = process.env.EVAL_MOCK_MODE === "true";

const groq = createOpenAI({
  apiKey: process.env.LLAMA_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/**
 * Tool definitions for mocked single-turn evaluations.
 * These define the schema the LLM sees without real implementations.
 */
const TOOL_DEFINITIONS: Record<
    string,
    { description: string; parameters: z.ZodObject<z.ZodRawShape> }
  > = {
    // File tools
    readFile: {
      description: "Read the contents of a file at the specified path",
      parameters: z.object({
        path: z.string().describe("The path to the file to read"),
      }),
    },
    writeFile: {
      description: "Write content to a file at the specified path",
      parameters: z.object({
        path: z.string().describe("The path to the file to write"),
        content: z.string().describe("The content to write to the file"),
      }),
    },
    listFiles: {
      description: "List all files in a directory",
      parameters: z.object({
        path: z.string().describe("The directory path to list files from"),
      }),
    },
    deleteFile: {
      description: "Delete a file at the specified path",
      parameters: z.object({
        path: z.string().describe("The path to the file to delete"),
      }),
    },
    // Shell tools
    runCommand: {
      description: "Execute a shell command and return its output",
      parameters: z.object({
        command: z.string().describe("The shell command to execute"),
      }),
    },
  };

  export async function singleTurnWithMocks(
  data: EvalData,
): Promise<SingleTurnResult> {
  if (MOCK_MODE) {
    // In mock mode, return empty results for testing
    return {
      toolCalls: [],
      toolNames: [],
      selectedAny: false,
    };
  }

  const messages = buildMessages(data);

  // Build mocked tools from definitions
  const tools: ToolSet = {};
  for (const toolName of data.tools) {
    const def = TOOL_DEFINITIONS[toolName];
    if (def) {
      tools[toolName] = tool({
        description: def.description,
        inputSchema: def.parameters,
      });
    }
  }


  const result = await generateText({
    model: groq(data.config?.model ?? "llama-3.1-8b-instant"),
    messages,
    tools,
    stopWhen: stepCountIs(1),
    temperature: data.config?.temperature ?? 0.7,
    maxTokens: 1024,
  });

  const toolCalls = (result.toolCalls ?? []).map((tc) => ({
    toolName: tc.toolName,
    args: "args" in tc ? tc.args : {},
  }));

  const toolNames = toolCalls.map((tc) => tc.toolName);

  return {
    toolCalls,
    toolNames,
    selectedAny: toolNames.length > 0,
  };
}