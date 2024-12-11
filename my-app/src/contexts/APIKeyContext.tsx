import { createContext, useContext, useState, ReactNode } from 'react';

interface APIKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  hasKey: boolean;
}

const APIKeyContext = createContext<APIKeyContextType | undefined>(undefined);

export const APIKeyProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKey] = useState('');

  const value = {
    apiKey,
    setApiKey,
    hasKey: !!apiKey
  };

  return (
    <APIKeyContext.Provider value={value}>
      {children}
    </APIKeyContext.Provider>
  );
};

export const useAPIKey = () => {
  const context = useContext(APIKeyContext);
  if (context === undefined) {
    throw new Error('useAPIKey must be used within an APIKeyProvider');
  }
  return context;
}; 