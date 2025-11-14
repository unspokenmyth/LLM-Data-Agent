
import React, { useState, useRef } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { ExecutionMode } from '../types';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { CodeBracketIcon } from './icons/CodeBracketIcon';
import { SqlIcon } from './icons/SqlIcon';


interface QueryInputProps {
    onAnalyze: (query: string, file: File, mode: ExecutionMode) => void;
    isLoading: boolean;
}

type DataSource = 'local' | 's3' | 'database';

export const QueryInput: React.FC<QueryInputProps> = ({ onAnalyze, isLoading }) => {
    const [query, setQuery] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [dataSource, setDataSource] = useState<DataSource>('local');
    const [executionMode, setExecutionMode] = useState<ExecutionMode>('python');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_QUERY_LENGTH = 500;
    const MAX_FILE_SIZE_MB = 50;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                 setError(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
                 setFile(null);
                 return;
            }
            const fileType = selectedFile.type;
            const fileName = selectedFile.name;
            if (fileType !== 'text/csv' && !fileName.endsWith('.csv') && fileType !== 'application/json' && !fileName.endsWith('.json')) {
                setError('Please upload a valid CSV or JSON file.');
                setFile(null);
                return;
            }
            setError('');
            setFile(selectedFile);
        }
    };
    
    const handleSubmit = () => {
        if (!file) {
            setError('Please upload a file.');
            return;
        }
        if (!query.trim()) {
            setError('Please ask a question about your data.');
            return;
        }
        setError('');
        onAnalyze(query, file, executionMode);
    };
    
    const renderDataSourceContent = () => {
        switch(dataSource) {
            case 'local':
                return (
                    <>
                        <input type="file" accept=".csv,.json" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full bg-surface border-2 border-dashed border-border-light rounded-lg px-4 py-8 text-text-secondary flex flex-col items-center justify-center gap-2 hover:bg-gray-100 hover:border-primary-action transition-colors"
                        >
                           <UploadCloudIcon className="w-8 h-8" />
                           <span className="font-semibold">{file ? file.name : 'Click to select a CSV or JSON file'}</span>
                           <span className="text-xs">Max file size: {MAX_FILE_SIZE_MB}MB</span>
                        </button>
                    </>
                );
            case 's3':
            case 'database':
                return (
                     <div className="w-full bg-surface border-2 border-dashed border-border-light rounded-lg px-4 py-8 text-text-secondary flex flex-col items-center justify-center gap-2">
                        <DatabaseIcon className="w-8 h-8" />
                        <span className="font-semibold">{dataSource === 's3' ? 'S3 & Parquet Support' : 'SQL Database Connection'}</span>
                        <span className="text-xs font-bold text-info">Coming Soon</span>
                     </div>
                );
        }
    }
    
    const TabButton: React.FC<{source: DataSource, label: string, icon: React.ReactNode}> = ({ source, label, icon }) => (
         <button
            onClick={() => setDataSource(source)}
            className={`flex-1 flex items-center justify-center gap-2 p-3 font-semibold text-sm transition-colors rounded-t-lg border-b-2 ${dataSource === source ? 'text-primary-action border-primary-action' : 'text-text-secondary border-transparent hover:bg-gray-100'}`}
        >
            {icon} {label}
        </button>
    )

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border-light">
            <div className="mb-6">
                 <label className="block text-sm font-bold text-text-secondary mb-2">1. Connect your Data Source</label>
                 <div className="flex border-b border-border-light">
                     <TabButton source="local" label="Local File" icon={<PaperClipIcon className="w-5 h-5"/>} />
                     <TabButton source="s3" label="S3 / Parquet" icon={<DatabaseIcon className="w-5 h-5"/>} />
                     <TabButton source="database" label="Database" icon={<SqlIcon className="w-5 h-5" />} />
                 </div>
                 <div className="pt-4">
                    {renderDataSourceContent()}
                 </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-bold text-text-secondary mb-2">2. Choose Execution Mode</label>
                <div className="flex bg-surface rounded-lg p-1 border border-border-light">
                     <button 
                        onClick={() => setExecutionMode('python')}
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md font-semibold text-sm transition-colors ${executionMode === 'python' ? 'bg-primary-action text-white shadow' : 'text-text-secondary hover:bg-gray-200'}`}
                     >
                        <CodeBracketIcon className="w-5 h-5" /> Python / Pandas
                     </button>
                     <button
                        onClick={() => setExecutionMode('sql')}
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md font-semibold text-sm transition-colors ${executionMode === 'sql' ? 'bg-primary-action text-white shadow' : 'text-text-secondary hover:bg-gray-200'}`}
                     >
                        <SqlIcon className="w-5 h-5" /> SQL
                     </button>
                </div>
            </div>

            <div>
                <label htmlFor="query-input" className="block text-sm font-bold text-text-secondary mb-2">3. Ask a question about your data</label>
                <div className="relative">
                   <textarea
                        id="query-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        maxLength={MAX_QUERY_LENGTH}
                        placeholder="e.g., 'What's the average revenue by region?' or 'Plot quarterly trends for electronics'"
                        className="w-full border border-border-light rounded-lg p-3 pr-20 resize-none h-24 focus:ring-2 focus:ring-primary-action focus:outline-none bg-white text-text-primary"
                        disabled={isLoading}
                    />
                     <span className="absolute bottom-3 right-3 text-xs text-text-secondary">
                       {query.length} / {MAX_QUERY_LENGTH}
                    </span>
                </div>
            </div>

            {error && <p className="text-error text-sm mt-4 text-center">{error}</p>}

            <div className="mt-6 text-center">
                 <button
                    onClick={handleSubmit}
                    disabled={isLoading || !file}
                    className="bg-primary-action text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                >
                    {isLoading ? (
                        <>
                           <LoadingSpinner />
                           <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                           <SparklesIcon className="w-5 h-5" />
                           <span>Analyze Data</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
