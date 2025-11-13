
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available. In a real-world scenario,
// this would be handled by a secure environment management system.
if (!process.env.API_KEY) {
    // In a development environment, you can fall back to a hardcoded key
    // for ease of use, but this is NOT recommended for production.
    // For this project, we assume process.env.API_KEY is set.
    console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateAnalysisPlan(query: string, schema: string): Promise<string> {
    const prompt = `
You are a data analysis expert. Given the following:
- User Question: "${query}"
- Dataset Schema: 
${schema}

Generate a step-by-step analysis plan to answer the question.
Format as a numbered list. Be specific about operations.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating analysis plan:", error);
        throw new Error("Failed to generate analysis plan. Please check your query and API key.");
    }
}

export async function generatePythonCode(plan: string, schema: string): Promise<string> {
    const prompt = `
Convert this analysis plan into Python code using Pandas and Matplotlib.

Plan:
${plan}

Dataset Schema:
${schema}

Requirements:
- The data is in a pandas DataFrame named 'df'.
- Add comments for each step.
- Use only pandas, numpy, and matplotlib libraries.
- Handle potential errors (e.g., null values).
- If creating a chart, save it to a file named 'output_chart.png' and create a title for the chart.
- Ensure the final line of code is the variable containing the result (e.g. a dataframe or a descriptive string), if any.

Output ONLY the Python code, with no explanations or markdown formatting.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using a more powerful model for code generation
            contents: prompt,
        });
        // Clean up the response to remove markdown code block fences if they exist
        let code = response.text;
        if (code.startsWith("```python")) {
            code = code.substring(9);
        }
        if (code.endsWith("```")) {
            code = code.substring(0, code.length - 3);
        }
        return code.trim();
    } catch (error) {
        console.error("Error generating Python code:", error);
        throw new Error("Failed to generate Python code. Please check your plan and API key.");
    }
}

export async function summarizeResults(query: string, plan: string, result_preview: string): Promise<string> {
    const prompt = `
You are a business analyst. Summarize these analysis results in clear, professional language using Markdown.

Original Question: ${query}
Analysis Performed: 
${plan}
Results Preview (JSON format): 
${result_preview}

Provide the summary with the following Markdown structure:
### 🔑 Key Finding
**[One-sentence key finding based on the data]**

### 📈 Supporting Details
- [Supporting detail 1 with specific numbers from the results]
- [Supporting detail 2 with specific numbers from the results]

### 💡 Business Insight
[A business insight or recommendation based on the findings]

Use a professional tone. Be concise (maximum 200 words). Avoid technical jargon.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing results:", error);
        throw new Error("Failed to summarize results. Please check your results and API key.");
    }
}

export async function generateChartConfig(query: string, schema: string, dataPreview: Record<string, any>[]): Promise<any> {
    const prompt = `
Based on the user's query and the provided data, create a configuration object for Chart.js to visualize the answer.

User Query: "${query}"

Dataset Schema:
${schema}

Data Preview (up to 10 rows):
${JSON.stringify(dataPreview, null, 2)}

Your task is to return a valid JSON object for Chart.js.
- The JSON object must have three properties: "type", "data", and "options".
- "type": Should be one of "bar", "line", or "pie". Choose the most appropriate type for the query.
- "data": Should contain "labels" and "datasets".
  - "labels": An array of strings from a categorical column in the data.
  - "datasets": An array of objects. Each object should represent a series and have:
    - "label": A string describing the data.
    - "data": An array of numbers from a numerical column in the data.
    - "backgroundColor", "borderColor": Use appealing colors. For bar/pie charts, provide an array of colors (e.g., ["rgba(255, 75, 75, 0.5)", "rgba(54, 162, 235, 0.5)"]). For line charts, provide a single color.
- "options": Should configure the chart. Include a responsive layout and a meaningful title.
  - Set "responsive": true.
  - Set "plugins.title.display": true.
  - Set "plugins.title.text" to a descriptive title for the chart.

If the user's query does not seem to ask for a chart or visualization (e.g., asking for raw data, a summary, or performing a non-visual task), return the JSON object: {"type": "none"}.

Return ONLY the JSON object. Do not include any other text or markdown formatting.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        const config = JSON.parse(response.text);
        if (config.type === 'none') return null;
        return config;
    } catch (error) {
        console.error("Error generating chart config:", error);
        // If it fails, we just don't show a chart
        return null;
    }
}
