
import React from 'react';
import { DataVizIcon } from './icons/DataVizIcon';

export const Header: React.FC = () => {
    return (
        <header className="text-center py-8">
            <div className="flex items-center justify-center gap-4">
                <DataVizIcon className="w-12 h-12 text-primary-action" />
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
                    Data Intelligence Agent
                </h1>
            </div>
            <p className="mt-4 text-xl text-text-secondary max-w-3xl mx-auto">
                Your personal AI data engineer. Upload a CSV, ask a question, and get instant analysis, code, and visualizations.
            </p>
        </header>
    );
};
