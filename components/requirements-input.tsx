"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { type ComplianceRequirements, type ImageFormat, type FitMode, PRESETS } from "@/lib/compliance-types"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Sparkles } from "lucide-react"

interface RequirementsInputProps {
  value: ComplianceRequirements
  onChange: (req: ComplianceRequirements) => void
  selectedPresetId: string | null
  onPresetSelect: (id: string | null) => void
}

export function RequirementsInput({ 
  value, 
  onChange, 
  selectedPresetId, 
  onPresetSelect 
}: RequirementsInputProps) {
  const [parsedMessage, setParsedMessage] = useState<string | null>(null)

  const update = <K extends keyof ComplianceRequirements>(key: K, v: ComplianceRequirements[K]) => {
    onPresetSelect(null)
    onChange({ ...value, [key]: v })
  }

  const applyPreset = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id)
    if (preset) {
      onPresetSelect(id)
      onChange(preset.requirements)
      setParsedMessage(`Applied preset: ${preset.label}`)
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {parsedMessage && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center text-xs font-bold uppercase tracking-widest text-primary animate-in fade-in slide-in-from-top-1">
            {parsedMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-[1fr_1.4fr]">
        {/* Left Column: Technical Configuration */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 px-1">
            <Label className="text-xs font-black uppercase tracking-widest text-primary/60">Manual Configuration</Label>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="width" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Width (px)</Label>
              </div>
              <Input
                id="width"
                type="number"
                value={value.width}
                onChange={(e) => update("width", Number.parseInt(e.target.value) || 0)}
                className="h-12 w-full transition-all focus:ring-emerald-500/20"
              />
            </div>
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="height" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Height (px)</Label>
              </div>
              <Input
                id="height"
                type="number"
                value={value.height}
                onChange={(e) => update("height", Number.parseInt(e.target.value) || 0)}
                className="h-12 w-full transition-all focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="min-w-0 space-y-2 text-left">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="dpi" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">DPI</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="size-3.5 text-muted-foreground/40 transition-colors hover:text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Dots Per Inch. 300+ is official standard.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={String(value.dpi)} onValueChange={(v) => update("dpi", Number.parseInt(v))}>
                <SelectTrigger id="dpi" className="h-12 w-full transition-all focus:ring-emerald-500/20">
                  <SelectValue placeholder="DPI" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="72">72 DPI (Web)</SelectItem>
                  <SelectItem value="150">150 DPI (Draft)</SelectItem>
                  <SelectItem value="300">300 DPI (Official)</SelectItem>
                  <SelectItem value="600">600 DPI (High Res)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 space-y-2 text-left">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="format" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Format</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="size-3.5 text-muted-foreground/40 transition-colors hover:text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    JPEG/PNG/WebP options.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={value.format} onValueChange={(v) => update("format", v as ImageFormat)}>
                <SelectTrigger id="format" className="h-12 w-full transition-all focus:ring-emerald-500/20">
                  <SelectValue placeholder="Format" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="min-w-0 space-y-2 text-left">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="fit" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Resizing</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="size-3.5 text-muted-foreground/40 transition-colors hover:text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Crop to Fill or Add Padding.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={value.fit} onValueChange={(v) => update("fit", v as FitMode)}>
                <SelectTrigger id="fit" className="h-12 w-full transition-all focus:ring-emerald-500/20">
                  <SelectValue placeholder="Fit Mode" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Crop to Fill</SelectItem>
                  <SelectItem value="contain">Add Padding</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="maxSize" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Max size (kb)</Label>
              <Input
                id="maxSize"
                type="number"
                value={value.maxFileSizeKb || ""}
                placeholder="Unlimited"
                onChange={(e) => update("maxFileSizeKb", Number.parseInt(e.target.value) || undefined)}
                className="h-12 w-full transition-all focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-all hover:bg-emerald-500/10">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="bg-removal" className="cursor-pointer text-sm font-black uppercase tracking-tight text-emerald-950">AI Background Removal</Label>
                  <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">Pro</span>
                </div>
                <p className="text-[10px] font-medium leading-tight text-emerald-600/70">
                  Instantly strip background for official documents (Passport/Visa).
                </p>
              </div>
              <Switch
                id="bg-removal"
                checked={value.removeBackground}
                onCheckedChange={(checked) => update("removeBackground", checked)}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </div>
        </div>

      {/* Right Column: Industry Presets */}
      <div className="space-y-6 xl:border-l xl:border-border/50 xl:pl-12">
          <div className="flex items-center justify-between px-1">
            <Label className="text-xs font-black uppercase tracking-widest text-primary/60">Quick Select Presets</Label>
            <span className="text-[10px] font-bold text-muted-foreground/40">{PRESETS.length} templates</span>
          </div>
        <Accordion type="single" collapsible className="w-full">
          {Array.from(new Set(PRESETS.map((p) => p.category))).map((category) => {
            const items = PRESETS.filter((p) => p.category === category)
            const hasActive = items.some((p) => p.id === selectedPresetId)
            return (
              <AccordionItem key={category} value={category} className="border-border">
                <AccordionTrigger className="py-5 hover:no-underline">
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2 pr-2">
                    <span className="truncate font-display text-base font-bold tracking-tight text-foreground">{category}</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40">
                      {hasActive && (
                        <span className="inline-flex size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" aria-hidden="true" />
                      )}
                      {items.length} options
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-4">
                  <ul className="flex flex-col gap-1.5">
                    {items.map((p) => {
                      const active = p.id === selectedPresetId
                      return (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => applyPreset(p.id)}
                            className={cn(
                              "group flex w-full flex-col gap-1.5 rounded-md border border-border bg-card/60 p-2.5 text-left transition-colors hover:border-primary/60 hover:bg-muted/50",
                              active && "border-primary bg-primary/5",
                            )}
                            aria-pressed={active}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <span className="block text-sm font-medium leading-tight text-foreground">
                                  {p.label}
                                </span>
                                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                                  {p.description}
                                </span>
                              </div>
                              {active && (
                                <span className="mt-0.5 inline-flex shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-1">
                              <Spec>
                                {p.requirements.width}×{p.requirements.height}px
                              </Spec>
                              <Spec>{p.requirements.dpi} DPI</Spec>
                              <Spec>{p.requirements.format.toUpperCase()}</Spec>
                              {p.requirements.fit !== "cover" && <Spec>{p.requirements.fit}</Spec>}
                              {p.requirements.maxFileSizeKb && <Spec>≤{p.requirements.maxFileSizeKb}KB</Spec>}
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
        </div>
      </div>
    </div>
  </TooltipProvider>
)
}

function Spec({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded border border-border/70 bg-background/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      {children}
    </span>
  )
}
