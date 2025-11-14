
import React from 'react';
import { AppState, Status } from '../types';
import { DataVizIcon } from './icons/DataVizIcon';
import { PlusIcon } from './icons/PlusIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { ChevronDoubleLeftIcon } from './icons/ChevronDoubleLeftIcon';

interface SidebarProps {
    analyses: AppState[];
    currentAnalysisId: string | null;
    onNewAnalysis: () => void;
    onSelectAnalysis: (id: string) => void;
    isCollapsed: boolean;
    onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ analyses, currentAnalysisId, onNewAnalysis, onSelectAnalysis, isCollapsed, onToggle }) => {
    return (
        <aside className={`bg-gray-800 text-white flex flex-col fixed h-full shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
            <div className={`flex items-center gap-3 p-4 mb-4 border-b border-gray-700 ${isCollapsed ? 'justify-center' : ''}`}>
                <DataVizIcon className="w-8 h-8 text-primary-action flex-shrink-0" />
                {!isCollapsed && <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">Data Intelligence</h1>}
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3">
                 <div className="mb-6">
                    <button
                        onClick={onNewAnalysis}
                        className={`w-full bg-primary-action text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 ${isCollapsed ? 'justify-center px-2' : 'justify-center px-4'}`}
                        aria-label="New Analysis"
                    >
                        <PlusIcon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span>New Analysis</span>}
                    </button>
                </div>


                <div className={`flex items-center gap-3 mb-4 text-gray-400 ${isCollapsed ? 'justify-center' : 'px-1'}`}>
                    <HistoryIcon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <h2 className="text-sm font-semibold uppercase tracking-wider">History</h2>}
                </div>

                <ul className="space-y-2">
                    {analyses.length === 0 && !isCollapsed && (
                        <li className="text-sm text-gray-500 text-center py-4 px-2">Your analyses will appear here.</li>
                    )}
                    {analyses.map(analysis => (
                        <li key={analysis.id}>
                            <button
                                onClick={() => onSelectAnalysis(analysis.id)}
                                title={analysis.query}
                                className={`w-full text-left p-3 rounded-md transition-colors ${analysis.id === currentAnalysisId ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                            >
                                {isCollapsed ? (
                                    <div className="flex justify-center">
                                       {analysis.status === Status.PROCESSING ? <LoadingSpinner className="w-5 h-5 text-primary-action"/> : <div className={`w-2 h-2 rounded-full ${analysis.status === Status.SUCCESS ? 'bg-success' : 'bg-error'}`}></div>}
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-semibold truncate text-gray-200 flex-1 pr-2">{analysis.query || "New Analysis"}</p>
                                            {analysis.status === Status.PROCESSING && <LoadingSpinner className="w-4 h-4 text-primary-action"/>}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(analysis.metadata?.timestamp || analysis.id.split('_')[1]).toLocaleString()}</p>
                                    </>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="p-2 border-t border-gray-700">
                <button 
                    onClick={onToggle}
                    className="w-full flex items-center justify-center p-2 text-gray-400 hover:bg-gray-700 rounded-md transition-colors"
                >
                    <ChevronDoubleLeftIcon className={`w-6 h-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </aside>
    );
};
