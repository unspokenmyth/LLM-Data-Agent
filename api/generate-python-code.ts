import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { plan, schema } = req.body;
        if (!plan || !schema) {
            return res.status(400).json({ error: 'Missing required parameters: plan, schema' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        
        const prompt = `
Convert this analysis plan into Python code using Pandas.

Plan:
${plan}

Dataset Schema:
${schema}

Requirements:
- The data is in a pandas DataFrame named 'df'.
- Add comments for each step.
- Use only pandas, numpy.
- Handle potential errors (e.g., null values).
- If creating a chart is implied, note that it will be handled separately.
- Ensure the final line of code is the variable containing the result (e.g. a dataframe or a descriptive string), if any.

Output ONLY the Python code, with no explanations or markdown formatting.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });

        let code = response.text;
        if (code.startsWith("```python")) {
            code = code.substring(9);
        }
        if (code.endsWith("```")) {
            code = code.substring(0, code.length - 3);
        }
        
        return res.status(200).json({ code: code.trim() });
    } catch (err: any) {
        console.error('Error in generate-python-code:', err);
        return res.status(500).json({ error: err.message || 'An internal server error occurred.' });
    }
}
