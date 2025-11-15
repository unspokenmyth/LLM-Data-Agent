// Helper function to handle fetch requests and errors
async function postAPI<T>(endpoint: string, body: object): Promise<T> {
    try {
        const response = await fetch(`/api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'An unknown API error occurred.' }));
            throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching from /api/${endpoint}:`, error);
        throw error;
    }
}


export async function generateAnalysisPlan(query: string, schema: string): Promise<string> {
    const data = await postAPI<{ plan: string }>('generate-analysis-plan', { query, schema });
    return data.plan;
}

export async function generatePythonCode(plan: string, schema: string): Promise<string> {
    const data = await postAPI<{ code: string }>('generate-python-code', { plan, schema });
    return data.code;
}

export async function generateSQLQuery(query: string, schema: string): Promise<string> {
    const data = await postAPI<{ sql: string }>('generate-sql-query', { query, schema });
    return data.sql;
}

export async function summarizeResults(query: string, plan: string, result_preview: string): Promise<string> {
    const data = await postAPI<{ summary: string }>('summarize-results', { query, plan, result_preview });
    return data.summary;
}

export async function generateChartConfig(query: string, schema: string, dataPreview: Record<string, any>[]): Promise<any> {
    const data = await postAPI<{ config: any | null }>('generate-chart-config', { query, schema, dataPreview });
    return data.config;
}
