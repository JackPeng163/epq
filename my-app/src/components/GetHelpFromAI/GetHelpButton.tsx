import { useState } from 'react';
import { Button } from '@mui/material';
import { SmartToy } from '@mui/icons-material';
import GetHelpFromAIDialog from './Dialog';
import { AHPState } from '../../types/ahp';

interface GetHelpFromAIButtonProps {
  ahpState: AHPState | undefined;
}

const GetHelpFromAIButton = ({ ahpState }: GetHelpFromAIButtonProps) => {

  const [showGetHelpDialog, setShowGetHelpDialog] = useState(false);

  const handleClick = () => {
    setShowGetHelpDialog(true);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<SmartToy />}
        onClick={handleClick}
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
        Get help from AI
      </Button>
      <GetHelpFromAIDialog
        open={showGetHelpDialog}
        onClose={() => setShowGetHelpDialog(false)}
        ahpState={ahpState}
      />
    </>
  );
};

export default GetHelpFromAIButton; 