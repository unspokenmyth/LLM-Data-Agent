
import React from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { CollapsibleCard } from './CollapsibleCard';
import { CodeBracketIcon } from './icons/CodeBracketIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ExecutionMode } from '../types';
import { SqlIcon } from './icons/SqlIcon';

interface GeneratedCodeProps {
    script: string;
    language: ExecutionMode;
}

const languageConfig = {
    python: {
        title: "Generated Python Code",
        icon: <CodeBracketIcon className="w-6 h-6" />,
        filename: "generated_code.py",
        mimeType: "text/x-python",
    },
    sql: {
        title: "Generated SQL Query",
        icon: <SqlIcon className="w-6 h-6" />,
        filename: "generated_query.sql",
        mimeType: "application/sql",
    }
}

const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const GeneratedCode: React.FC<GeneratedCodeProps> = ({ script, language }) => {
    const [isCopied, copy] = useCopyToClipboard();
    const config = languageConfig[language];

    const handleDownload = () => {
        downloadFile(script, config.filename, config.mimeType);
    };

    const actions = (
        <>
            <button onClick={() => copy(script)} className="p-1 text-text-secondary hover:text-text-primary" aria-label="Copy code">
                {isCopied ? <CheckIcon className="w-5 h-5 text-success" /> : <ClipboardIcon className="w-5 h-5" />}
            </button>
            <button onClick={handleDownload} className="p-1 text-text-secondary hover:text-text-primary" aria-label="Download code">
                <DownloadIcon className="w-5 h-5" />
            </button>
        </>
    );

    return (
        <CollapsibleCard
            title={config.title}
            icon={config.icon}
            actions={actions}
        >
            <div className="bg-gray-800 p-4 font-mono text-sm text-white overflow-x-auto">
                <pre><code>{script}</code></pre>
            </div>
        </CollapsibleCard>
    );
};
