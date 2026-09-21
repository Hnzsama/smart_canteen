import { useEffect } from 'react';
import { router } from '@inertiajs/react';

export function useOrderPolling(onlyProps: string[], intervalMs = 3000) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: onlyProps });
        }, intervalMs);

        return () => clearInterval(interval);
    }, [onlyProps, intervalMs]);
}
