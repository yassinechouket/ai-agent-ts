import { tavily } from '@tavily/core';
import { tool } from "ai";
import { z } from "zod";

const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});
export const crawlTool = tool({
  name: 'crawl',
  description: 'Use this tool to crawl a website for information.',
    inputSchema: z.object({
        url: z.string().describe('The URL of the website to crawl'),
    }),
  execute: async ({ url }) => {
    return await tavilyClient.crawl(url);
  }
});