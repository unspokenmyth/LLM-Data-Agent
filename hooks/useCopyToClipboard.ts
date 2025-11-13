
import { useState, useCallback } from 'react';

export const useCopyToClipboard = (): [boolean, (text: string) => void] => {
    const [isCopied, setIsCopied] = useState(false);

    const copy = useCallback((text: string) => {
        if (!navigator.clipboard) {
            console.warn('Clipboard not available');
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
    }, []);

    return [isCopied, copy];
};
