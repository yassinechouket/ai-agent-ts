export function toolsSelected(
  output: SingleTurnResult | MultiTurnResult,
  target: EvalTarget | MultiTurnTarget,
): number {
  const expectedTools =
    "expectedTools" in target
      ? target.expectedTools
      : "expectedToolOrder" in target
        ? target.expectedToolOrder
        : undefined;

  if (!expectedTools?.length) return 1;

  const selected = new Set(
    "toolNames" in output ? output.toolNames : output.toolsUsed,
  );

  return expectedTools.every((t) => selected.has(t)) ? 1 : 0;
}

/**
 * Evaluator: Check if forbidden tools were avoided.
 * Returns 1 if NONE of the forbidden tools are in the output, 0 otherwise.
 * For negative prompts.
 */
export function toolsAvoided(
  output: SingleTurnResult | MultiTurnResult,
  target: EvalTarget | MultiTurnTarget,
): number {
  if (!target.forbiddenTools?.length) return 1;

  const selected = new Set(
    "toolNames" in output ? output.toolNames : output.toolsUsed,
  );

  return target.forbiddenTools.some((t) => selected.has(t)) ? 0 : 1;
}

/**
 * Evaluator: Check if tools were called in the expected order.
 * Returns the fraction of expected tools found in sequence.
 * Order matters but tools don't need to be consecutive.
 */
export function toolOrderCorrect(
  output: MultiTurnResult,
  target: MultiTurnTarget,
): number {
  if (!target.expectedToolOrder?.length) return 1;

  const actualOrder = output.toolCallOrder;

  // Check if expected tools appear in order (not necessarily consecutive)
  let expectedIdx = 0;
  for (const toolName of actualOrder) {
    if (toolName === target.expectedToolOrder[expectedIdx]) {
      expectedIdx++;
      if (expectedIdx === target.expectedToolOrder.length) break;
    }
  }

  return expectedIdx / target.expectedToolOrder.length;
}