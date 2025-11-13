
import React from 'react';
import { LightBulbIcon } from './icons/LightBulbIcon';

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

    flushList(); // Flush any remaining list items

    return <>{elements}</>;
};

export const AISummary: React.FC<AISummaryProps> = ({ summary }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-border-light p-6">
             <div className="flex items-center gap-3 mb-3">
                <LightBulbIcon className="w-6 h-6 text-primary-action" />
                <h3 className="font-bold text-text-primary text-xl">AI Summary & Insights</h3>
            </div>
            <div className="text-text-secondary space-y-2">
                <SimpleMarkdownRenderer content={summary} />
            </div>
        </div>
    );
};
