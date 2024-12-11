import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Assessment, Speed, Psychology, AutoGraph, Settings } from '@mui/icons-material';
import { useState } from 'react';
import APIKeyDialog from '../../components/Settings/APIKeyDialog';

const features = [
  {
    icon: <Assessment />,
    title: 'Scientific Decision Making',
    description: 'Make decisions based on the proven Analytic Hierarchy Process methodology'
  },
  {
    icon: <Speed />,
    title: 'Efficient Analysis',
    description: 'Quick and accurate calculations for your complex decision problems'
  },
  {
    icon: <Psychology />,
    title: 'AI-Powered Insights',
    description: 'Get intelligent suggestions and analysis from our AI assistant'
  },
  {
    icon: <AutoGraph />,
    title: 'Visual Results',
    description: 'Clear visualization of your decision analysis with interactive charts'
  }
];

const MainPage = () => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 4,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700
            }}
          >
            Decision Copilot
          </Typography>
          
          <Typography
            variant="h5"
            component="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Your intelligent companion for making complex decisions simple with 
            Analytic Hierarchy Process
          </Typography>

          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/calculator')}
              sx={{ 
                px: 4, 
                py: 2,
                fontSize: '1.2rem',
                borderRadius: 2
              }}
            >
              Start Making Decision
            </Button>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        transform: 'translateY(-4px)',
                        transition: 'all 0.3s ease-in-out'
                      }
                    }}
                  >
                    <Box sx={{ 
                      p: 2, 
                      color: 'primary.main',
                      '& .MuiSvgIcon-root': {
                        fontSize: '2.5rem'
                      }
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>

      <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
        <Button
          variant="contained"
          startIcon={<Settings />}
          onClick={() => setShowSettings(true)}
        >
          API Settings
        </Button>
      </Box>

      <APIKeyDialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={() => {
          // 可以添加一些成功提示
        }}
      />
    </Container>
  );
};

export default MainPage; 