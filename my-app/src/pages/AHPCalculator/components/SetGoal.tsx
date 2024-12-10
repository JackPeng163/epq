import { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  Stack,
  Chip,
} from '@mui/material';
import { Search, LightbulbOutlined, TipsAndUpdates } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Goal } from '../../../types/ahp';
import sampleGoals from '../../../data/sampleGoals.json';

interface SetGoalProps {
  initialGoal?: Goal;
  onGoalSet: (goal: Goal) => void;
}

const exampleGoals = [
  "Choosing the Best Laptop",
  "Selecting a Career Path",
  "Buying a New House",
  "Picking a Vacation Destination"
];

const SetGoal = ({ initialGoal, onGoalSet }: SetGoalProps) => {
  const [goal, setGoal] = useState<Goal>(initialGoal || {
    title: '',
    description: ''
  });
  const [touched, setTouched] = useState(false);

  const isValid = goal.title.trim() !== '';
  const showError = touched && !isValid;

  const handleGoalSelect = (_: any, newValue: string | null) => {
    setTouched(true);
    if (newValue) {
      const selectedGoal = sampleGoals.goals.find(g => g.title === newValue);
      if (selectedGoal) {
        const newGoal = { ...selectedGoal };
        setGoal(newGoal);
        onGoalSet(newGoal);
      }
    }
  };

  const handleInputChange = (_: any, newValue: string) => {
    setTouched(true);
    setGoal(prev => ({ ...prev, title: newValue }));
    onGoalSet({ ...goal, title: newValue });
  };

  const goalTitles = useMemo(() => sampleGoals.goals.map(g => g.title), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Stack spacing={6}>
          {/* 标题部分 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              What's Your Decision Goal?
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                maxWidth: 600, 
                mx: 'auto',
                color: 'text.secondary',
                lineHeight: 1.6
              }}
            >
              Start by defining the main objective of your decision-making process. A clear goal
              helps guide the entire analysis and leads to better outcomes.
            </Typography>
          </Box>

          {/* 提示部分 */}
          <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'primary.main',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <LightbulbOutlined /> Tips for a Good Decision Goal:
            </Typography>
            <Stack spacing={1}>
              <Typography>• Be specific and measurable</Typography>
              <Typography>• Focus on a single main objective</Typography>
              <Typography>• Consider both short-term and long-term impacts</Typography>
              <Typography>• Make sure it captures all important aspects of your decision</Typography>
            </Stack>
          </Box>

          {/* 输入部分 */}
          <Box>
            <Typography 
              variant="body1" 
              sx={{ mb: 1, fontWeight: 500 }}
            >
              Decision Goal
            </Typography>
            <Autocomplete
              freeSolo
              options={goalTitles}
              value={goal.title}
              onChange={handleGoalSelect}
              onInputChange={handleInputChange}
              onBlur={() => setTouched(true)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter your decision goal here..."
                  error={showError}
                  helperText={showError ? "Please enter a decision goal" : ""}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <Search color="action" sx={{ ml: 1, mr: 0.5 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                    }
                  }}
                />
              )}
            />
          </Box>

          {/* 示例目标 */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <TipsAndUpdates color="primary" />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Example Goals:
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {exampleGoals.map((example, index) => (
                <Chip
                  key={index}
                  label={example}
                  onClick={() => {
                    setGoal(prev => ({ ...prev, title: example }));
                    onGoalSet({ ...goal, title: example });
                  }}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </motion.div>
  );
};

export default SetGoal; 