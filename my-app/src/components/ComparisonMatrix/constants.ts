export const scaleValues = [1/9, 1/8, 1/7, 1/6, 1/5, 1/4, 1/3, 1/2, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export const scaleDescriptions: Record<number, string> = {
  1: 'Equal importance',
  2: 'Weak importance',
  3: 'Moderate importance',
  4: 'Moderate importance',
  5: 'Strong importance',
  6: 'Strong importance',
  7: 'Very strong importance',
  8: 'Very strong importance',
  9: 'Extreme importance'
};

export const getScaleDescription = (value: number) => {
  if (value < 1) {
    const inverseValue = 1 / value;
    return `${scaleDescriptions[inverseValue as keyof typeof scaleDescriptions]} (reverse)`;
  }
  return scaleDescriptions[value as keyof typeof scaleDescriptions] || '';
}; 