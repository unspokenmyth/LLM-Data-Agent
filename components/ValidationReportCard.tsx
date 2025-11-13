
import React, { useState } from 'react';
import { ValidationReport } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { WarningIcon } from './icons/WarningIcon';
import { InfoIcon } from './icons/InfoIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ErrorIcon } from './icons/ErrorIcon';

interface ValidationReportCardProps {
    report: ValidationReport;
}

const severityConfig = {
    critical: { Icon: ErrorIcon, text: 'text-error', border: 'border-error' },
    warning: { Icon: WarningIcon, text: 'text-warning', border: 'border-warning' },
    info: { Icon: InfoIcon, text: 'text-info', border: 'border-info' },
};

const getOverallStatus = (report: ValidationReport) => {
    if (report.issues.some(i => i.severity === 'critical')) return { text: 'Critical Issues Found', Icon: ErrorIcon, classes: severityConfig.critical.text };
    if (report.issues.some(i => i.severity === 'warning')) return { text: 'Warnings Found', Icon: WarningIcon, classes: severityConfig.warning.text };
    return { text: 'Validation Passed', Icon: CheckCircleIcon, classes: 'text-success' };
}

export const ValidationReportCard: React.FC<ValidationReportCardProps> = ({ report }) => {
    const [isOpen, setIsOpen] = useState(true);
    const status = getOverallStatus(report);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-border-light overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between items-center text-left">
                <div className="flex items-center gap-3">
                    <status.Icon className={`w-6 h-6 ${status.classes}`} />
                    <div>
                      <h3 className="font-bold text-text-primary">Data Validation Report</h3>
                      <p className={`text-sm font-semibold ${status.classes}`}>{status.text}</p>
                    </div>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="p-4 border-t border-border-light bg-surface">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                       <div><p className="text-2xl font-bold">{report.totalRows.toLocaleString()}</p><p className="text-sm text-text-secondary">Total Rows</p></div>
                       <div><p className="text-2xl font-bold">{report.totalColumns}</p><p className="text-sm text-text-secondary">Total Columns</p></div>
                       <div><p className="text-2xl font-bold">{report.missingValuePercent}%</p><p className="text-sm text-text-secondary">Missing Values</p></div>
                       <div><p className="text-2xl font-bold">{report.duplicateRowsPercent}%</p><p className="text-sm text-text-secondary">Duplicate Rows</p></div>
                   </div>
                   {report.issues.length > 0 && (
                       <div className="mt-4">
                           <h4 className="font-bold text-text-primary mb-2">Issues Found:</h4>
                           <ul className="space-y-2">
                               {report.issues.map((issue, index) => {
                                   const config = severityConfig[issue.severity];
                                   return (
                                     <li key={index} className={`flex items-start gap-3 p-3 bg-white rounded border-l-4 ${config.border}`}>
                                         <config.Icon className={`w-5 h-5 ${config.text} mt-0.5 flex-shrink-0`} />
                                         <p className="text-sm text-text-secondary">{issue.message}</p>
                                     </li>
                                   )
                               })}
                           </ul>
                       </div>
                   )}
                </div>
            )}
        </div>
    );
};
