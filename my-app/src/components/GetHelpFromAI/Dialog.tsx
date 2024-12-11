import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    IconButton,
    Box,
    Paper,
    Typography,
    DialogActions,
    CircularProgress,
    Button,
} from '@mui/material';
import { Send, Close, Assessment } from '@mui/icons-material';
import { callOpenAI } from '../../services/api';
import { SYSTEM_PROMPT, DECISION_DATA_PROMPT } from '../../services/prompt';
import { useChatContext } from '../../contexts/ChatContext';
import { AHPState } from '../../types/ahp';

interface Props {
    open: boolean;
    onClose: () => void;
    ahpState?: AHPState;
}

const GetHelpDialog = ({ open, onClose, ahpState }: Props) => {
    const { messages, addMessage } = useChatContext();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendDecisionData = async () => {
        if (!ahpState) return;

        setLoading(true);
        const decisionMessage = DECISION_DATA_PROMPT
            .replace('{goal}', ahpState.goal.title)
            .replace('{criteria}', ahpState.criteria.map(c => c.name).join(', '))
            .replace('{alternatives}', ahpState.alternatives.map(a => a.name).join(', '));

        const userMessage = { role: 'user' as const, content: decisionMessage };
        addMessage(userMessage);

        try {
            const allMessages = [
                { role: 'system' as const, content: SYSTEM_PROMPT },
                ...messages,
                userMessage
            ];

            const response = await callOpenAI(allMessages);
            const assistantMessage = {
                role: 'assistant' as const,
                content: response,
            };
            addMessage(assistantMessage);
        } catch (error) {
            console.error('Message sending failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user' as const, content: input };
        addMessage(userMessage);
        setInput('');
        setLoading(true);

        try {
            const allMessages = [
                { role: 'system' as const, content: SYSTEM_PROMPT },
                ...messages,
                userMessage
            ];

            const response = await callOpenAI(allMessages);
            const assistantMessage = {
                role: 'assistant' as const,
                content: response,
            };
            addMessage(assistantMessage);
        } catch (error) {
            console.error('Message sending failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Chat with AI Assistant
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
                {ahpState && (
                    <Box sx={{ mb: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<Assessment />}
                            onClick={handleSendDecisionData}
                            disabled={loading}
                            fullWidth
                        >
                            Send Decision Data
                        </Button>
                    </Box>
                )}

                <Box sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mb: 2
                }}>
                    {messages.map((message, index) => (
                        <Paper
                            key={index}
                            sx={{
                                p: 2,
                                maxWidth: '80%',
                                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                                bgcolor: message.role === 'user' ? 'primary.light' : 'background.paper',
                            }}
                        >
                            <Typography>{message.content}</Typography>
                        </Paper>
                    ))}
                </Box>

                <DialogActions sx={{ p: 0 }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={loading}
                        sx={{ mr: 1 }}
                    />
                    <IconButton
                        onClick={handleSend}
                        color="primary"
                        disabled={loading || !input.trim()}
                    >
                        {loading ? <CircularProgress size={24} /> : <Send />}
                    </IconButton>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};


export default GetHelpDialog;
