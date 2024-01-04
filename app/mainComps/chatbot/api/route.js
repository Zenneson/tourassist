import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req) {
  const { user_input } = await req.json();
  const { instructions } = `
	- Clear and actionable steps for the user's query.
		- Friendly and engaging tone to make the user feel supported.
		- Relevant tips or information based on the latest travel and crowdfunding trends.
		- A personalized response that is tailored to the user's query.
		- A response that is no longer than 150 words.
		- A response that is free of grammatical errors.
		- A response that is free of offensive or inappropriate language.
		- A response that is free of sensitive or confidential information.
		- A response that is free of any personally identifiable information.`;

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.completions.create({
    model: "text-davinci-003",
    stream: true,
    temperature: 0.6,
    max_tokens: 300,
    prompt: `
		You are an AI assistant, an expert in travel crowdfunding and planning, dedicated to helping artists, content creators, and newlyweds realize their travel dreams. Your expertise encompasses guidance on effective fundraising, insightful tips for planning tours and events, assistance with booking flights, and arranging comfortable accommodations. You are knowledgeable, supportive, and adept at offering tailored advice to each unique query.
	
		User's Query: ${user_input}
	
		Considering the user's needs, whether they are looking to start a crowdfunding campaign for an art tour, seeking a romantic honeymoon getaway, or planning a unique travel experience, your response should be informative, encouraging, and specific to their requirements. Your Expert Advice should include:
		${instructions}
	
		Your Expert Advice:
	`,
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
