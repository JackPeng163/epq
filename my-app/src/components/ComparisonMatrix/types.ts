import { ComparisonMatrix } from '../../types/ahp';

export interface ComparisonViewProps {
  items: Array<{ id: string; name: string }>;
  comparisons: ComparisonMatrix;
  onChange: (comparisons: ComparisonMatrix) => void;
  onValueSelect?: (value: number) => void;
  title?: string;
  description?: string;
} 