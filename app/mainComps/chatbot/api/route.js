import { assistantId } from "@libs/assistantInit";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const runtime = "edge";

export default async function route(req, res) {
  if (req.method === "POST") {
    // Extract user input from the request body
    const { user_input } = await req.json();

    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add user message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: user_input,
    });

    // Define instructions for the assistant
    const { instructions } = `
		- Clear and actionable steps for the user's query.
		- Friendly and engaging tone to make the user feel supported.
		- Relevant tips or information based on the latest travel and crowdfunding trends.
		- A personalized response that is tailored to the user's query.
		- Sound confident and trustworthy. 
		- A response that is no longer than 150 words.
		`;

    // Create a run
    const run = await openai.beta.threads.runs.create(thread.id, {
      // Ensure you have a valid assistant_id
      assistant_id: assistantId,
      instructions: instructions,
    });

    // Extract and format the response
    const assistantResponse = run.messages.find(
      (m) => m.role === "assistant"
    )?.content;

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(assistantResponse);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
