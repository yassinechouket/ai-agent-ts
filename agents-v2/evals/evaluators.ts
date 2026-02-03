
import type{SingleTurnResult,MultiTurnResult}from "./types.js";
import type{EvalTarget,MultiTurnTarget}from "./types.js";

export function toolsSelectedScore(
  output:SingleTurnResult,
  target:EvalTarget,
):number{
  if(!target.expectedTools?.length){
    return output.selectedAny ? 0.5:1;
  }
  const expected =new Set(target.expectedTools);
  const selected =new Set(output.toolNames);

  const hits = output.toolNames
  .filter((t) => expected.has(t))
  .length;
  const precision =
  selected.size > 0 ? hits / selected.size : 0;
  const recall =
  expected.size > 0 ? hits / expected.size : 0;
  if (precision + recall === 0) return 0;

  return (2 * precision * recall) / (precision + recall);
}


  
