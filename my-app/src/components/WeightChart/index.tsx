import { Box, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface WeightChartProps {
  weights: { id: string; name: string; weight: number }[];
  title: string;
}

const WeightChart = ({ weights, title }: WeightChartProps) => {
  const data = weights.map(item => ({
    name: item.name,
    weight: Number((item.weight * 100).toFixed(1))
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical">
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Weight']}
              />
              <Bar 
                dataKey="weight" 
                fill="currentColor" 
                className="text-primary-500"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default WeightChart; 