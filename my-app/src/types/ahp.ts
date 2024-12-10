export interface Criterion {
  id: string;
  name: string;
  description?: string;
}

export interface Alternative {
  id: string;
  name: string;
  description?: string;
}

export interface Goal {
  title: string;
  description: string;
}

export interface ComparisonMatrix {
  [key: string]: {
    [key: string]: number;
  };
}

export interface AHPState {
  goal: Goal;
  criteria: Criterion[];
  alternatives: Alternative[];
  criteriaComparisons: ComparisonMatrix;
  alternativeComparisons: {
    [criterionId: string]: ComparisonMatrix;
  };
} 