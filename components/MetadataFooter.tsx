
import React from 'react';
import { ResultMetadata } from '../types';

interface MetadataFooterProps {
    metadata: ResultMetadata;
}

export const MetadataFooter: React.FC<MetadataFooterProps> = ({ metadata }) => {
    return (
        <div className="text-center text-xs text-text-secondary p-4 bg-surface rounded-lg">
            <span>Execution Time: {(metadata.executionTime / 1000).toFixed(2)}s</span>
            <span className="mx-2">|</span>
            <span>Timestamp: {new Date(metadata.timestamp).toLocaleString()}</span>
            <span className="mx-2">|</span>
            <span>Output: {metadata.outputFile}</span>
            <span className="mx-2">|</span>
            <a href="#" className="underline hover:text-primary-action">View Logs</a>
        </div>
    );
};
