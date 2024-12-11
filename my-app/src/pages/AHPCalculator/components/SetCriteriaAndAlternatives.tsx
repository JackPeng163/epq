import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Paper,
  Stack,
  Tooltip,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  TipsAndUpdates,
  Category,
  ViewList,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Criterion, Alternative } from '../../../types/ahp';
import GetHelpFromAIButton from '../../../components/GetHelpFromAI/GetHelpButton';
import { getAISuggestions, getAlternativeSuggestions } from '../../../services/getSuggest';

interface SetCriteriaAndAlternativesProps {
  initialCriteria?: Criterion[];
  initialAlternatives?: Alternative[];
  onCriteriaChange: (criteria: Criterion[]) => void;
  onAlternativesChange: (alternatives: Alternative[]) => void;
  showQuickGuide: boolean;
  onHideQuickGuide: () => void;
  goal?: { title: string };
}

// 添加提示信息
const criteriaGuidelines = [
  "Choose measurable criteria (e.g., cost, time, quality)",
  "Keep criteria independent of each other",
  "Aim for 3-7 criteria for best results",
  "Use both quantitative and qualitative factors"
];

const alternativesGuidelines = [
  "List all viable options you're considering",
  "Make sure alternatives are comparable",
  "Include 2-5 alternatives for optimal comparison",
  "Be specific in naming to avoid confusion"
];

// 添加常量
const MAX_CRITERIA = 7;
const MAX_ALTERNATIVES = 5;

const SetCriteriaAndAlternatives = ({
  initialCriteria = [],
  initialAlternatives = [],
  onCriteriaChange,
  onAlternativesChange,
  showQuickGuide,
  onHideQuickGuide,
  goal
}: SetCriteriaAndAlternativesProps) => {
  const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria);
  const [alternatives, setAlternatives] = useState<Alternative[]>(initialAlternatives);
  const [newCriterion, setNewCriterion] = useState('');
  const [newAlternative, setNewAlternative] = useState('');
  const [criterionError, setCriterionError] = useState('');
  const [alternativeError, setAlternativeError] = useState('');
  
  // 添加这些状态
  const [suggestedCriteria, setSuggestedCriteria] = useState<string[]>([
    "Cost",
    "Quality",
    "Performance",
    "Durability",
  ]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestedAlternatives, setSuggestedAlternatives] = useState<string[]>([
    "Option A",
    "Option B",
    "Option C",
    "Product 1",
    "Product 2"
  ]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  // 添加 useEffect 来获取 AI 建议
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!goal?.title) return;
      
      setLoadingSuggestions(true);
      try {
        const response = await getAISuggestions(goal.title);
        const criteria = response.split(',').map(c => c.trim());
        setSuggestedCriteria(criteria);
      } catch (error) {
        console.error('Failed to get AI suggestions:', error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [goal?.title]);

  // 添加新的 useEffect 用于获取 alternatives 建议
  useEffect(() => {
    const fetchAlternatives = async () => {
      if (!goal?.title) return;
      
      setLoadingAlternatives(true);
      try {
        const response = await getAlternativeSuggestions(goal.title);
        const alternatives = response.split(',').map(a => a.trim());
        setSuggestedAlternatives(alternatives);
      } catch (error) {
        console.error('Failed to get AI suggestions for alternatives:', error);
      } finally {
        setLoadingAlternatives(false);
      }
    };

    fetchAlternatives();
  }, [goal?.title]);

  const handleAddCriterion = (name: string = newCriterion) => {
    if (criteria.length >= MAX_CRITERIA) {
      setCriterionError(`Maximum ${MAX_CRITERIA} criteria allowed`);
      setTimeout(() => setCriterionError(''), 3000);
      return;
    }

    const trimmedName = name.trim();
    if (trimmedName) {
      const isDuplicate = criteria.some(
        c => c.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (isDuplicate) {
        setCriterionError('This criterion already exists');
        setTimeout(() => setCriterionError(''), 3000);
        return;
      }

      const newCriteria = [
        ...criteria,
        { id: `c${Date.now()}`, name: trimmedName }
      ];
      setCriteria(newCriteria);
      onCriteriaChange(newCriteria);
      setNewCriterion('');
      setCriterionError('');
    }
  };

  const handleAddAlternative = (name: string = newAlternative) => {
    if (alternatives.length >= MAX_ALTERNATIVES) {
      setAlternativeError(`Maximum ${MAX_ALTERNATIVES} alternatives allowed`);
      setTimeout(() => setAlternativeError(''), 3000);
      return;
    }

    const trimmedName = name.trim();
    if (trimmedName) {
      const isDuplicate = alternatives.some(
        a => a.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (isDuplicate) {
        setAlternativeError('This alternative already exists');
        setTimeout(() => setAlternativeError(''), 3000);
        return;
      }

      const newAlternatives = [
        ...alternatives,
        { id: `a${Date.now()}`, name: trimmedName }
      ];
      setAlternatives(newAlternatives);
      onAlternativesChange(newAlternatives);
      setNewAlternative('');
      setAlternativeError('');
    }
  };

  const handleDeleteCriterion = (id: string) => {
    const newCriteria = criteria.filter(c => c.id !== id);
    setCriteria(newCriteria);
    onCriteriaChange(newCriteria);
  };

  const handleDeleteAlternative = (id: string) => {
    const newAlternatives = alternatives.filter(a => a.id !== id);
    setAlternatives(newAlternatives);
    onAlternativesChange(newAlternatives);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Stack spacing={4}>
          {/* 标题部分 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Define Your Criteria & Alternatives
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
              Add the criteria you'll use to evaluate your alternatives, and list the alternatives
              you're considering. Good criteria and alternatives are key to making the right decision.
            </Typography>

            {/* 快速指南 - 添加条件渲染和关闭按钮 */}
            {showQuickGuide && (
              <Fade in>
                <Box 
                  sx={{ 
                    position: 'relative',
                    maxWidth: 600, 
                    mx: 'auto', 
                    mb: 3,
                    p: 2,
                    bgcolor: 'primary.light',
                    borderRadius: 2,
                    color: 'primary.main'
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={onHideQuickGuide}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      color: 'primary.main'
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Quick Guide:
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">1. Start by listing your evaluation criteria</Typography>
                    <Typography variant="body2">2. Add all alternatives you want to compare</Typography>
                    <Typography variant="body2">3. Use suggested items or create your own</Typography>
                  </Stack>
                </Box>
              </Fade>
            )}
            <Box sx={{ mt: 2 }}>
              <GetHelpFromAIButton ahpState={goal ? { goal: { title: goal.title, description: '' }, criteria, alternatives, criteriaComparisons: {}, alternativeComparisons: {} } : undefined} />
            </Box>
          </Box>

          <Grid 
            container 
            spacing={4} 
            sx={{ 
              '& > .MuiGrid-item': {
                display: 'flex'  // 使Grid项目采用flex布局
              }
            }}
          >
            {/* Criteria Section */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3,
                  width: '100%',  // 确保Paper占满Grid项目的宽度
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Stack spacing={3} sx={{ height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Category color="primary" />
                    <Typography variant="h6">Criteria</Typography>
                    <Tooltip title="Each criterion should be independent and measurable">
                      <InfoIcon fontSize="small" color="action" />
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={newCriterion}
                      onChange={(e) => setNewCriterion(e.target.value)}
                      placeholder={criteria.length >= MAX_CRITERIA 
                        ? `Maximum ${MAX_CRITERIA} criteria reached` 
                        : "Add new criterion"
                      }
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCriterion()}
                      error={!!criterionError}
                      helperText={criterionError}
                      disabled={criteria.length >= MAX_CRITERIA}
                      sx={{
                        '& .MuiFormHelperText-root': {
                          position: 'absolute',
                          bottom: -20,
                        }
                      }}
                    />
                    <IconButton 
                      onClick={() => handleAddCriterion()}
                      color="primary"
                      disabled={criteria.length >= MAX_CRITERIA}
                      sx={{ 
                        bgcolor: 'primary.light', 
                        '&:hover': { bgcolor: 'primary.main' },
                        '&.Mui-disabled': {
                          bgcolor: 'action.disabledBackground',
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <TipsAndUpdates color="primary" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {loadingSuggestions ? 'Getting AI suggestions...' : 'Suggested Criteria:'}
                      </Typography>
                    </Stack>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {loadingSuggestions ? (
                        <CircularProgress size={20} />
                      ) : (
                        suggestedCriteria.map((criterion) => (
                          <Chip
                            key={criterion}
                            label={criterion}
                            onClick={() => handleAddCriterion(criterion)}
                            sx={{
                              bgcolor: 'background.default',
                              '&:hover': { bgcolor: 'primary.light' }
                            }}
                          />
                        ))
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Guidelines for Good Criteria:
                    </Typography>
                    <Stack spacing={0.5}>
                      {criteriaGuidelines.map((guideline, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1 
                          }}
                        >
                          <Box
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              bgcolor: 'primary.main'
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {guideline}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <List>
                    <AnimatePresence mode="popLayout">
                      {criteria.map((criterion) => (
                        <motion.div
                          key={criterion.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ListItem
                            sx={{
                              bgcolor: 'background.paper',
                              borderRadius: 1,
                              mb: 1
                            }}
                          >
                            <ListItemText primary={criterion.name} />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={() => handleDeleteCriterion(criterion.id)}
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </List>
                </Stack>
              </Paper>
            </Grid>

            {/* Alternatives Section */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3,
                  width: '100%',  // 确保Paper占满Grid项目的宽度
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Stack spacing={3} sx={{ height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ViewList color="primary" />
                    <Typography variant="h6">Alternatives</Typography>
                    <Tooltip title="Add all viable options you're considering">
                      <InfoIcon fontSize="small" color="action" />
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={newAlternative}
                      onChange={(e) => setNewAlternative(e.target.value)}
                      placeholder={alternatives.length >= MAX_ALTERNATIVES 
                        ? `Maximum ${MAX_ALTERNATIVES} alternatives reached` 
                        : "Add new alternative"
                      }
                      onKeyPress={(e) => e.key === 'Enter' && handleAddAlternative()}
                      error={!!alternativeError}
                      helperText={alternativeError}
                      disabled={alternatives.length >= MAX_ALTERNATIVES}
                      sx={{
                        '& .MuiFormHelperText-root': {
                          position: 'absolute',
                          bottom: -20,
                        }
                      }}
                    />
                    <IconButton 
                      onClick={() => handleAddAlternative()}
                      color="primary"
                      disabled={alternatives.length >= MAX_ALTERNATIVES}
                      sx={{ 
                        bgcolor: 'primary.light', 
                        '&:hover': { bgcolor: 'primary.main' },
                        '&.Mui-disabled': {
                          bgcolor: 'action.disabledBackground',
                        }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <TipsAndUpdates color="primary" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {loadingAlternatives ? 'Getting AI suggestions...' : 'Suggested Alternatives:'}
                      </Typography>
                    </Stack>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {loadingAlternatives ? (
                        <CircularProgress size={20} />
                      ) : (
                        suggestedAlternatives.map((alternative) => (
                          <Chip
                            key={alternative}
                            label={alternative}
                            onClick={() => handleAddAlternative(alternative)}
                            sx={{
                              bgcolor: 'background.default',
                              '&:hover': { bgcolor: 'primary.light' }
                            }}
                          />
                        ))
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Tips for Adding Alternatives:
                    </Typography>
                    <Stack spacing={0.5}>
                      {alternativesGuidelines.map((guideline, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1 
                          }}
                        >
                          <Box
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              bgcolor: 'primary.main'
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {guideline}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <List>
                    <AnimatePresence mode="popLayout">
                      {alternatives.map((alternative) => (
                        <motion.div
                          key={alternative.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ListItem
                            sx={{
                              bgcolor: 'background.paper',
                              borderRadius: 1,
                              mb: 1
                            }}
                          >
                            <ListItemText primary={alternative.name} />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={() => handleDeleteAlternative(alternative.id)}
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </List>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </motion.div>
  );
};

export default SetCriteriaAndAlternatives; 