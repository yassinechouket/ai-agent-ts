import { generateText, type ModelMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { extractMessageText } from "./tokenEstimator.ts";

const SUMMARIZATION_PROMPT = `You are a conversation summarizer. Your task is to create a concise summary of the conversation so far that preserves:

1. Key decisions and conclusions reached
2. Important context and facts mentioned
3. Any pending tasks or questions
4. The overall goal of the conversation

Be concise but complete. The summary should allow the conversation to continue naturally.

Conversation to summarize:
`;

/**
 * Format messages array as readable text for summarization
 */
function messagesToText(messages: ModelMessage[]): string {
  return messages
    .map((msg) => {
      const role = msg.role.toUpperCase();
      const content = extractMessageText(msg);
      return `[${role}]: ${content}`;
    })
    .join("\n\n");
}

/**
A compaction system prompt provides the set of instructions that
 tell the LLM how to compact or summarize conversation history.
  Since compaction involves an LLM with its own context window,
   the system prompt defines what the LLM should preserve (key decisions, conclusions,
    important context,
    facts, pending tasks or questions, and the overall goal) 
   and how to format the summary so the conversation can continue naturally.
 */
export async function compactConversation(
  messages: ModelMessage[],
  model: string = "gpt-4o-mini",
): Promise<any> {
  const conversationMessages =messages.filter((m)=> m.role !== "system");
  const conversationText = messagesToText(conversationMessages);
  
  const { text } = await generateText({
    model: openai(model),
    prompt: SUMMARIZATION_PROMPT + conversationText,
  });

   const compactedMessages: ModelMessage[] = [
    {
      role: "user",
      content: `[CONVERSATION SUMMARY]\nThe following is a summary of our conversation so far:\n\n${text}\n\nPlease continue from where we left off.`,
    },
    {
      role: "assistant",
      content:
        "I understand. I've reviewed the summary of our conversation and I'm ready to continue. How can I help you next?",
    },
  ];

  return compactedMessages;
}

