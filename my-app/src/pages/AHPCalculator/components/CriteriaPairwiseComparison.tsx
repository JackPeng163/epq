import { useState } from 'react';
import { Box, Grid, Typography, Paper, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ViewList, ViewModule } from '@mui/icons-material';
import { motion } from 'framer-motion';
import TableView from '../../../components/ComparisonMatrix/TableView';
import ListView from '../../../components/ComparisonMatrix/ListView';
import WeightChart from '../../../components/WeightChart';
import ConsistencyRateCard from '../../../components/ComparisonMatrix/ConsistencyRateCard';
import ComparisonDescription from '../../../components/ComparisonMatrix/ComparisonDescription';
import { Criterion, ComparisonMatrix } from '../../../types/ahp';
import { calculateConsistencyRatio, calculateEigenVector } from '../../../utils/ahp';
import GetHelpFromAIButton from '../../../components/GetHelpFromAI/GetHelpButton';

interface CriteriaPairwiseComparisonProps {
    criteria: Criterion[];
    initialComparisons?: ComparisonMatrix;
    onChange: (comparisons: ComparisonMatrix) => void;
}

const CriteriaPairwiseComparison = ({
    criteria,
    initialComparisons = {},
    onChange
}: CriteriaPairwiseComparisonProps) => {
    const [viewType, setViewType] = useState<'table' | 'list'>('table');
    const [selectedValue, setSelectedValue] = useState<number>(1);

    const { CR, isConsistent } = calculateConsistencyRatio(
        initialComparisons,
        criteria.map(c => c.id)
    );

    const weights = calculateEigenVector(initialComparisons, criteria.map(c => c.id));
    const weightData = criteria.map((criterion, index) => ({
        id: criterion.id,
        name: criterion.name,
        weight: weights[index]
    }));

    const handleViewChange = (
        _: React.MouseEvent<HTMLElement>,
        newView: 'table' | 'list' | null
    ) => {
        if (newView !== null) {
            setViewType(newView);
        }
    };

    const handleComparisonChange = (value: number) => {
        setSelectedValue(value);
    };

    return (
        <motion.div>
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Stack spacing={4}>
                    {/* 标题部分 */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom>
                            Compare Criteria Importance
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                maxWidth: 800,
                                mx: 'auto',
                                color: 'text.secondary',
                                lineHeight: 1.6
                            }}
                        >
                            Compare the relative importance of each criterion pair. This helps determine how much weight
                            each criterion should have in the final decision.
                        </Typography>

                        <Box sx={{ mt: 2 }}>
                            <GetHelpFromAIButton ahpState={{ goal: { title: '', description: '' }, criteria, alternatives: [], criteriaComparisons: {}, alternativeComparisons: {} }} />
                        </Box>
                    </Box>

                    <Grid container spacing={3}>
                        {/* 左侧比较部分 */}
                        <Grid item xs={12} md={8}>
                            <Paper elevation={0} sx={{ overflow: 'hidden' }}>
                                <Box sx={{
                                    bgcolor: 'primary.light',
                                    p: 1,
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}>
                                    <ToggleButtonGroup
                                        value={viewType}
                                        exclusive
                                        onChange={handleViewChange}
                                        size="small"
                                    >
                                        <ToggleButton value="table">
                                            <ViewModule />
                                        </ToggleButton>
                                        <ToggleButton value="list">
                                            <ViewList />
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>

                                {viewType === 'table' ? (
                                    <TableView
                                        items={criteria}
                                        comparisons={initialComparisons}
                                        onChange={onChange}
                                        onValueSelect={handleComparisonChange}
                                    />
                                ) : (
                                    <ListView
                                        items={criteria}
                                        comparisons={initialComparisons}
                                        onChange={onChange}
                                        onValueSelect={handleComparisonChange}
                                    />
                                )}
                                <Box sx={{ p: 2 }}>
                                    <ComparisonDescription value={selectedValue} />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* 右侧权重和一致性部分 */}
                        <Grid item xs={12} md={4}>
                            <Stack spacing={3}>
                                <ConsistencyRateCard CR={CR} isConsistent={isConsistent} />
                                <WeightChart
                                    weights={weightData}
                                    title="Criteria Weights"
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Box>
        </motion.div>
    );
};

export default CriteriaPairwiseComparison; 