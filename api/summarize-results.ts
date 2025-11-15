import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { query, plan, result_preview } = req.body;
        if (!query || !plan || !result_preview) {
            return res.status(400).json({ error: 'Missing required parameters: query, plan, result_preview' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        
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

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return res.status(200).json({ summary: response.text });
    } catch (err: any) {
        console.error('Error in summarize-results:', err);
        return res.status(500).json({ error: err.message || 'An internal server error occurred.' });
    }
}
