
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { QueryInput } from './components/QueryInput';
import { ProgressTracker } from './components/ProgressTracker';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Welcome } from './components/Welcome';
import { Toast } from './components/Toast';
import { generateAnalysisPlan, generatePythonCode, summarizeResults, generateChartConfig, generateSQLQuery } from './services/geminiService';
import { AppState, PipelineStage, Status, ValidationReport, ValidationIssue, ExecutionMode } from './types';
import { DataVizIcon } from './components/icons/DataVizIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';

// Helper functions for CSV/JSON parsing and validation
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

const parseSchema = (fileContent: string, fileType: 'csv' | 'json'): string => {
    if (fileType === 'csv') {
        const lines = fileContent.split(/\r\n|\n/);
        if (lines.length === 0) return 'No data in file.';
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        return headers.map(h => `- ${h} (data type unknown)`).join('\n');
    } else { // json
        try {
            const data = JSON.parse(fileContent);
            const sample = Array.isArray(data) ? data[0] : data;
            if (typeof sample !== 'object' || sample === null) return 'JSON is not an object or array of objects.';
            return Object.keys(sample).map(key => `- ${key} (type: ${typeof sample[key]})`).join('\n');
        } catch {
            return 'Could not parse JSON file to determine schema.';
        }
    }
};

const parseForPreview = (fileContent: string, fileType: 'csv' | 'json'): Record<string, any>[] => {
    try {
        if (fileType === 'csv') {
            const lines = fileContent.split(/\r\n|\n/);
            if (lines.length < 2) return [];
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            return lines.slice(1, 11).filter(line => line.trim() !== '').map(line => {
                const values = line.split(',');
                const rowObject: Record<string, any> = {};
                headers.forEach((header, index) => {
                    rowObject[header] = values[index]?.trim().replace(/"/g, '') || '';
                });
                return rowObject;
            });
        } else { // json
            const data = JSON.parse(fileContent);
            return (Array.isArray(data) ? data : [data]).slice(0, 10);
        }
    } catch {
        return [];
    }
};

const generateValidationReport = (fileContent: string, fileType: 'csv' | 'json'): ValidationReport => {
    // This is a simplified validation report for the demo.
    // For JSON, we can add more specific checks (e.g., consistent object keys).
    const lines = fileContent.split(/\r\n|\n/).filter(line => line.trim() !== '');
    if (fileType === 'csv' && lines.length < 2) {
        return { totalRows: 0, totalColumns: 0, missingValues: 0, missingValuePercent: 0, duplicateRows: 0, duplicateRowsPercent: 0, dataTypes: {}, issues: [{ severity: 'critical', message: 'No data rows found in the CSV file.' }] };
    }
     if (fileType === 'json' && lines.length === 0) {
        return { totalRows: 0, totalColumns: 0, missingValues: 0, missingValuePercent: 0, duplicateRows: 0, duplicateRowsPercent: 0, dataTypes: {}, issues: [{ severity: 'critical', message: 'JSON file appears to be empty.' }] };
    }

    // For simplicity, we'll keep the detailed CSV validation and a basic one for JSON.
    if (fileType === 'csv') {
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const dataLines = lines.slice(1);
        const totalRows = dataLines.length;
        const totalColumns = headers.length;
        let missingValues = 0;
        dataLines.forEach(line => {
            const values = line.split(',');
            if (values.length < totalColumns || values.some(v => v.trim() === '')) missingValues++;
        });
        const rowStrings = new Set<string>();
        let duplicateRows = 0;
        dataLines.forEach(line => {
            if (rowStrings.has(line)) duplicateRows++;
            else rowStrings.add(line);
        });
        return { totalRows, totalColumns, missingValues, missingValuePercent: parseFloat(((missingValues/totalRows)*100).toFixed(1)), duplicateRows, duplicateRowsPercent: parseFloat(((duplicateRows/totalRows)*100).toFixed(1)), dataTypes: {}, issues: [{ severity: 'info', message: 'Basic CSV validation complete.' }] };
    }
    
    // Basic validation for JSON
    const data = parseForPreview(fileContent, 'json');
    return { totalRows: data.length, totalColumns: data.length > 0 ? Object.keys(data[0]).length : 0, missingValues: 0, missingValuePercent: 0, duplicateRows: 0, duplicateRowsPercent: 0, dataTypes: {}, issues: [{ severity: 'info', message: 'JSON file parsed successfully.' }] };
};


const getFileHash = async (file: File): Promise<string> => {
    // A more robust hash would involve ArrayBuffer and crypto.subtle,
    // but for simplicity, we use metadata.
    return `${file.name}-${file.size}-${file.lastModified}`;
};


type AppStatus = 'welcome' | 'new_analysis' | 'viewing_analysis';

const App: React.FC = () => {
  const [analyses, setAnalyses] = useState<AppState[]>([]);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [appStatus, setAppStatus] = useState<AppStatus>('welcome');
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const cachedAnalyses = localStorage.getItem('dia-analyses');
    if (cachedAnalyses) {
        setAnalyses(JSON.parse(cachedAnalyses));
    }
  }, []);

  const handleStartNewAnalysis = () => {
    setAppStatus('new_analysis');
    setCurrentAnalysisId(null);
  };

  const handleSelectAnalysis = (id: string) => {
    setCurrentAnalysisId(id);
    setAppStatus('viewing_analysis');
  }

  const updateAnalysisState = (id: string, updates: Partial<AppState>) => {
    setAnalyses(prev => {
        const newAnalyses = prev.map(a => a.id === id ? { ...a, ...updates } : a);
        // Persist to local storage
        try {
            const analysisToCache = newAnalyses.find(a => a.id === id);
            if(analysisToCache && analysisToCache.status === Status.SUCCESS) {
                 localStorage.setItem(`cache_${analysisToCache.query}_${analysisToCache.metadata?.fileHash}`, JSON.stringify(analysisToCache));
            }
        } catch (e) {
            console.warn("Could not write to localStorage:", e);
        }
        return newAnalyses;
    });
  };
  
  const handleAnalysis = useCallback(async (query: string, file: File, mode: ExecutionMode) => {
    const fileHash = await getFileHash(file);
    const cacheKey = `cache_${query}_${fileHash}`;

    // Check cache first
    const cachedResult = localStorage.getItem(cacheKey);
    if (cachedResult) {
        const cachedAnalysis = JSON.parse(cachedResult) as AppState;
        cachedAnalysis.metadata = { ...cachedAnalysis.metadata!, isFromCache: true };
        
        setAnalyses(prev => [cachedAnalysis, ...prev.filter(a => a.id !== cachedAnalysis.id)]);
        setCurrentAnalysisId(cachedAnalysis.id);
        setAppStatus('viewing_analysis');
        setError("Loaded analysis from cache.");
        return;
    }

    const analysisId = `analysis_${Date.now()}`;
    const fileType = file.name.endsWith('.json') ? 'json' : 'csv';
    const initialState: AppState = {
      id: analysisId,
      status: Status.PROCESSING,
      currentStage: PipelineStage.VALIDATING,
      query,
      file,
      executionMode: mode,
      validationReport: null,
      analysisPlan: null,
      generatedScript: null,
      resultData: null,
      chartConfig: null,
      summary: null,
      error: null,
      metadata: null,
    };
    
    setAnalyses(prev => [initialState, ...prev]);
    setCurrentAnalysisId(analysisId);
    setAppStatus('viewing_analysis');
    startTimeRef.current = performance.now();

    try {
      const fileContent = await readFileAsText(file);
      const schema = parseSchema(fileContent, fileType);
      const dataPreview = parseForPreview(fileContent, fileType);
      const validationReport = generateValidationReport(fileContent, fileType);
      
      await new Promise(res => setTimeout(res, 300));
      updateAnalysisState(analysisId, { validationReport });

      await new Promise(res => setTimeout(res, 300));
      updateAnalysisState(analysisId, { currentStage: PipelineStage.PLANNING });
      const plan = await generateAnalysisPlan(query, schema);
      updateAnalysisState(analysisId, { analysisPlan: plan });

      await new Promise(res => setTimeout(res, 500));
      updateAnalysisState(analysisId, { currentStage: PipelineStage.GENERATING });
      
      let script: string;
      if (mode === 'python') {
        script = await generatePythonCode(plan, schema);
      } else {
        script = await generateSQLQuery(query, schema);
      }
      updateAnalysisState(analysisId, { generatedScript: script });

      await new Promise(res => setTimeout(res, 800));
      updateAnalysisState(analysisId, { currentStage: PipelineStage.EXECUTING });
      const resultData = dataPreview; // MOCK EXECUTION
      const chartConfig = await generateChartConfig(query, schema, resultData);
      updateAnalysisState(analysisId, { resultData, chartConfig });

      await new Promise(res => setTimeout(res, 500));
      updateAnalysisState(analysisId, { currentStage: PipelineStage.VISUALIZING });
      const summary = await summarizeResults(query, plan, JSON.stringify(dataPreview, null, 2));
      
      const endTime = performance.now();
      const executionTime = Math.round(endTime - (startTimeRef.current ?? endTime));
      const timestamp = new Date().toISOString();

      updateAnalysisState(analysisId, {
        summary,
        currentStage: PipelineStage.COMPLETE,
        status: Status.SUCCESS,
        metadata: { executionTime, timestamp, outputFile: mode === 'python' ? `output.parquet` : 'SQL Query', fileHash },
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      updateAnalysisState(analysisId, {
        status: Status.ERROR,
        currentStage: null,
        error: errorMessage,
      });
    }
  }, []);

  const clearError = () => setError(null);
  
  const currentAnalysis = analyses.find(a => a.id === currentAnalysisId);
  const isLoading = analyses.some(a => a.status === Status.PROCESSING);

  const renderMainContent = () => {
    switch (appStatus) {
      case 'welcome':
        return <Welcome onStart={handleStartNewAnalysis} />;
      case 'new_analysis':
        return <QueryInput onAnalyze={handleAnalysis} isLoading={isLoading} />;
      case 'viewing_analysis':
        if (!currentAnalysis) return <Welcome onStart={handleStartNewAnalysis} />;
        return (
          <>
            {(currentAnalysis.status === Status.PROCESSING || currentAnalysis.status === Status.SUCCESS) && (
              <div className="mb-6">
                <ProgressTracker currentStage={currentAnalysis.currentStage} />
              </div>
            )}
            <ResultsDisplay state={currentAnalysis} />
             {currentAnalysis.status === Status.ERROR && (
                <div className="mt-8 text-center bg-white p-8 rounded-lg shadow-sm border border-error">
                  <p className="text-error mb-4 text-lg">Analysis Failed</p>
                  <p className="text-text-secondary mb-6">{currentAnalysis.error}</p>
                </div>
            )}
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="bg-surface min-h-screen font-sans text-text-primary flex">
      <Sidebar
        analyses={analyses}
        currentAnalysisId={currentAnalysisId}
        onNewAnalysis={handleStartNewAnalysis}
        onSelectAnalysis={handleSelectAnalysis}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-border-light bg-white/80 backdrop-blur-sm sticky top-0 z-10">
             <div className="flex items-center gap-3">
                <DataVizIcon className="w-8 h-8 text-primary-action" />
                <h1 className="text-xl font-bold tracking-tight text-text-primary hidden md:block">Data Intelligence Agent</h1>
            </div>
            <button
                onClick={handleStartNewAnalysis}
                className="bg-primary-action text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
                <SparklesIcon className="w-5 h-5" />
                <span className="hidden sm:inline">New Analysis</span>
            </button>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              {renderMainContent()}
            </div>
        </main>
      </div>
      {error && <Toast message={error} type={error.includes("cache") ? "info" : "error"} onClose={clearError} />}
    </div>
  );
};

export default App;
