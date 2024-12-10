import { Box, Grid, Paper, Typography, Button, Stack, Tabs, Tab, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { EmojiEvents, BarChart, SmartToy, TipsAndUpdates } from '@mui/icons-material';
import { Alternative, Criterion, ComparisonMatrix } from '../../../types/ahp';
import {  calculateEigenVector, calculateOverallWeights } from '../../../utils/ahp';
import { useState } from 'react';

interface ReviewResultsProps {
    goal: { title: string; description: string };
    criteria: Criterion[];
    alternatives: Alternative[];
    criteriaComparisons: ComparisonMatrix;
    alternativeComparisons: {
        [criterionId: string]: ComparisonMatrix;
    };
}

const ReviewResults = ({
    goal,
    criteria,
    alternatives,
    criteriaComparisons,
    alternativeComparisons,
}: ReviewResultsProps) => {
    // 计算总体权重
    const overallWeights = calculateOverallWeights(
        criteriaComparisons,
        alternativeComparisons,
        criteria.map(c => c.id),
        alternatives.map(a => a.id)
    );

    // 计算标准权重
    const criteriaWeights = calculateEigenVector(
        criteriaComparisons,
        criteria.map(c => c.id)
    );

    // 格式化为百分比
    const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

    const [currentView, setCurrentView] = useState('criteria');
    const [showAIReport, setShowAIReport] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const handleViewChange = (_: React.SyntheticEvent, newValue: string) => {
        setCurrentView(newValue);
    };

    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowAIReport(true);
        setIsGeneratingReport(false);
    };

    const aiReportTemplate = {
        summary: "Based on the AHP analysis, this report provides insights into your decision-making process for choosing the best option.",
        keyFindings: [
            "The top-ranked alternative shows a clear advantage with a significant lead in the overall score",
            "The criteria weights indicate that [Criterion] was considered the most important factor",
            "The consistency ratios are within acceptable ranges, indicating reliable comparisons"
        ],
        recommendations: [
            "Consider implementing the top-ranked alternative as it aligns well with your prioritized criteria",
            "Pay special attention to the performance in [Criterion] as it carries the highest weight",
            "The second-ranked alternative could serve as a viable backup option"
        ],
    };

    const renderDistributionChart = () => {
        if (currentView === 'criteria') {
            // 显示标准权重分布
            return (
                <Box sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 2
                }}>
                    {criteria.map((criterion, index) => (
                        <Box
                            key={criterion.id}
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <Typography sx={{ minWidth: 120 }}>{criterion.name}</Typography>
                            <Box sx={{ flex: 1 }}>
                                <Box
                                    sx={{
                                        height: 8,
                                        bgcolor: 'primary.main',
                                        width: `${criteriaWeights[index] * 100}%`,
                                        borderRadius: 1,
                                        transition: 'width 0.3s ease-in-out'
                                    }}
                                />
                            </Box>
                            <Typography sx={{ minWidth: 60, textAlign: 'right' }}>
                                {formatPercent(criteriaWeights[index])}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            );
        } else {
            // 显示每个标准下的备选方案权重分布
            const criterion = criteria.find(c => c.id === currentView);
            if (!criterion) return null;

            const matrix = alternativeComparisons[criterion.id] || {};
            const weights = calculateEigenVector(matrix, alternatives.map(a => a.id));

            return (
                <Box sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 2
                }}>
                    {alternatives.map((alternative, index) => (
                        <Box
                            key={alternative.id}
                            sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <Typography sx={{ minWidth: 120 }}>{alternative.name}</Typography>
                            <Box sx={{ flex: 1 }}>
                                <Box
                                    sx={{
                                        height: 8,
                                        bgcolor: 'primary.main',
                                        width: `${weights[index] * 100}%`,
                                        borderRadius: 1,
                                        transition: 'width 0.3s ease-in-out'
                                    }}
                                />
                            </Box>
                            <Typography sx={{ minWidth: 60, textAlign: 'right' }}>
                                {formatPercent(weights[index])}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            );
        }
    };

    return (
        <motion.div>
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Analysis Results
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            maxWidth: 800,
                            mx: 'auto',
                            color: 'text.secondary',
                            lineHeight: 1.6,
                            mb: 3
                        }}
                    >
                        Review your decision analysis results and export them for future reference.
                    </Typography>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mx: 'auto',
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                            <TipsAndUpdates color="primary" />
                            <Typography variant="h6">Decision Goal</Typography>
                        </Stack>
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                color: 'primary.main',
                                fontWeight: 500
                            }}
                        >
                            {goal.title}
                        </Typography>
                        {goal.description && (
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    mt: 1,
                                    lineHeight: 1.6
                                }}
                            >
                                {goal.description}
                            </Typography>
                        )}
                    </Paper>
                </Box>

                {!showAIReport && (
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="outlined"
                            startIcon={isGeneratingReport ? <CircularProgress size={20} /> : <SmartToy />}
                            onClick={handleGenerateReport}
                            disabled={isGeneratingReport}
                        >
                            {isGeneratingReport ? 'Generating Report...' : 'Get AI Generated Report'}
                        </Button>
                    </Box>
                )}

                {showAIReport && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ marginBottom: 24 }}
                    >
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                                <SmartToy color="primary" />
                                <Typography variant="h6">AI Analysis Report</Typography>
                            </Stack>

                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="subtitle1" color="primary.main" gutterBottom>
                                        Summary
                                    </Typography>
                                    <Typography variant="body2">
                                        {aiReportTemplate.summary}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle1" color="primary.main" gutterBottom>
                                        Key Findings
                                    </Typography>
                                    <Stack spacing={1}>
                                        {aiReportTemplate.keyFindings.map((finding, index) => (
                                            <Typography key={index} variant="body2">
                                                • {finding}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle1" color="primary.main" gutterBottom>
                                        Recommendations
                                    </Typography>
                                    <Stack spacing={1}>
                                        {aiReportTemplate.recommendations.map((rec, index) => (
                                            <Typography key={index} variant="body2">
                                                • {rec}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Box>
                            </Stack>
                        </Paper>
                    </motion.div>
                )}

                <Grid container spacing={3}>
                    {/* 最终排名 */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                                <EmojiEvents color="primary" />
                                <Typography variant="h6">Final Rankings</Typography>
                            </Stack>
                            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                                <Box component="thead">
                                    <Box component="tr" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Box component="th" sx={{ py: 1.5, textAlign: 'left' }}>Rank</Box>
                                        <Box component="th" sx={{ py: 1.5, textAlign: 'left' }}>Alternative</Box>
                                        <Box component="th" sx={{ py: 1.5, textAlign: 'right' }}>Score</Box>
                                    </Box>
                                </Box>
                                <Box component="tbody">
                                    {Object.entries(overallWeights)
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([id, weight], index) => {
                                            const alternative = alternatives.find(a => a.id === id);
                                            return (
                                                <Box
                                                    component="tr"
                                                    key={id}
                                                    sx={{
                                                        bgcolor: index === 0 ? 'success.light' : 'transparent',
                                                        '&:hover': { bgcolor: 'action.hover' }
                                                    }}
                                                >
                                                    <Box component="td" sx={{ py: 2 }}>
                                                        {index === 0 && '🏆'} {index + 1}
                                                    </Box>
                                                    <Box component="td" sx={{ py: 2 }}>{alternative?.name}</Box>
                                                    <Box component="td" sx={{ py: 2, textAlign: 'right' }}>
                                                        {formatPercent(weight)}
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* 分数分布 */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <BarChart color="primary" />
                                <Typography variant="h6">Weights</Typography>
                            </Stack>
                            <Tabs
                                value={currentView}
                                onChange={handleViewChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
                            >
                                <Tab
                                    value="criteria"
                                    label="Criteria Weights"
                                />
                                {criteria.map(criterion => (
                                    <Tab
                                        key={criterion.id}
                                        value={criterion.id}
                                        label={criterion.name}
                                    />
                                ))}
                            </Tabs>
                            <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                                {renderDistributionChart()}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* 详细得分 */}
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Detailed Scores
                            </Typography>
                            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                                <Box component="thead">
                                    <Box component="tr" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Box component="th" sx={{ py: 2, textAlign: 'left' }}>Alternative</Box>
                                        {criteria.map(criterion => (
                                            <Box
                                                key={criterion.id}
                                                component="th"
                                                sx={{ py: 2, textAlign: 'center' }}
                                            >
                                                {criterion.name}
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    (Weight: {formatPercent(criteriaWeights[criteria.indexOf(criterion)])})
                                                </Typography>
                                            </Box>
                                        ))}
                                        <Box component="th" sx={{ py: 2, textAlign: 'right' }}>Total Score</Box>
                                    </Box>
                                </Box>
                                <Box component="tbody">
                                    {alternatives.map(alternative => (
                                        <Box
                                            component="tr"
                                            key={alternative.id}
                                            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                        >
                                            <Box component="td" sx={{ py: 2 }}>{alternative.name}</Box>
                                            {criteria.map(criterion => {
                                                const matrix = alternativeComparisons[criterion.id] || {};
                                                const weights = calculateEigenVector(matrix, alternatives.map(a => a.id));
                                                const weight = weights[alternatives.indexOf(alternative)];
                                                const contribution = weight * criteriaWeights[criteria.indexOf(criterion)];
                                                return (
                                                    <Box
                                                        key={criterion.id}
                                                        component="td"
                                                        sx={{ py: 2, textAlign: 'center' }}
                                                    >
                                                        {formatPercent(weight)}
                                                        <Typography variant="caption" display="block" color="text.secondary">
                                                            Contribution: {formatPercent(contribution)}
                                                        </Typography>
                                                    </Box>
                                                );
                                            })}
                                            <Box component="td" sx={{ py: 2, textAlign: 'right' }}>
                                                {formatPercent(overallWeights[alternative.id])}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </motion.div>
    );
};

export default ReviewResults; 