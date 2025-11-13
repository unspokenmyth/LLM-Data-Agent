
import React, { useState, useRef } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface QueryInputProps {
    onAnalyze: (query: string, file: File) => void;
    isLoading: boolean;
}

export const QueryInput: React.FC<QueryInputProps> = ({ onAnalyze, isLoading }) => {
    const [query, setQuery] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
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
            if (selectedFile.type !== 'text/csv') {
                setError('Please upload a valid CSV file.');
                setFile(null);
                return;
            }
            setError('');
            setFile(selectedFile);
        }
    };
    
    const handleSubmit = () => {
        if (!file) {
            setError('Please upload a CSV file.');
            return;
        }
        if (!query.trim()) {
            setError('Please ask a question about your data.');
            return;
        }
        setError('');
        onAnalyze(query, file);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border-light">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-text-secondary mb-2">1. Upload your Data</label>
                    <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-surface border border-border-light rounded-lg px-4 py-3 text-text-secondary flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                    >
                       <PaperClipIcon className="w-5 h-5" />
                       <span className="truncate">{file ? file.name : 'Select a CSV file'}</span>
                    </button>
                    <p className="text-xs text-text-secondary mt-2 text-center">Max file size: {MAX_FILE_SIZE_MB}MB</p>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="query-input" className="block text-sm font-bold text-text-secondary mb-2">2. Ask a question about your data</label>
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
            </div>
            {error && <p className="text-error text-sm mt-4 text-center">{error}</p>}
            <div className="mt-4 text-center">
                 <button
                    onClick={handleSubmit}
                    disabled={isLoading}
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
