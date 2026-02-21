import { readFile, writeFile, listFiles, deleteFile } from "./file.ts";
import { searchTool,searchVectorDB } from "./search.ts";
import { webSearch } from "./WebSearch.ts";
import { runCommand } from "./shell.ts";

// All tools combined for the agent
export const tools = {
  readFile,
  writeFile,
  listFiles,
  deleteFile,
  searchTool,
  searchVectorDB,
  runCommand,


};

// Export individual tools for selective use in evals
export { readFile, writeFile, listFiles, deleteFile } from "./file.ts";
export {webSearch} from "./WebSearch.ts";
export { searchTool,searchVectorDB } from "./search.ts";
export { runCommand } from "./shell.ts";

// Tool sets for evals
export const fileTools = {
  readFile,
  writeFile,
  listFiles,
  deleteFile,
  runCommand,
};