import { type NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
import type { ImageFormat, FitMode } from "@/lib/compliance-types"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const width = Number.parseInt(formData.get("width") as string, 10)
    const height = Number.parseInt(formData.get("height") as string, 10)
    const dpi = Number.parseInt(formData.get("dpi") as string, 10)
    const format = formData.get("format") as ImageFormat
    const fit = (formData.get("fit") as FitMode) || "cover"
    const maxFileSizeKbRaw = formData.get("maxFileSizeKb") as string | null
    const maxFileSizeKb = maxFileSizeKbRaw ? Number.parseInt(maxFileSizeKbRaw, 10) : undefined
    const cropRegionRaw = formData.get("cropRegion") as string | null
    const cropRegion = cropRegionRaw
      ? (JSON.parse(cropRegionRaw) as { x: number; y: number; width: number; height: number })
      : null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!width || !height || !dpi || !format) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    if (width < 32 || height < 32 || width > 8000 || height > 8000) {
      return NextResponse.json({ error: "Dimensions must be between 32 and 8000 px" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)

    const originalMeta = await sharp(inputBuffer).metadata()
    const applied: string[] = []
    const issues: string[] = []

    if (originalMeta.width && originalMeta.height) {
      if (originalMeta.width < width || originalMeta.height < height) {
        issues.push(
          `Source image (${originalMeta.width}×${originalMeta.height}px) is smaller than the required output. Upscaling may reduce quality.`,
        )
      }
    }

    // Unified pipeline: (optional) user crop → resize → fit → format → DPI
    let pipeline = sharp(inputBuffer).rotate() // auto-rotate via EXIF

    // Apply user-defined crop first (coordinates are in auto-rotated source pixels).
    if (cropRegion) {
      const rotatedMeta = await sharp(inputBuffer).rotate().metadata()
      const srcW = rotatedMeta.width ?? originalMeta.width ?? 0
      const srcH = rotatedMeta.height ?? originalMeta.height ?? 0

      const left = Math.max(0, Math.round(cropRegion.x))
      const top = Math.max(0, Math.round(cropRegion.y))
      const cropW = Math.max(1, Math.min(Math.round(cropRegion.width), srcW - left))
      const cropH = Math.max(1, Math.min(Math.round(cropRegion.height), srcH - top))

      pipeline = pipeline.extract({ left, top, width: cropW, height: cropH })
      applied.push(`Applied custom framing (${cropW}×${cropH}px from ${srcW}×${srcH}px)`)
    }

    // If no manual crop, use "attention" to try to find the subject.
    // If manual crop is present, just fill the target dimensions as the aspect ratio is already correct.
    pipeline = pipeline.resize({
      width,
      height,
      fit,
      position: cropRegion ? undefined : "attention",
      withoutEnlargement: false,
    })
    applied.push(`Resized to ${width}×${height}px (${fit}${cropRegion ? "" : " + attention"})`)

    // Set DPI density in metadata
    pipeline = pipeline.withMetadata({ density: dpi })
    applied.push(`Set density to ${dpi} DPI`)

    // Format conversion with quality tuning, retry lower quality if over max file size
    const startQuality = format === "jpeg" ? 92 : 100
    let outputBuffer: Buffer
    let quality = startQuality
    let attempts = 0

    const encode = async (q: number): Promise<Buffer> => {
      let p = pipeline.clone()
      if (format === "jpeg") {
        p = p.jpeg({ quality: q, mozjpeg: true })
      } else if (format === "png") {
        p = p.png({ compressionLevel: 9 })
      } else if (format === "webp") {
        p = p.webp({ quality: q })
      }
      return await p.toBuffer()
    }

    outputBuffer = await encode(quality)
    applied.push(`Converted to ${format.toUpperCase()}`)

    if (maxFileSizeKb && format !== "png") {
      while (outputBuffer.byteLength / 1024 > maxFileSizeKb && quality > 40 && attempts < 6) {
        quality -= 10
        attempts += 1
        outputBuffer = await encode(quality)
      }
      if (outputBuffer.byteLength / 1024 > maxFileSizeKb) {
        issues.push(
          `Output is ${(outputBuffer.byteLength / 1024).toFixed(0)}KB, above the ${maxFileSizeKb}KB limit.`,
        )
      } else if (attempts > 0) {
        applied.push(`Reduced quality to ${quality} to fit under ${maxFileSizeKb}KB`)
      }
    }

    const outMeta = await sharp(outputBuffer).metadata()
    const actualWidth = outMeta.width ?? width
    const actualHeight = outMeta.height ?? height
    const actualDpi = Math.round(outMeta.density ?? dpi)
    const fileSizeKb = Math.round(outputBuffer.byteLength / 1024)

    const dimensionsOk = actualWidth === width && actualHeight === height
    const dpiOk = Math.abs(actualDpi - dpi) <= 1
    const formatOk = outMeta.format === format
    const sizeOk = !maxFileSizeKb || fileSizeKb <= maxFileSizeKb

    if (!dimensionsOk) issues.push(`Dimensions mismatch: ${actualWidth}×${actualHeight} (expected ${width}×${height})`)
    if (!dpiOk) issues.push(`DPI mismatch: ${actualDpi} (expected ${dpi})`)
    if (!formatOk) issues.push(`Format mismatch: ${outMeta.format} (expected ${format})`)

    const compliant = dimensionsOk && dpiOk && formatOk && sizeOk

    const mime = format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp"
    const dataUrl = `data:${mime};base64,${outputBuffer.toString("base64")}`

    return NextResponse.json({
      dataUrl,
      width: actualWidth,
      height: actualHeight,
      dpi: actualDpi,
      format,
      fileSizeKb,
      compliant,
      issues,
      appliedTransformations: applied,
    })
  } catch (err) {
    console.error("[v0] process-image error:", err)
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: `Processing failed: ${message}` }, { status: 500 })
  }
}
