import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ConsistencyRateCardProps {
  CR: number;
  isConsistent: boolean;
}

const ConsistencyRateCard = ({ CR, isConsistent }: ConsistencyRateCardProps) => {
  const crPercentage = Math.min(Math.max(CR * 100, 0), 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2,
          bgcolor: isConsistent ? 'success.light' : 'error.light',
          color: 'white',
          minHeight: 100  // 添加最小高度防止震荡
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ position: 'relative', width: 40, height: 40 }}>  {/* 固定容器大小 */}
            {isConsistent ? (
              <CircularProgress
                variant="determinate"
                value={100}
                sx={{ 
                  color: 'success.main',
                  bgcolor: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%'
                }}
              />
            ) : (
              <WarningIcon 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  color: 'error.main'
                }} 
              />
            )}
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Consistency Ratio
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              CR = {crPercentage.toFixed(1)}%
            </Typography>
            <Typography variant="body2">
              {isConsistent ? (
                'Good consistency (CR < 10%)'
              ) : (
                'Please review your comparisons to achieve CR < 10%'
              )}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default ConsistencyRateCard;
