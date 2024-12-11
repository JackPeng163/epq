export const SYSTEM_PROMPT = `You are a professional AHP (Analytic Hierarchy Process) analysis assistant. You can:
1. Help users understand the principles and applications of AHP methodology
2. Answer questions about using AHP in decision-making processes
3. Provide suggestions on consistency of judgment matrices
4. Help users select appropriate criteria and alternatives

Please respond in a concise and professional manner. If a user's question is unclear, feel free to ask for clarification to better understand their needs.`;

export const CRITERIA_SUGGESTION_PROMPT = `Based on the decision goal: "{goal}", suggest 4-6 appropriate evaluation criteria.

Requirements for the response:
1. Only provide the criteria names
2. Each criterion should be on a new line
3. Start each line with a hyphen (-)
4. Keep each criterion name concise (1-3 words)
5. Do not include any additional text or explanations

Example format:
-Cost
-Quality
-Durability
-Performance`;

export const ALTERNATIVES_SUGGESTION_PROMPT = `Based on the decision goal: "{goal}", suggest 4-5 potential alternatives to consider.

Requirements for the response:
1. Only provide the alternative names
2. Each alternative should be on a new line
3. Start each line with a hyphen (-)
4. Keep names specific but concise
5. Do not include any additional text or explanations

Example format:
-Toyota Camry
-Honda Accord
-Tesla Model 3
-BMW 3 Series`;

export const DECISION_DATA_PROMPT = `Here's my current decision data:
Goal: {goal}

Criteria: {criteria}

Alternatives: {alternatives}

Criteria Comparisons: {criteriaComparisons}

Alternatives Comparisons: {alternativeComparisons}

Please analyze this decision structure and provide suggestions or insights.`;

export const ANALYSIS_REPORT_PROMPT = `Based on the following AHP decision analysis data, generate a comprehensive report:

Goal: {goal}

Criteria (with weights):
{criteriaWeights}

Alternatives Rankings:
{rankings}

Requirements for the response:
1. Structure the response in JSON format with the following fields:
   - summary: A brief overview of the analysis
   - keyFindings: An array of 3-4 important observations
   - recommendations: An array of 2-3 actionable recommendations

2. Focus on:
   - Highlighting the winning alternative and its advantages
   - Analyzing the criteria weights' impact on the decision
   - Identifying any significant gaps between alternatives
   - Providing practical recommendations

Example format:
{
  "summary": "The analysis shows a clear preference for [Alternative] with a significant lead of [X]% over other options...",
  "keyFindings": [
    "Alternative A leads with 45% overall score, significantly ahead of the second option",
    "Cost and Quality criteria had the highest weights, accounting for 60% of the decision",
    "The top two alternatives performed similarly in [criterion] but differed greatly in [criterion]"
  ],
  "recommendations": [
    "Proceed with implementing [Alternative] as it aligns well with the key criteria",
    "Consider [Alternative] as a backup option, particularly if [criterion] becomes more important"
  ]
}`;

