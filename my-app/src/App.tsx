import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes/index';
import { ChatProvider } from './contexts/ChatContext';

function App() {
  return (
    <ChatProvider>
      <ThemeProvider>
        <CssBaseline />
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </ChatProvider>
  );
}

export default App;
