
import React from 'react';
import { AppState } from '../types';
import { ValidationReportCard } from './ValidationReportCard';
import { AnalysisPlan } from './AnalysisPlan';
import { GeneratedCode } from './GeneratedCode';
import { DataOutput } from './DataOutput';
import { AISummary } from './AISummary';
import { MetadataFooter } from './MetadataFooter';

interface ResultsDisplayProps {
    state: AppState;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ state }) => {
    return (
        <div className="space-y-6">
            {state.summary && <AISummary summary={state.summary} />}
            {state.resultData && <DataOutput data={state.resultData} chartConfig={state.chartConfig} />}
            {state.validationReport && <ValidationReportCard report={state.validationReport} />}
            {state.analysisPlan && <AnalysisPlan plan={state.analysisPlan} />}
            {state.generatedCode && <GeneratedCode code={state.generatedCode} />}
            {state.metadata && <MetadataFooter metadata={state.metadata} />}
        </div>
    );
};
