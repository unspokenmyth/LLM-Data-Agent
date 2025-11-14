
import React from 'react';
import { DataVizIcon } from './icons/DataVizIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface WelcomeProps {
    onStart: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
    return (
        <div className="text-center flex flex-col items-center justify-center h-full p-8 rounded-lg bg-white shadow-sm border border-border-light">
            <DataVizIcon className="w-24 h-24 text-primary-action/50" />
            <h1 className="mt-8 text-4xl font-bold text-text-primary tracking-tight">
                Welcome to the Data Intelligence Agent
            </h1>
            <p className="mt-4 text-xl text-text-secondary max-w-2xl mx-auto">
                Your personal AI data engineer. Upload a CSV, ask a question, and get instant analysis, code, and visualizations.
            </p>
            <button
                onClick={onStart}
                className="mt-8 bg-primary-action text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
                <SparklesIcon className="w-5 h-5" />
                Start New Analysis
            </button>
        </div>
    );
};
