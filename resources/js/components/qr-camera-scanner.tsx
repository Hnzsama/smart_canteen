import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QrCameraScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onClose?: () => void;
}

export function QrCameraScanner({ onScanSuccess, onClose }: QrCameraScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
    const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
    const scannerId = useRef(`qr-reader-${Math.random().toString(36).substring(2, 9)}`).current;

    useEffect(() => {
        let isMounted = true;

        const startScanner = async () => {
            try {
                setErrorMsg(null);
                const devices = await Html5Qrcode.getCameras();
                if (!isMounted) return;

                if (devices && devices.length > 0) {
                    setCameras(devices);
                    const backCam = devices.find((d) => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear'));
                    const targetCamId = selectedCameraId || (backCam ? backCam.id : devices[0].id);

                    const html5QrCode = new Html5Qrcode(scannerId);
                    scannerRef.current = html5QrCode;

                    await html5QrCode.start(
                        targetCamId,
                        {
                            fps: 10,
                            qrbox: { width: 220, height: 220 },
                            aspectRatio: 1.0,
                        },
                        (decodedText) => {
                            // On successful scan
                            if (html5QrCode.isScanning) {
                                html5QrCode.stop().catch(console.error);
                            }
                            onScanSuccess(decodedText);
                        },
                        () => {
                            // Ignore frame decode errors
                        }
                    );

                    if (isMounted) setIsScanning(true);
                } else {
                    if (isMounted) setErrorMsg('Kamera tidak ditemukan di perangkat ini.');
                }
            } catch (err: any) {
                console.error('Camera initialization error:', err);
                if (isMounted) {
                    if (err?.name === 'NotAllowedError' || err?.toString().includes('Permission denied')) {
                        setErrorMsg('Izin akses kamera ditolak. Harap beri izin kamera pada browser Anda.');
                    } else {
                        setErrorMsg('Gagal mengakses kamera laptop/HP. Pastikan kamera tidak digunakan aplikasi lain.');
                    }
                }
            }
        };

        startScanner();

        return () => {
            isMounted = false;
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().then(() => {
                    scannerRef.current?.clear();
                }).catch(console.error);
            }
        };
    }, [selectedCameraId]);

    const handleSwitchCamera = () => {
        if (cameras.length <= 1) return;
        const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
        const nextIndex = (currentIndex + 1) % cameras.length;
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().then(() => {
                setSelectedCameraId(cameras[nextIndex].id);
            }).catch(console.error);
        } else {
            setSelectedCameraId(cameras[nextIndex].id);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3 w-full p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
            <div className="flex items-center justify-between w-full pb-1 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Camera className="size-4 text-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-foreground">Scan QR via Kamera Laptop / HP</span>
                </div>
                {cameras.length > 1 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSwitchCamera}
                        className="h-7 text-[11px] px-2.5 gap-1 font-semibold"
                    >
                        <RefreshCw className="size-3" />
                        <span>Ganti Kamera</span>
                    </Button>
                )}
            </div>

            {errorMsg ? (
                <div className="flex flex-col items-center justify-center p-6 text-center text-destructive bg-destructive/10 rounded-xl border border-destructive/20 space-y-2 w-full">
                    <AlertCircle className="size-8 text-destructive" />
                    <p className="text-xs font-semibold">{errorMsg}</p>
                    <p className="text-[11px] text-muted-foreground">
                        Anda tetap bisa memasukkan kode pickup secara manual di bawah.
                    </p>
                </div>
            ) : (
                <div className="relative w-full max-w-[280px] aspect-square rounded-xl overflow-hidden bg-black border-2 border-emerald-500/50 shadow-inner flex items-center justify-center">
                    <div id={scannerId} className="w-full h-full" />
                    {!isScanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white gap-2 p-4 text-center">
                            <CameraOff className="size-8 text-muted-foreground animate-spin" />
                            <span className="text-xs font-medium">Membuka kamera...</span>
                        </div>
                    )}
                </div>
            )}

            <p className="text-[11px] text-muted-foreground text-center">
                Arahkan QR Code Tiket Pickup / Pembayaran dari HP mahasiswa ke kamera.
            </p>
        </div>
    );
}
