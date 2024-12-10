import { ComparisonMatrix } from '../types/ahp';

// 随机一致性指标
const RI = {
  1: 0,
  2: 0,
  3: 0.58,
  4: 0.90,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49
};

// 计算特征向量（权重）
export const calculateEigenVector = (matrix: ComparisonMatrix, items: string[]): number[] => {
  const n = items.length;
  if (n === 0) return [];
  
  // 计算每行的几何平均数
  const geometricMeans = items.map(item1 => {
    const product = items.reduce((acc, item2) => {
      const value = matrix[item1]?.[item2] || 1;
      return acc * value;
    }, 1);
    return Math.pow(product, 1/n);
  });

  // 归一化
  const sum = geometricMeans.reduce((acc, val) => acc + val, 0);
  return geometricMeans.map(value => value / sum);
};

// 计算一致性比率
export const calculateConsistencyRatio = (
  matrix: ComparisonMatrix,
  items: string[]
): { CR: number; isConsistent: boolean } => {
  const n = items.length;
  if (n <= 2) return { CR: 0, isConsistent: true };

  // 计算λmax
  const weights = calculateEigenVector(matrix, items);
  let lambdaMax = 0;

  items.forEach((item1, i) => {
    let sum = 0;
    items.forEach((item2, j) => {
      sum += (matrix[item1]?.[item2] || 1) * weights[j];
    });
    lambdaMax += sum / weights[i];
  });
  lambdaMax /= n;

  // 计算一致性指标 CI
  const CI = (lambdaMax - n) / (n - 1);
  
  // 计算一致性比率 CR
  const CR = CI / (RI[n as keyof typeof RI] || 1.49);

  return {
    CR,
    isConsistent: CR <= 0.1 // CR <= 0.1 被认为是可接受的一致性水平
  };
};

// 计算总体权重
export const calculateOverallWeights = (
  criteriaMatrix: ComparisonMatrix,
  alternativesMatrices: { [criterionId: string]: ComparisonMatrix },
  criteriaIds: string[],
  alternativeIds: string[]
): { [alternativeId: string]: number } => {
  // 计算准则权重
  const criteriaWeights = calculateEigenVector(criteriaMatrix, criteriaIds);
  
  // 计算每个准则下的备选方案权重
  const alternativeWeightsByCriteria = criteriaIds.map(criterionId => 
    calculateEigenVector(alternativesMatrices[criterionId] || {}, alternativeIds)
  );

  // 计算总体权重
  const overallWeights: { [alternativeId: string]: number } = {};
  alternativeIds.forEach((alternativeId, altIndex) => {
    overallWeights[alternativeId] = criteriaWeights.reduce((sum, criteriaWeight, critIndex) => 
      sum + criteriaWeight * alternativeWeightsByCriteria[critIndex][altIndex], 0
    );
  });

  return overallWeights;
}; 