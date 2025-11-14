
import React from 'react';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { CollapsibleCard } from './CollapsibleCard';

interface AnalysisPlanProps {
    plan: string;
}

export const AnalysisPlan: React.FC<AnalysisPlanProps> = ({ plan }) => {
    // Basic parsing for numbered lists
    const planItems = plan.split('\n').filter(line => line.match(/^\d+\./));

    return (
        <CollapsibleCard
            title="AI-Generated Analysis Plan"
            icon={<DocumentTextIcon className="w-6 h-6" />}
        >
            <div className="p-4 bg-surface">
                <ol className="list-decimal list-inside space-y-2 text-text-secondary">
                    {planItems.map((item, index) => (
                        <li key={index}>{item.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                </ol>
            </div>
        </CollapsibleCard>
    );
};
