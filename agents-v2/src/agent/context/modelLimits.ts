import type { ModelLimits } from "../../types.ts";

/**
 * Default threshold for context window usage (80%)
 */
export const DEFAULT_THRESHOLD = 0.8;

/**
 * Model limits registry
 * Currently only includes Gemini models
 */
const MODEL_LIMITS: Record<string, ModelLimits> = {
  "gemini-1.5-flash": {
    inputLimit: 128000,
    outputLimit: 16000,
    contextWindow: 128000,
  },
  "gemini-1.5-pro": {
    inputLimit: 128000,
    outputLimit: 16000,
    contextWindow: 128000,
  },
};

/**
 * Default limits used when model is not found in registry
 */
const DEFAULT_LIMITS: ModelLimits = {
  inputLimit: 128000,
  outputLimit: 16000,
  contextWindow: 128000,
};

/**
 * Get token limits for a specific model.
 * Falls back to default limits if model not found.
 * Matches Gemini variants (gemini-*, etc.)
 */
export function getModelLimits(model: string): ModelLimits {
  // Direct match
  if (MODEL_LIMITS[model]) {
    return MODEL_LIMITS[model];
  }

  // Check for gemini variants
  if (model.startsWith("gemini-")) {
    return MODEL_LIMITS["gemini-1.5-flash"];
  }

  return DEFAULT_LIMITS;
}

/**
 * Check if token usage exceeds the threshold
 */
export function isOverThreshold(
  totalTokens: number,
  contextWindow: number,
  threshold: number = DEFAULT_THRESHOLD,
): boolean {
  return totalTokens >= contextWindow * threshold;
}

/**
 * Calculate usage percentage
 */
export function calculateUsagePercentage(
  totalTokens: number,
  contextWindow: number,
): number {
  if (contextWindow === 0) {
    return 0;
  }
  return (totalTokens / contextWindow) * 100;
}
