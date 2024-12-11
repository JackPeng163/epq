import OpenAI from 'openai';

let openai: OpenAI | null = null;

const getOpenAIInstance = (apiKey: string) => {
  if (!apiKey) {
    throw new Error('OpenAI API key not found');
  }
  
  if (!openai || openai.apiKey !== apiKey) {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }
  return openai;
};

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const callOpenAI = async (messages: ChatMessage[], apiKey: string): Promise<string> => {
  try {
    const openai = getOpenAIInstance(apiKey);
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
