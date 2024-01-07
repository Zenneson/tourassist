import kv from "@vercel/kv";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req) {
  const { messages } = await req.json();
  const key = JSON.stringify(messages);

  const cached = await kv.get(key);
  if (cached) {
    // return new Response(cached);
    const chunks = cached.split(" ");
    const stream = new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          const bytes = new TextEncoder().encode(chunk + " ");
          controller.enqueue(bytes);
          await new Promise((r) =>
            setTimeout(r, Math.floor(Math.random() * 40) + 10)
          );
        }
        controller.close();
      },
    });
    return new StreamingTextResponse(stream);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
  });

  const stream = OpenAIStream(response, {
    async onFinal(completion) {
      await kv.set(key, completion);
      await kv.expire(key, 60 * 60);
    },
  });
  return new StreamingTextResponse(stream);
}
