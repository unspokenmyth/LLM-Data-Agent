
import React from 'react';
import { ResultMetadata } from '../types';
import { InfoIcon } from './icons/InfoIcon';

interface MetadataFooterProps {
    metadata: ResultMetadata;
}

export const MetadataFooter: React.FC<MetadataFooterProps> = ({ metadata }) => {
    return (
        <div className="text-center text-xs text-text-secondary p-4 bg-surface rounded-lg space-x-2 flex items-center justify-center flex-wrap">
            {metadata.isFromCache && (
                <span className="flex items-center gap-1 text-info font-semibold">
                    <InfoIcon className="w-4 h-4" />
                    <span>Served from cache</span>
                    <span className="mx-1">|</span>
                </span>
            )}
            <span>Execution Time: {metadata.isFromCache ? '0.00s' : (metadata.executionTime / 1000).toFixed(2) + 's'}</span>
            <span className="hidden sm:inline mx-1">|</span>
            <span className="block sm:inline">Timestamp: {new Date(metadata.timestamp).toLocaleString()}</span>
            <span className="hidden sm:inline mx-1">|</span>
            <span className="block sm:inline">Output: {metadata.outputFile}</span>
        </div>
    );
};
