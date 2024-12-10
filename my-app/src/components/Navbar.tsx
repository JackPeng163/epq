import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img 
            src="/Logo.svg" 
            alt="Decision Copilot Logo" 
            style={{ 
              height: '32px',
              width: 'auto',
              filter: isDarkMode ? 'brightness(1.5)' : 'none'
            }} 
          />
          <Typography
            variant="h6"
            component="div"
          >
            Decision Copilot
          </Typography>
        </motion.div>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>          
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{ ml: 1 }}
          >
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
