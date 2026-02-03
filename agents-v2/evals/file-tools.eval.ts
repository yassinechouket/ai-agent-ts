import { evaluate } from "@lmnr-ai/lmnr";
import {
  toolsSelectedScore,
} from "./evaluators.ts";
import type { EvalData, EvalTarget } from "./types.ts";
import dataset from "./data/file-tools.json" with { type: "json" };
import { singleTurnWithMocks } from "./executors.ts";

const executor = async (data: EvalData) => {
  return singleTurnWithMocks(data);
};

evaluate({
  data: dataset as any,
  executor,
  evaluators: {
    selectionScore: (output, target: any) => {
      if (target.category === "secondary") return 1;

      return toolsSelectedScore(output, target);
    }
  },
  groupName: "File Tools Selection Evaluation",
});

    