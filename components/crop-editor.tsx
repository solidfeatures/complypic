"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Cropper, { type Area } from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { CropRegion } from "@/lib/compliance-types"
import { RotateCcw, ZoomIn } from "lucide-react"

interface CropEditorProps {
  imageSrc: string
  aspect: number
  aspectLabel: string
  initialCrop?: CropRegion | null
  onSave: (region: CropRegion) => void
  onClear: () => void
}

export function CropEditor({
  imageSrc,
  aspect,
  aspectLabel,
  initialCrop,
  onSave,
  onClear,
}: CropEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pixelArea, setPixelArea] = useState<Area | null>(null)
  const lastSyncRef = useRef<string>("")
  
  // Create a stable initial values set to avoid Cropper reset loops
  const [internalInitialCrop] = useState(() => initialCrop);

  // Stabilize zoom array and handler to prevent Slider re-renders
  const zoomValue = useMemo(() => [zoom], [zoom])
  const handleZoomChange = useCallback((v: number[]) => setZoom(v[0] ?? 1), [])

  useEffect(() => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setPixelArea(null)
  }, [imageSrc, aspect])

  const handleCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setPixelArea(areaPixels)
    
    // Only sync if the area has actually changed to prevent loops
    const syncKey = `${areaPixels.x}-${areaPixels.y}-${areaPixels.width}-${areaPixels.height}`
    if (syncKey !== lastSyncRef.current) {
      lastSyncRef.current = syncKey
      onSave({
        x: areaPixels.x,
        y: areaPixels.y,
        width: areaPixels.width,
        height: areaPixels.height,
      })
    }
  }, [onSave])

  const handleReset = useCallback(() => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    onClear()
  }, [onClear])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-black/20 shadow-inner ring-1 ring-white/10">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          initialCroppedAreaPixels={internalInitialCrop || undefined}
          restrictPosition
          objectFit="contain"
          showGrid
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            <ZoomIn className="size-3" />
            Zoom Control
          </div>
          <Button variant="ghost" size="xs" onClick={handleReset} className="h-6 text-[10px] uppercase tracking-tighter">
            <RotateCcw className="mr-1 size-3" /> Reset
          </Button>
        </div>
        <Slider
          value={zoomValue}
          onValueChange={handleZoomChange}
          min={1}
          max={3}
          step={0.01}
          className="py-2"
        />
        <p className="text-center text-[10px] text-muted-foreground">
          Frame locked to <span className="font-bold text-primary">{aspectLabel}</span> aspect ratio
        </p>
      </div>
    </div>
  )
}
