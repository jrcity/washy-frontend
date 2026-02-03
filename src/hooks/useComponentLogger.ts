import { useEffect } from 'react';

/**
 * A utility hook to log component lifecycle events in development mode.
 */
export const useComponentLogger = (name: string, props?: any) => {
    useEffect(() => {
        if (import.meta.env.DEV) {
            console.log(`[Component] ${name} mounted`, props || '');

            return () => {
                console.log(`[Component] ${name} unmounted`);
            };
        }
    }, [name, props]);
};
