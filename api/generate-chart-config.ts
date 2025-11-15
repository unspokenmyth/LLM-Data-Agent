import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { query, schema, dataPreview } = req.body;
        if (!query || !schema || !dataPreview) {
            return res.status(400).json({ error: 'Missing required parameters: query, schema, dataPreview' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        
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

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        const config = JSON.parse(response.text);
        if (config.type === 'none') {
            return res.status(200).json({ config: null });
        }
        return res.status(200).json({ config });

    } catch (err: any) {
        console.error('Error in generate-chart-config:', err);
        // It's safer to return null than to fail the entire analysis
        return res.status(200).json({ config: null });
    }
}
