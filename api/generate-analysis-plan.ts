import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    try {
        const { query, schema } = req.body;
        if (!query || !schema) {
            return res.status(400).json({ error: 'Missing required parameters: query, schema' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

        const prompt = `
You are a data analysis expert. Given the following:
- User Question: "${query}"
- Dataset Schema: 
${schema}

Generate a step-by-step analysis plan to answer the question.
Format as a numbered list. Be specific about operations.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return res.status(200).json({ plan: response.text });
    } catch (err: any) {
        console.error('Error in generate-analysis-plan:', err);
        return res.status(500).json({ error: err.message || 'An internal server error occurred.' });
    }
}
