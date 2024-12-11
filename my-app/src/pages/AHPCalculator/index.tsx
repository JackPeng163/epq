import { useState } from 'react';
import { Box, Container, Stepper, Step, StepLabel, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import SetGoal from './components/SetGoal';
import SetCriteriaAndAlternatives from './components/SetCriteriaAndAlternatives';
import CriteriaPairwiseComparison from './components/CriteriaPairwiseComparison';
import AlternativesPairwiseComparison from './components/AlternativesPairwiseComparison';
import ReviewResults from './components/ReviewResults';
import { AHPState, Goal, Criterion, Alternative } from '../../types/ahp';
import { calculateConsistencyRatio } from '../../utils/ahp';
import GetHelpFromAIDialog from '../../components/GetHelpFromAI/Dialog';

const steps = [
  'Set Goal',
  'Set Criteria & Alternatives',
  'Criteria Comparison',
  'Alternatives Comparison',
  'Review Results'
];

const AHPCalculator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showQuickGuide, setShowQuickGuide] = useState(() => {
    const saved = localStorage.getItem('hideQuickGuide');
    return saved ? false : true;
  });
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showGetHelpDialog, setShowGetHelpDialog] = useState(false);
  
  const [ahpState, setAhpState] = useState<AHPState>({
    goal: { title: '', description: '' },
    criteria: [],
    alternatives: [],
    criteriaComparisons: {},
    alternativeComparisons: {}
  });

  const handleHideQuickGuide = () => {
    setShowQuickGuide(false);
    localStorage.setItem('hideQuickGuide', 'true');
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return ahpState.goal.title.trim() !== '';
      case 1:
        return ahpState.criteria.length >= 2 && ahpState.alternatives.length >= 2;
      case 2: {
        if (Object.keys(ahpState.criteriaComparisons).length === 0) return true;
        const { CR } = calculateConsistencyRatio(
          ahpState.criteriaComparisons,
          ahpState.criteria.map(c => c.id)
        );
        return CR <= 0.1;
      }
      case 3: {
        const allComparisons = ahpState.criteria.every(criterion => {
          const matrix = ahpState.alternativeComparisons[criterion.id] || {};
          if (Object.keys(matrix).length === 0) return true;
          const { CR } = calculateConsistencyRatio(
            matrix,
            ahpState.alternatives.map(a => a.id)
          );
          return CR <= 0.1;
        });
        return allComparisons;
      }
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleGoalSet = (goal: Goal) => {
    setAhpState((prev) => ({ ...prev, goal }));
  };

  const handleCriteriaChange = (criteria: Criterion[]) => {
    setAhpState((prev) => ({ ...prev, criteria }));
  };

  const handleAlternativesChange = (alternatives: Alternative[]) => {
    setAhpState((prev) => ({ ...prev, alternatives }));
  };

  const handleComplete = () => {
    setShowCompleteDialog(true);
  };

  const handleConfirmComplete = () => {
    setShowCompleteDialog(false);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <SetGoal
            initialGoal={ahpState.goal}
            onGoalSet={handleGoalSet}
          />
        );
      case 1:
        return (
          <SetCriteriaAndAlternatives
            initialCriteria={ahpState.criteria}
            initialAlternatives={ahpState.alternatives}
            onCriteriaChange={handleCriteriaChange}
            onAlternativesChange={handleAlternativesChange}
            showQuickGuide={showQuickGuide}
            onHideQuickGuide={handleHideQuickGuide}
            goal={ahpState.goal}
          />
        );
      case 2:
        return (
          <CriteriaPairwiseComparison
            criteria={ahpState.criteria}
            initialComparisons={ahpState.criteriaComparisons}
            onChange={(comparisons) => 
              setAhpState(prev => ({ ...prev, criteriaComparisons: comparisons }))
            }
          />
        );
      case 3:
        return (
          <AlternativesPairwiseComparison
            alternatives={ahpState.alternatives}
            criteria={ahpState.criteria}
            initialComparisons={ahpState.alternativeComparisons}
            onChange={(comparisons) => 
              setAhpState(prev => ({ ...prev, alternativeComparisons: comparisons }))
            }
          />
        );
      case 4:
        return (
          <ReviewResults
            goal={ahpState.goal}
            criteria={ahpState.criteria}
            alternatives={ahpState.alternatives}
            criteriaComparisons={ahpState.criteriaComparisons}
            alternativeComparisons={ahpState.alternativeComparisons}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 4 }}>
          {renderStepContent()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Box>
            {!isStepValid() && (
              <Typography 
                color="error" 
                variant="caption" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5 
                }}
              >
                {activeStep === 1 && "Please add at least 2 criteria and 2 alternatives"}
                {activeStep === 2 && "Please complete all criteria comparisons and ensure CR < 10%"}
                {activeStep === 3 && "Please complete all alternative comparisons and ensure CR < 10%"}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack}>
                Back
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <>
                <Button variant="outlined" onClick={() => window.print()}>
                  Export PDF
                </Button>
                <Button 
                  variant="contained"
                  onClick={handleComplete}
                >
                  Complete
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={showCompleteDialog}
        onClose={() => setShowCompleteDialog(false)}
      >
        <DialogTitle>Save Your Results</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your decision analysis data will not be saved after completion. 
            We recommend exporting a PDF report before proceeding.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowCompleteDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmComplete}
            color="primary"
          >
            Complete Anyway
          </Button>
        </DialogActions>
      </Dialog>

      <GetHelpFromAIDialog
        open={showGetHelpDialog}
        onClose={() => setShowGetHelpDialog(false)}
        ahpState={ahpState}
      />
    </Container>
  );
};

export default AHPCalculator; 