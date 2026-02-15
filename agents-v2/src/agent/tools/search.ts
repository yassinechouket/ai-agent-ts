import { tavily } from '@tavily/core';
import { tool } from "ai";
import { z } from "zod";
import { ChromaClient } from "chromadb";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

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
    const response = await tavilyClient.search(query);
    
    
    return {
      query: response.query,
      results: response.results.map((r) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })),
    };
  },
});

const chroma = new ChromaClient({
  port: 8000,
  host: "localhost",
});


export const searchVectorDB= tool({
  name: 'search_vector_db',
  description: 'Use this tool to search the vector database for relevant documents.',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
    topK: z.number().optional().describe('The number of results to return'),
  }),
  execute: async ({ query, topK = 3 }) => {
      const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: query,
      });
    const collection = await chroma.getCollection({
      name: "company-knowledge",
    });

    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
    });
    return results.documents?.[0].map((text, i) => ({
      text,
      score: results.distances?.[0]?.[i],
      metadata: results.metadatas?.[0]?.[i],
    }));
  }
});
