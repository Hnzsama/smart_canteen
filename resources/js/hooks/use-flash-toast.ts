import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    const lastToastRef = useRef<string | null>(null);

    useEffect(() => {
        const handleToast = (data?: FlashToast) => {
            if (!data?.message || !data?.type) {
                return;
            }
            const toastKey = `${data.type}-${data.message}`;
            if (lastToastRef.current === toastKey) {
                return;
            }
            lastToastRef.current = toastKey;
            setTimeout(() => {
                lastToastRef.current = null;
            }, 1000);

            if (typeof toast[data.type] === 'function') {
                toast[data.type](data.message);
            } else {
                toast(data.message);
            }
        };

        // Inertia v3 flash event (triggered by Inertia::flash())
        const unregisterFlash = router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;
            handleToast(data);
        });

        // Inertia navigate event (captures session flash in page props)
        const unregisterNavigate = router.on('navigate', (event) => {
            const detail = (event as CustomEvent).detail;
            const pageProps = detail?.page?.props as { flash?: { toast?: FlashToast } } | undefined;
            const data = pageProps?.flash?.toast;
            handleToast(data);
        });

        // Inertia success event (captures session flash on POST/PUT/DELETE without full page reload)
        const unregisterSuccess = router.on('success', (event) => {
            const detail = (event as CustomEvent).detail;
            const pageProps = detail?.page?.props as { flash?: { toast?: FlashToast } } | undefined;
            const data = pageProps?.flash?.toast;
            handleToast(data);
        });

        return () => {
            unregisterFlash();
            unregisterNavigate();
            unregisterSuccess();
        };
    }, []);
}

