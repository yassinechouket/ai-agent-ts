import { config } from "dotenv";
import { execSync } from "child_process";

// Load environment variables from .env
config();

// Execute the command passed as arguments, passing all environment variables
const command = process.argv.slice(2).join(" ");
execSync(command, { 
  stdio: "inherit",
  env: {
    ...process.env,
    LMNR_PROJECT_API_KEY: process.env.LMNR_API_KEY || process.env.LMNR_PROJECT_API_KEY,
  }
});
