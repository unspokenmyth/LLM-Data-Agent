
import React, { useState, ReactNode } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface CollapsibleCardProps {
    title: ReactNode;
    icon: ReactNode;
    children: ReactNode;
    actions?: ReactNode;
    defaultOpen?: boolean;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ title, icon, actions, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-border-light overflow-hidden">
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-primary-action">{icon}</span>
                    <div className="font-bold text-text-primary">{title}</div>
                </div>
                <div className="flex items-center gap-2">
                    {actions}
                    <button onClick={() => setIsOpen(!isOpen)} className="p-1 text-text-secondary hover:text-text-primary" aria-expanded={isOpen} aria-label={isOpen ? `Collapse ${title}`: `Expand ${title}`}>
                        <ChevronDownIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="border-t border-border-light">
                    {children}
                </div>
            )}
        </div>
    );
};
