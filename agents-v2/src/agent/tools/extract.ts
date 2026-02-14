import { tavily } from '@tavily/core';
import { tool } from "ai";
import { z } from "zod";

const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

export const extractTool = tool({
    name: 'extract',
    description: 'Use this tool to extract information from a given text.',
    inputSchema: z.object({
        text: z.string().describe('The text to extract information from'),
    }),
    execute: async ({ text }) => {
        return await tavilyClient.extract([text]);
    },
});