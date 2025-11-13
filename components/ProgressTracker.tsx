
import React from 'react';
import { PipelineStage } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';

interface ProgressTrackerProps {
    currentStage: PipelineStage | null;
}

const stages = Object.values(PipelineStage);

const stageDetails: Record<PipelineStage, { emoji: string }> = {
    [PipelineStage.VALIDATING]: { emoji: '🕵️‍♀️' },
    [PipelineStage.PLANNING]: { emoji: '🗺️' },
    [PipelineStage.GENERATING]: { emoji: '💻' },
    [PipelineStage.EXECUTING]: { emoji: '🚀' },
    [PipelineStage.VISUALIZING]: { emoji: '📊' },
    [PipelineStage.COMPLETE]: { emoji: '✅' },
};

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStage }) => {
    const currentIndex = currentStage ? stages.indexOf(currentStage) : -1;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-border-light">
            <div className="flex items-center justify-between">
                {stages.map((stage, index) => {
                    const isCompleted = currentIndex > index || currentIndex === stages.length - 1;
                    const isActive = currentIndex === index && currentIndex !== stages.length - 1;
                    const details = stageDetails[stage];
                    
                    let textColor = 'text-text-secondary';
                    if (isCompleted) textColor = 'text-success';
                    if (isActive) textColor = 'text-primary-action';

                    return (
                        <React.Fragment key={stage}>
                            <div className={`flex items-center gap-2 ${textColor} transition-colors duration-300`}>
                                <div className="w-6 h-6 flex items-center justify-center">
                                    {isCompleted ? <CheckCircleIcon className="w-6 h-6" /> : isActive ? <LoadingSpinner className="w-5 h-5" /> : <span className="text-xl opacity-75">{details.emoji}</span>}
                                </div>
                                <span className="text-sm font-medium hidden md:inline">{stage}</span>
                            </div>
                            {index < stages.length - 1 && (
                                <div className={`flex-1 h-1.5 mx-4 rounded-full ${index < currentIndex ? 'bg-success' : 'bg-border-light'}`}>
                                     {isActive && <div className="h-full w-full bg-primary-action/50 rounded-full animate-pulse"></div>}
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
