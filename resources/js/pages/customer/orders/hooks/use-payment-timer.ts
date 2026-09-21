import { useState, useEffect } from 'react';

interface UsePaymentTimerProps {
    expiresAt?: string | null;
    isExpiredProp?: boolean;
    isCash?: boolean;
    orderStatus?: string;
    paymentStatus?: string;
}

export function usePaymentTimer({
    expiresAt,
    isExpiredProp,
    isCash,
    orderStatus,
    paymentStatus,
}: UsePaymentTimerProps) {
    const maxMinutes = isCash ? 15 : 10;
    const maxSeconds = maxMinutes * 60;

    const calculateRemainingSeconds = () => {
        if (!expiresAt) return maxSeconds;
        const expiryTime = new Date(expiresAt).getTime();
        const now = Date.now();
        const diff = Math.floor((expiryTime - now) / 1000);
        return Math.max(0, diff);
    };

    const [remainingSeconds, setRemainingSeconds] = useState<number>(calculateRemainingSeconds);
    const [isExpired, setIsExpired] = useState<boolean>(
        Boolean(isExpiredProp || orderStatus === 'failed' || paymentStatus === 'failed' || calculateRemainingSeconds() <= 0)
    );

    useEffect(() => {
        if (isExpired) return;

        const timer = setInterval(() => {
            const secs = calculateRemainingSeconds();
            setRemainingSeconds(secs);

            if (secs <= 0) {
                setIsExpired(true);
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt, isExpired]);

    const formatTime = (totalSecs: number) => {
        const m = Math.floor(totalSecs / 60);
        const s = totalSecs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    return {
        remainingSeconds,
        isExpired,
        formattedTime: formatTime(remainingSeconds),
    };
}
