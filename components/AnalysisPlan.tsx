
import React from 'react';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface AnalysisPlanProps {
    plan: string;
}

export const AnalysisPlan: React.FC<AnalysisPlanProps> = ({ plan }) => {
    // Basic parsing for numbered lists
    const planItems = plan.split('\n').filter(line => line.match(/^\d+\./));

    return (
        <div className="bg-white rounded-lg shadow-sm border border-border-light">
             <div className="p-4 flex items-center gap-3 border-b border-border-light">
                <DocumentTextIcon className="w-6 h-6 text-primary-action" />
                <h3 className="font-bold text-text-primary">AI-Generated Analysis Plan</h3>
            </div>
            <div className="p-4 bg-surface">
                <ol className="list-decimal list-inside space-y-2 text-text-secondary">
                    {planItems.map((item, index) => (
                        <li key={index}>{item.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                </ol>
            </div>
        </div>
    );
};
