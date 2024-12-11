import { callOpenAI } from "./api";
import { SYSTEM_PROMPT, CRITERIA_SUGGESTION_PROMPT, ALTERNATIVES_SUGGESTION_PROMPT } from "./prompt";

export const getAISuggestions = async (goal: string, apiKey: string): Promise<string> => {
  const messages = [
    { 
      role: 'system' as const, 
      content: SYSTEM_PROMPT 
    },
    { 
      role: 'user' as const, 
      content: CRITERIA_SUGGESTION_PROMPT.replace('{goal}', goal)
    }
  ];
  
  const response = await callOpenAI(messages, apiKey);
  return response
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .map(line => line.substring(1).trim())
    .join(',');
};

export const getAlternativeSuggestions = async (goal: string, apiKey: string): Promise<string> => {
  const messages = [
    { 
      role: 'system' as const, 
      content: SYSTEM_PROMPT 
    },
    { 
      role: 'user' as const, 
      content: ALTERNATIVES_SUGGESTION_PROMPT.replace('{goal}', goal)
    }
  ];
  
  const response = await callOpenAI(messages, apiKey);
  return response
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .map(line => line.substring(1).trim())
    .join(',');
};