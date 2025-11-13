
import React, { useState } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { CodeBracketIcon } from './icons/CodeBracketIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface GeneratedCodeProps {
    code: string;
}

export const GeneratedCode: React.FC<GeneratedCodeProps> = ({ code }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, copy] = useCopyToClipboard();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-border-light">
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <CodeBracketIcon className="w-6 h-6 text-primary-action" />
                    <h3 className="font-bold text-text-primary">Generated Python Code</h3>
                </div>
                <div>
                     <button onClick={() => copy(code)} className="mr-4 p-1 text-text-secondary hover:text-text-primary">
                        {isCopied ? <CheckIcon className="w-5 h-5 text-success" /> : <ClipboardIcon className="w-5 h-5" />}
                     </button>
                    <button onClick={() => setIsOpen(!isOpen)}>
                        <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
             {isOpen && (
                <div className="bg-gray-800 p-4 font-mono text-sm text-white overflow-x-auto">
                    <pre><code>{code}</code></pre>
                </div>
             )}
        </div>
    );
};
