import { useState } from 'react';
import { Box, Paper, Typography, Tabs, Tab, ToggleButton, ToggleButtonGroup, Grid, Stack } from '@mui/material';
import { ViewList, ViewModule } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import TableView from '../../../components/ComparisonMatrix/TableView';
import ListView from '../../../components/ComparisonMatrix/ListView';
import ConsistencyRateCard from '../../../components/ComparisonMatrix/ConsistencyRateCard';
import WeightChart from '../../../components/WeightChart';
import { Alternative, Criterion, ComparisonMatrix } from '../../../types/ahp';
import { calculateConsistencyRatio, calculateEigenVector } from '../../../utils/ahp';
import GetHelpFromAIButton from '../../../components/GetHelpFromAI/GetHelpButton';
import ComparisonDescription from '../../../components/ComparisonMatrix/ComparisonDescription';

interface AlternativesPairwiseComparisonProps {
  alternatives: Alternative[];
  criteria: Criterion[];
  initialComparisons: {
    [criterionId: string]: ComparisonMatrix;
  };
  onChange: (comparisons: { [criterionId: string]: ComparisonMatrix }) => void;
}

const AlternativesPairwiseComparison = ({
  alternatives,
  criteria,
  initialComparisons,
  onChange
}: AlternativesPairwiseComparisonProps) => {
  const [currentCriterion, setCurrentCriterion] = useState<number>(0);
  const [viewType, setViewType] = useState<'table' | 'list'>('table');
  const [selectedValue, setSelectedValue] = useState<number>(1);

  const handleViewChange = (
    _: React.MouseEvent<HTMLElement>,
    newView: 'table' | 'list' | null
  ) => {
    if (newView !== null) {
      setViewType(newView);
    }
  };

  const handleComparisonChange = (criterionId: string) => (comparisons: ComparisonMatrix) => {
    onChange({
      ...initialComparisons,
      [criterionId]: comparisons
    });
  };

  const currentCriterionId = criteria[currentCriterion]?.id;
  const currentMatrix = currentCriterionId ? initialComparisons[currentCriterionId] || {} : {};
  
  // 计算当前标准下的一致性比率和权重
  const { CR, isConsistent } = calculateConsistencyRatio(
    currentMatrix,
    alternatives.map(a => a.id)
  );
  
  const weights = calculateEigenVector(currentMatrix, alternatives.map(a => a.id));
  const weightData = alternatives.map((alternative, index) => ({
    id: alternative.id,
    name: alternative.name,
    weight: weights[index]
  }));

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Compare Alternatives for Each Criterion
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            maxWidth: 800,
            mx: 'auto',
            color: 'text.secondary',
            lineHeight: 1.6,
            mb: 2
          }}
        >
          For each criterion, compare how well each alternative performs relative to the others.
          This helps determine the best option based on your specific needs.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <GetHelpFromAIButton />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ overflow: 'hidden' }}>
            <Box sx={{ 
              bgcolor: 'primary.light',
              borderRadius: '8px 8px 0 0'
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                px: 2
              }}>
                <Tabs
                  value={currentCriterion}
                  onChange={(_, newValue) => setCurrentCriterion(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTab-root': {
                      color: 'primary.main',
                      '&.Mui-selected': {
                        color: 'primary.dark',
                      }
                    }
                  }}
                >
                  {criteria.map((criterion, index) => (
                    <Tab
                      key={criterion.id}
                      label={criterion.name}
                      value={index}
                    />
                  ))}
                </Tabs>
                <ToggleButtonGroup
                  value={viewType}
                  exclusive
                  onChange={handleViewChange}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <ToggleButton value="table">
                    <ViewModule />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ViewList />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            <AnimatePresence mode="wait">
              {criteria.map((criterion, index) => (
                currentCriterion === index && (
                  <motion.div
                    key={criterion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {viewType === 'table' ? (
                      <TableView
                        items={alternatives}
                        comparisons={currentMatrix}
                        onChange={handleComparisonChange(criterion.id)}
                        onValueSelect={setSelectedValue}
                      />
                    ) : (
                      <ListView
                        items={alternatives}
                        comparisons={currentMatrix}
                        onChange={handleComparisonChange(criterion.id)}
                        onValueSelect={setSelectedValue}
                      />
                    )}
                    <Box sx={{ p: 2 }}>
                      <ComparisonDescription value={selectedValue} />
                    </Box>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <ConsistencyRateCard CR={CR} isConsistent={isConsistent} />
            <WeightChart 
              weights={weightData} 
              title={`Alternative Weights for ${criteria[currentCriterion]?.name || ''}`} 
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AlternativesPairwiseComparison;
