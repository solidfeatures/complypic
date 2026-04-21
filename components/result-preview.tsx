"use client"

import { CheckCircle2, AlertTriangle, Download, Ruler, FileImage, Gauge, HardDrive, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProcessingResult, ComplianceRequirements } from "@/lib/compliance-types"
import { cn } from "@/lib/utils"

interface ResultPreviewProps {
  originalUrl: string | null
  result: ProcessingResult | null
  requirements: ComplianceRequirements
}

export function ResultPreview({ originalUrl, result, requirements }: ResultPreviewProps) {
  const download = () => {
    if (!result) return
    const a = document.createElement("a")
    a.href = result.dataUrl
    const ext = result.format === "jpeg" ? "jpg" : result.format
    a.download = `compliant-${result.width}x${result.height}-${result.dpi}dpi.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PreviewPanel 
          label="Initial Source" 
          url={originalUrl} 
          empty="Upload an image" 
        />
        <PreviewPanel 
          label="Compliance Output" 
          url={result?.dataUrl ?? null} 
          empty="Process to preview" 
          highlighted 
          aspectRatio={requirements.width / requirements.height}
        />
      </div>
      {result && (
        <>
          <div className="flex gap-3">
            <Button 
              onClick={download} 
              size="lg" 
              className="w-full bg-emerald-600 font-black uppercase tracking-widest text-white shadow-[0_10px_20px_rgba(5,150,105,0.3)] transition-all hover:bg-emerald-700 hover:scale-[1.01] active:scale-[0.99] dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <Download className="mr-2 size-5" aria-hidden="true" />
              Download compliant image
            </Button>
          </div>

          <ComplianceBanner compliant={result.compliant} issues={result.issues} />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              icon={Ruler}
              label="Dimensions"
              value={`${result.width}×${result.height}`}
              ok={result.width === requirements.width && result.height === requirements.height}
            />
            <Stat
              icon={Gauge}
              label="DPI"
              value={`${result.dpi}`}
              ok={Math.abs(result.dpi - requirements.dpi) <= 1}
            />
            <Stat icon={FileImage} label="Format" value={result.format.toUpperCase()} ok={result.format === requirements.format} />
            <Stat
              icon={HardDrive}
              label="File size"
              value={`${result.fileSizeKb} KB`}
              ok={!requirements.maxFileSizeKb || result.fileSizeKb <= requirements.maxFileSizeKb}
            />
          </div>

          {result.appliedTransformations.length > 0 && (
            <div className="rounded-xl border border-border bg-muted/20 p-5">
              <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                Applied Transformations
              </h3>
              <ul className="space-y-1">
                {result.appliedTransformations.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </>
      )}
    </div>
  )
}

function PreviewPanel({
  label,
  url,
  empty,
  highlighted,
  aspectRatio,
}: {
  label: string
  url: string | null
  empty: string
  highlighted?: boolean
  aspectRatio?: number
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{label}</span>
      </div>
      <div
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30",
          !aspectRatio && "aspect-square",
          highlighted && "border-primary/30 ring-1 ring-primary/10",
        )}
        style={aspectRatio ? { aspectRatio: String(aspectRatio) } : undefined}
      >
        {highlighted && url && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-xl backdrop-blur-md animate-in slide-in-from-top-2">
            <CheckCircle2 className="size-3" /> Final Build
          </div>
        )}
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={url || "/placeholder.svg"} 
            alt={`${label} preview`} 
            className="size-full object-contain animate-in fade-in zoom-in-95 duration-500" 
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
            <ImageIcon className="size-8" />
            <span className="text-[11px] font-medium uppercase tracking-wider">{empty}</span>
          </div>
        )}
        {highlighted && !url && (
          <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(circle_at_center,white,transparent)]" />
        )}
      </div>
    </div>
  )
}

function ComplianceBanner({ compliant, issues }: { compliant: boolean; issues: string[] }) {
  if (compliant) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">Image meets all requirements</p>
          <p className="text-xs text-muted-foreground">Ready to upload or submit.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Some requirements were not met</p>
        {issues.length > 0 && (
          <ul className="list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
            {issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  ok,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  label: string
  value: string
  ok: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all hover:border-border/80">
      <div className="flex items-center justify-between">
        <Icon className="size-4 text-muted-foreground/40" aria-hidden={true} />
        <span
          className={cn(
            "inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold",
            ok ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive",
          )}
          aria-label={ok ? "Compliant" : "Non-compliant"}
        >
          {ok ? "✓" : "!"}
        </span>
      </div>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{label}</p>
      <p className="font-display text-base font-black tracking-tight text-foreground">{value}</p>
    </div>
  )
}
