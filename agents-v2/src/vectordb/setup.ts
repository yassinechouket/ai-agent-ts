import "dotenv/config";
import fs from "fs";
import path from "path";
import { ChromaClient } from "chromadb";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

const chroma = new ChromaClient({
  port:8000,
  host: "localhost",
});

const DOCS_PATH = "C:\\Users\\medya\\Desktop\\AI projects\\ai-agent-TS\\agents-v2\\src\\docs";

async function loadTextFiles() {
  const files = fs.readdirSync(DOCS_PATH).filter(f => f.endsWith(".txt"));

  const docs = [];

  for (const file of files) {
    const filePath = path.join(DOCS_PATH, file);
    const text = fs.readFileSync(filePath, "utf-8");

    docs.push({
      id: file,
      text: text,
      metadata: {
        source: "txt",
        filename: file,
      },
    });
  }

  return docs;
}

async function setupVectorDB() {
  const collection = await chroma.getOrCreateCollection({
    name: "company-knowledge",
  });

  const documents = await loadTextFiles();

  for (const doc of documents) {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: doc.text,
    });

    await collection.add({
      ids: [doc.id],
      embeddings: [embedding],
      documents: [doc.text],
      metadatas: [doc.metadata],
    });

    console.log(`Stored: ${doc.id}`);
  }
}

setupVectorDB();