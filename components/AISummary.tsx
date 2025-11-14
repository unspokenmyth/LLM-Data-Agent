
import React from 'react';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { CollapsibleCard } from './CollapsibleCard';
import { DownloadIcon } from './icons/DownloadIcon';

interface AISummaryProps {
    summary: string;
}

const renderWithBold = (text: string) => {
    return text.split('**').map((part, index) => 
        index % 2 === 1 ? <strong key={index} className="font-semibold text-text-primary">{part}</strong> : part
    );
};

const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2">
                    {listItems.map((item, idx) => <li key={idx}>{renderWithBold(item)}</li>)}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        if (line.startsWith('### ')) {
            flushList();
            elements.push(
                <h4 key={index} className="font-bold text-lg mt-4 mb-1 text-text-primary">
                    {renderWithBold(line.substring(4))}
                </h4>
            );
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            listItems.push(line.substring(2));
        } else {
            flushList();
            elements.push(<p key={index}>{renderWithBold(line)}</p>);
        }
    });

    flushList(); 

    return <>{elements}</>;
};

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


export const AISummary: React.FC<AISummaryProps> = ({ summary }) => {
    
    const handleDownload = () => {
        downloadFile(summary, 'ai_summary.md', 'text/markdown');
    };

    const actions = (
        <button onClick={handleDownload} className="p-1 text-text-secondary hover:text-text-primary" aria-label="Download summary">
            <DownloadIcon className="w-5 h-5" />
        </button>
    );
    
    return (
        <CollapsibleCard
            title="AI Summary & Insights"
            icon={<LightBulbIcon className="w-6 h-6" />}
            actions={actions}
            defaultOpen={true}
        >
            <div className="text-text-secondary space-y-2 p-4 bg-surface">
                <SimpleMarkdownRenderer content={summary} />
            </div>
        </CollapsibleCard>
    );
};
