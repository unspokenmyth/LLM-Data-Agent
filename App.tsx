
import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { QueryInput } from './components/QueryInput';
import { ProgressTracker } from './components/ProgressTracker';
import { ResultsDisplay } from './components/ResultsDisplay';
import { generateAnalysisPlan, generatePythonCode, summarizeResults, generateChartConfig } from './services/geminiService';
import { AppState, PipelineStage, Status, ValidationReport, ValidationIssue } from './types';
import { Toast } from './components/Toast';

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

const parseCsvSchema = (csvText: string): string => {
    const lines = csvText.split(/\r\n|\n/);
    if (lines.length === 0) return 'No data in file.';
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Simple schema: just headers, data type is not inferred in this version
    const schema = headers.map(h => `- ${h} (data type unknown)`).join('\n');
    return schema;
}

const parseCsvForPreview = (csvText: string): Record<string, any>[] => {
    const lines = csvText.split(/\r\n|\n/);
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    // Preview up to the first 10 data rows
    const dataRows = lines.slice(1, 11);
    
    return dataRows.filter(line => line.trim() !== '').map(line => {
        // This simple split doesn't handle commas within quoted values
        const values = line.split(','); 
        const rowObject: Record<string, any> = {};
        headers.forEach((header, index) => {
            rowObject[header] = values[index]?.trim().replace(/"/g, '') || '';
        });
        return rowObject;
    });
};

const generateValidationReport = (csvText: string): ValidationReport => {
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
        return {
            totalRows: 0, totalColumns: 0, missingValues: 0, missingValuePercent: 0,
            duplicateRows: 0, duplicateRowsPercent: 0, dataTypes: {}, issues: [{ severity: 'critical', message: 'No data rows found in the file.' }]
        };
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const dataLines = lines.slice(1);
    const totalRows = dataLines.length;
    const totalColumns = headers.length;

    let missingValues = 0;
    const data = dataLines.map(line => {
        const values = line.split(','); // simple parse
        const row: string[] = [];
        for (let i = 0; i < totalColumns; i++) {
            const value = (values[i] || '').trim().replace(/"/g, '');
            if (value === '') {
                missingValues++;
            }
            row.push(value);
        }
        return row;
    });
    
    const rowStrings = new Set<string>();
    let duplicateRows = 0;
    dataLines.forEach(line => {
        if (rowStrings.has(line)) {
            duplicateRows++;
        } else {
            rowStrings.add(line);
        }
    });

    // Data type inference (simple version)
    const dataTypes: Record<string, string> = {};
    const sampleSize = Math.min(totalRows, 100); // Check up to 100 rows
    headers.forEach((header, colIndex) => {
        let isNumeric = true;
        for (let i = 0; i < sampleSize; i++) {
            const value = data[i][colIndex];
            if (value !== '' && isNumeric && isNaN(Number(value))) {
                isNumeric = false;
            }
        }
        if (isNumeric && sampleSize > 0) dataTypes[header] = 'numeric';
        else dataTypes[header] = 'text';
    });
    
    const issues: ValidationIssue[] = [];
    if (missingValues > 0) {
        issues.push({ severity: 'warning', message: `Found ${missingValues.toLocaleString()} missing values across the dataset.` });
    }
    if (duplicateRows > 0) {
        issues.push({ severity: 'warning', message: `Found ${duplicateRows.toLocaleString()} duplicate rows.` });
    }
    if (totalColumns > 20) {
        issues.push({ severity: 'info', message: 'Dataset has a large number of columns, which may affect analysis performance.' });
    }
    if (issues.length === 0) {
        issues.push({ severity: 'info', message: 'No immediate issues found during automated validation.' });
    }

    return {
        totalRows,
        totalColumns,
        missingValues,
        missingValuePercent: totalRows > 0 ? parseFloat(((missingValues / (totalRows * totalColumns)) * 100).toFixed(1)) : 0,
        duplicateRows,
        duplicateRowsPercent: totalRows > 0 ? parseFloat(((duplicateRows / totalRows) * 100).toFixed(1)) : 0,
        dataTypes,
        issues,
    };
};

const App: React.FC = () => {
  const initialState: AppState = {
    status: Status.IDLE,
    currentStage: null,
    query: '',
    file: null,
    validationReport: null,
    analysisPlan: null,
    generatedCode: null,
    resultData: null,
    chartConfig: null,
    summary: null,
    error: null,
    metadata: null,
  };

  const [state, setState] = useState<AppState>(initialState);
  const startTimeRef = useRef<number | null>(null);

  const resetState = () => {
    setState(initialState);
  };

  const handleAnalysis = useCallback(async (query: string, file: File) => {
    startTimeRef.current = performance.now();
    setState({
      ...initialState,
      status: Status.PROCESSING,
      currentStage: PipelineStage.VALIDATING,
      query,
      file,
    });

    try {
      // Read and parse CSV from user upload
      const csvText = await readFileAsText(file);
      const schema = parseCsvSchema(csvText);
      const dataPreview = parseCsvForPreview(csvText);
      const validationReport = generateValidationReport(csvText);
      
      await new Promise(res => setTimeout(res, 500));
      setState(s => ({ ...s, validationReport }));

      await new Promise(res => setTimeout(res, 500));
      setState(s => ({ ...s, currentStage: PipelineStage.PLANNING }));
      const plan = await generateAnalysisPlan(query, schema);
      setState(s => ({ ...s, analysisPlan: plan }));

      await new Promise(res => setTimeout(res, 1000));
      setState(s => ({ ...s, currentStage: PipelineStage.GENERATING }));
      const code = await generatePythonCode(plan, schema);
      setState(s => ({ ...s, generatedCode: code }));

      await new Promise(res => setTimeout(res, 1500));
      setState(s => ({ ...s, currentStage: PipelineStage.EXECUTING }));
      // This is a mock execution, but we use a real data preview from the user's file
      const resultData = dataPreview;
      const chartConfig = await generateChartConfig(query, schema, resultData);
      setState(s => ({ ...s, resultData, chartConfig }));

      await new Promise(res => setTimeout(res, 1000));
      setState(s => ({ ...s, currentStage: PipelineStage.VISUALIZING })); // Visualizing is just displaying
      const summary = await summarizeResults(query, plan, JSON.stringify(dataPreview, null, 2));
      
      const endTime = performance.now();
      const executionTime = Math.round(endTime - (startTimeRef.current ?? endTime));
      const timestamp = new Date().toISOString();

      setState(s => ({
        ...s,
        summary,
        currentStage: PipelineStage.COMPLETE,
        status: Status.SUCCESS,
        metadata: {
          executionTime,
          timestamp,
          outputFile: `output_${timestamp.replace(/[:.]/g, '-')}.parquet`,
        },
      }));
    } catch (err) {
      console.error(err);
      setState(s => ({
        ...s,
        status: Status.ERROR,
        currentStage: null,
        error: err instanceof Error ? err.message : 'An unknown error occurred.',
      }));
    }
  }, []);

  const clearError = () => {
    setState(s => ({ ...s, error: null, status: s.status === Status.ERROR ? Status.IDLE : s.status }));
  };

  return (
    <div className="bg-surface min-h-screen font-sans text-text-primary">
      <div className="container mx-auto p-4 md:p-8">
        <Header />
        <main className="mt-8 max-w-4xl mx-auto">
          <QueryInput onAnalyze={handleAnalysis} isLoading={state.status === Status.PROCESSING} />
          
          {(state.status === Status.PROCESSING || state.status === Status.SUCCESS) && (
             <div className="mt-8">
                <ProgressTracker currentStage={state.currentStage} />
             </div>
          )}

          {(state.status === Status.SUCCESS || state.status === Status.PROCESSING) && state.query && (
            <div className="mt-8 space-y-6">
                <ResultsDisplay state={state} />
            </div>
          )}

          {state.status === Status.ERROR && (
            <div className="mt-8 text-center">
              <p className="text-error mb-4">{state.error}</p>
              <button
                onClick={resetState}
                className="bg-primary-action text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          )}
        </main>
      </div>
      {state.error && <Toast message={state.error} type="error" onClose={clearError} />}
    </div>
  );
};

export default App;
