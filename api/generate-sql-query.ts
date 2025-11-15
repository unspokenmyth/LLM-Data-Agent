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
You are a SQL expert. Based on the user's question and the data schema, write a SQL query.

User Question: "${query}"

Table Schema (the table is named 'source_data'):
${schema}

Requirements:
- Use standard SQL syntax.
- The table name is 'source_data'.
- Add comments to explain complex logic if necessary.

Output ONLY the SQL query, with no explanations or markdown formatting.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });

        let sql = response.text;
        if (sql.startsWith("```sql")) {
            sql = sql.substring(5);
        }
        if (sql.endsWith("```")) {
            sql = sql.substring(0, sql.length - 3);
        }

        return res.status(200).json({ sql: sql.trim() });
    } catch (err: any) {
        console.error('Error in generate-sql-query:', err);
        return res.status(500).json({ error: err.message || 'An internal server error occurred.' });
    }
}
