import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const callOpenAI = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI API call failed: ${error.message}`);
    }
    throw error;
  }
};
