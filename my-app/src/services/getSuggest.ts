import { callOpenAI } from "./api";
import { SYSTEM_PROMPT, CRITERIA_SUGGESTION_PROMPT, ALTERNATIVES_SUGGESTION_PROMPT } from "./prompt";

export const getAISuggestions = async (goal: string): Promise<string> => {
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
  
  const response = await callOpenAI(messages);
  // 处理返回的字符串，移除可能的空行并分割成数组
  return response
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .map(line => line.substring(1).trim())
    .join(',');
};

export const getAlternativeSuggestions = async (goal: string): Promise<string> => {
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
  
  const response = await callOpenAI(messages);
  return response
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .map(line => line.substring(1).trim())
    .join(',');
};