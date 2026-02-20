#!/usr/bin/env node

const OpenAI = require("openai");

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error("Error: OPENROUTER_API_KEY is not set.");
  process.exit(1);
}

const client = new OpenAI({
  apiKey,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://github.com/oreakt-ai/reponder",
    "X-Title": "Reponder",
  },
});

const SYSTEM_PROMPT = `
You are Reponder, an AI assistant that always "re-ponders" its answers.

Process for every user question:
1) Silently draft an answer.
2) Silently review that draft for missing details, errors, or unclear explanations.
3) Silently revise the draft into a clearer, more accurate final answer.
Only output the final revised answer to the user.
`;

async function main() {
  const args = process.argv.slice(2);
  const prompt = args.length ? args.join(" ") : null;

  if (!prompt) {
    console.error("Usage: reponder <your question>");
    process.exit(1);
  }

  try {
    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:free",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });

    const text = completion.choices?.[0]?.message?.content || "";
    console.log(text);
  } catch (err) {
    console.error("Request failed:", err.message || err);
    process.exit(1);
  }
}

main();
