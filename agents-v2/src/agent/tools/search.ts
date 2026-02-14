import { tavily } from '@tavily/core';
import { tool } from "ai";
import { z } from "zod";

const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

export const searchTool = tool({
  name: 'search',
  description: 'Use this tool to search the web for information.',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
  }),
  execute: async ({ query }) => {
  return await tavilyClient.search(query);
    },
});