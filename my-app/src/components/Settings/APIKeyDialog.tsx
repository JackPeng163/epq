import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { useAPIKey } from '../../contexts/APIKeyContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const APIKeyDialog = ({ open, onClose, onSave }: Props) => {
  const [inputKey, setInputKey] = useState('');
  const { setApiKey } = useAPIKey();

  const handleSave = () => {
    if (inputKey.trim()) {
      setApiKey(inputKey.trim());
      onSave?.();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>OpenAI API Key Settings</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          To use AI features, you need to provide your OpenAI API key. 
          The key will be stored in memory only.
        </Alert>
        <TextField
          fullWidth
          label="OpenAI API Key"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="sk-..."
          margin="normal"
          type="password"
        />
        <Typography variant="caption" color="text.secondary">
          You can get your API key from{' '}
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            OpenAI's website
          </a>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={!inputKey.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default APIKeyDialog; 