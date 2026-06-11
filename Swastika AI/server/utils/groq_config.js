import Groq from 'groq-sdk';

export function groq_chat(prompt){
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion(prompt) {
  const result = groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "openai/gpt-oss-20b",
  });

  return result;
}
return getGroqChatCompletion(prompt);
}


