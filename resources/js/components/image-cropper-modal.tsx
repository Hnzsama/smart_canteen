import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Crop, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    onCropComplete: (croppedFile: File, croppedPreviewUrl: string) => void;
    title?: string;
    aspectRatio?: number; // Default 1 (1:1 square)
};

export function ImageCropperModal({
    isOpen,
    onClose,
    imageSrc,
    onCropComplete,
    title = 'Potong Foto 1:1 (Square)',
    aspectRatio = 1,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!imageSrc) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;
        img.onload = () => {
            setImageObj(img);
            setZoom(1);
            setRotation(0);
            setOffset({ x: 0, y: 0 });
        };
    }, [imageSrc]);

    useEffect(() => {
        if (!imageObj || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = 320;
        canvas.width = size;
        canvas.height = size / aspectRatio;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        // Move to center
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);

        // Draw image centered
        const drawWidth = canvas.width;
        const drawHeight = (drawWidth * imageObj.height) / imageObj.width;
        ctx.drawImage(
            imageObj,
            -drawWidth / 2 + offset.x,
            -drawHeight / 2 + offset.y,
            drawWidth,
            drawHeight
        );

        ctx.restore();
    }, [imageObj, zoom, rotation, offset, aspectRatio]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleCropSave = () => {
        if (!imageObj) return;

        // Render full quality 600x600 1:1 canvas
        const outputCanvas = document.createElement('canvas');
        const outputSize = 600;
        outputCanvas.width = outputSize;
        outputCanvas.height = outputSize / aspectRatio;
        const ctx = outputCanvas.getContext('2d');

        if (!ctx) return;

        ctx.translate(outputCanvas.width / 2, outputCanvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);

        const drawWidth = outputCanvas.width;
        const drawHeight = (drawWidth * imageObj.height) / imageObj.width;
        const scaleFactor = outputSize / 320;

        ctx.drawImage(
            imageObj,
            -drawWidth / 2 + offset.x * scaleFactor,
            -drawHeight / 2 + offset.y * scaleFactor,
            drawWidth,
            drawHeight
        );

        outputCanvas.toBlob(
            (blob) => {
                if (!blob) return;
                const file = new File([blob], 'cropped-menu-image.jpg', {
                    type: 'image/jpeg',
                });
                const previewUrl = URL.createObjectURL(blob);
                onCropComplete(file, previewUrl);
                onClose();
            },
            'image/jpeg',
            0.9
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <Crop className="h-5 w-5 text-amber-500" />
                        <span>{title}</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Geser & pas atur posisi gambar dalam bingkai kotak 1:1 agar tampil rapi di menu makanan.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center space-y-4 py-2">
                    <div
                        className="relative overflow-hidden rounded-2xl border-2 border-dashed border-amber-500/50 bg-black/90 cursor-move shadow-inner"
                        style={{ width: 320, height: 320 / aspectRatio }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <canvas ref={canvasRef} className="h-full w-full pointer-events-none" />
                        <div className="absolute inset-0 border border-white/20 pointer-events-none grid grid-cols-3 grid-rows-3">
                            <div className="border-r border-b border-white/10" />
                            <div className="border-r border-b border-white/10" />
                            <div className="border-b border-white/10" />
                            <div className="border-r border-b border-white/10" />
                            <div className="border-r border-b border-white/10" />
                            <div className="border-b border-white/10" />
                        </div>
                    </div>

                    <div className="w-full space-y-3 px-2">
                        <div className="flex items-center justify-between gap-3 text-xs">
                            <Label className="text-xs font-semibold flex items-center gap-1">
                                <ZoomIn className="h-3.5 w-3.5 text-muted-foreground" />
                                Perbesar / Zoom
                            </Label>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                                >
                                    <ZoomOut className="h-3.5 w-3.5" />
                                </Button>
                                <span className="font-mono text-xs w-12 text-center">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                                >
                                    <ZoomIn className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => setRotation((r) => (r + 90) % 360)}
                                >
                                    <RotateCw className="h-3.5 w-3.5 mr-1" />
                                    Putar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="outline" size="sm" onClick={onClose}>
                        Batal
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        onClick={handleCropSave}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold"
                    >
                        Terapkan Crop 1:1
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
