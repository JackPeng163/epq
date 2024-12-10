import { Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { getScaleDescription } from './constants';

interface ComparisonDescriptionProps {
  value: number;
}

const ComparisonDescription = ({ value }: ComparisonDescriptionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2,
          bgcolor: 'primary.light',
          color: 'primary.main',
          borderRadius: 2
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Current Selection: {value === 1 ? '1' : value < 1 ? `1/${1/value}` : value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {getScaleDescription(value)}
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default ComparisonDescription; 