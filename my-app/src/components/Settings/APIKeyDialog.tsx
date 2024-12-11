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

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

const APIKeyDialog = ({ open, onClose, onSave }: Props) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      onSave(apiKey.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>OpenAI API Key Settings</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          To use AI features, you need to provide your OpenAI API key. 
          The key will be stored locally in your browser.
        </Alert>
        <TextField
          fullWidth
          label="OpenAI API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
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
          disabled={!apiKey.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default APIKeyDialog; 