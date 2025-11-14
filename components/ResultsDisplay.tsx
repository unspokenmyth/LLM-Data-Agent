
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
            <h2 className="text-2xl font-bold text-text-primary truncate" title={state.query}>
                Analysis for: <span className="text-primary-action">{state.query}</span>
            </h2>
            {state.summary && <AISummary summary={state.summary} />}
            {state.resultData && <DataOutput data={state.resultData} chartConfig={state.chartConfig} />}
            {state.validationReport && <ValidationReportCard report={state.validationReport} />}
            {state.analysisPlan && <AnalysisPlan plan={state.analysisPlan} />}
            {state.generatedScript && <GeneratedCode script={state.generatedScript} language={state.executionMode} />}
            {state.metadata && <MetadataFooter metadata={state.metadata} />}
        </div>
    );
};
