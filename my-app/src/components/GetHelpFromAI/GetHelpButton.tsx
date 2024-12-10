import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { SmartToy } from '@mui/icons-material';

interface GetHelpFromAIButtonProps {
  onGetHelp?: () => Promise<void>;
}

const GetHelpFromAIButton = ({ onGetHelp }: GetHelpFromAIButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!onGetHelp) return;
    setIsLoading(true);
    try {
      await onGetHelp();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={isLoading ? <CircularProgress size={20} /> : <SmartToy />}
      onClick={handleClick}
      disabled={isLoading}
      sx={{ 
        borderRadius: 4,
        px: 3,
        py: 1,
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2,
          bgcolor: 'primary.light',
          borderColor: 'primary.main'
        }
      }}
    >
      {isLoading ? 'Getting AI Help...' : 'Get help from AI'}
    </Button>
  );
};

export default GetHelpFromAIButton; 