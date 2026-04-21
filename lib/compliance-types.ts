export type ImageFormat = "jpeg" | "png" | "webp"

export type FitMode = "cover" | "contain" | "fill"

export interface CropRegion {
  /** Source-image pixel coordinates of the crop rectangle. */
  x: number
  y: number
  width: number
  height: number
}

export interface ComplianceRequirements {
  width: number
  height: number
  dpi: number
  format: ImageFormat
  fit: FitMode
  maxFileSizeKb?: number
  /** Optional user-adjusted crop region (in source-image pixels). */
  cropRegion?: CropRegion
  /** Whether to remove background using AI. */
  removeBackground?: boolean
}

export interface ProcessingResult {
  dataUrl: string
  width: number
  height: number
  dpi: number
  format: ImageFormat
  fileSizeKb: number
  compliant: boolean
  issues: string[]
  appliedTransformations: string[]
}

export const DEFAULT_REQUIREMENTS: ComplianceRequirements = {
  width: 413,
  height: 531,
  dpi: 300,
  format: "jpeg",
  fit: "cover",
  removeBackground: false,
}

export interface PresetDefinition {
  id: string
  label: string
  description: string
  category: string
  requirements: ComplianceRequirements
}

export const PRESETS: PresetDefinition[] = [
  // Official documents
  {
    id: "ireland-permit",
    label: "Ireland Employment Permit",
    description: "413 × 531 px · 300 DPI · JPEG",
    category: "Official documents",
    requirements: { width: 413, height: 531, dpi: 300, format: "jpeg", fit: "cover", maxFileSizeKb: 240 },
  },
  {
    id: "us-passport",
    label: "US Passport",
    description: "600 × 600 px · 300 DPI · JPEG",
    category: "Official documents",
    requirements: { width: 600, height: 600, dpi: 300, format: "jpeg", fit: "cover", maxFileSizeKb: 240 },
  },
  {
    id: "eu-passport",
    label: "EU Passport / Schengen Visa",
    description: "413 × 531 px · 300 DPI · JPEG",
    category: "Official documents",
    requirements: { width: 413, height: 531, dpi: 300, format: "jpeg", fit: "cover", maxFileSizeKb: 500 },
  },

  // Careers
  {
    id: "cv-headshot",
    label: "CV / Resume headshot",
    description: "600 × 600 px · JPEG · ≤ 500 KB",
    category: "Careers",
    requirements: { width: 600, height: 600, dpi: 96, format: "jpeg", fit: "cover", maxFileSizeKb: 500 },
  },
  {
    id: "job-portal-photo",
    label: "Job portal photo",
    description: "400 × 400 px · JPEG · ≤ 300 KB",
    category: "Careers",
    requirements: { width: 400, height: 400, dpi: 96, format: "jpeg", fit: "cover", maxFileSizeKb: 300 },
  },
  {
    id: "linkedin",
    label: "LinkedIn profile photo",
    description: "400 × 400 px · PNG",
    category: "Careers",
    requirements: { width: 400, height: 400, dpi: 96, format: "png", fit: "cover" },
  },
  {
    id: "linkedin-banner",
    label: "LinkedIn personal banner",
    description: "1584 × 396 px · JPEG",
    category: "Careers",
    requirements: { width: 1584, height: 396, dpi: 96, format: "jpeg", fit: "cover", maxFileSizeKb: 8000 },
  },
  {
    id: "linkedin-company-banner",
    label: "LinkedIn company banner",
    description: "1128 × 191 px · JPEG",
    category: "Careers",
    requirements: { width: 1128, height: 191, dpi: 96, format: "jpeg", fit: "cover", maxFileSizeKb: 4000 },
  },

  // YouTube
  {
    id: "youtube-thumbnail",
    label: "YouTube thumbnail",
    description: "1280 × 720 px · JPEG · ≤ 2 MB",
    category: "YouTube",
    requirements: { width: 1280, height: 720, dpi: 96, format: "jpeg", fit: "cover", maxFileSizeKb: 2000 },
  },
  {
    id: "youtube-banner",
    label: "YouTube channel banner",
    description: "2560 × 1440 px · JPEG · ≤ 6 MB",
    category: "YouTube",
    requirements: { width: 2560, height: 1440, dpi: 96, format: "jpeg", fit: "cover", maxFileSizeKb: 6000 },
  },
  {
    id: "youtube-profile",
    label: "YouTube profile picture",
    description: "800 × 800 px · PNG",
    category: "YouTube",
    requirements: { width: 800, height: 800, dpi: 96, format: "png", fit: "cover" },
  },

  // Instagram
  {
    id: "instagram-square",
    label: "Instagram post (square)",
    description: "1080 × 1080 px · JPEG",
    category: "Instagram",
    requirements: { width: 1080, height: 1080, dpi: 96, format: "jpeg", fit: "cover", maxFileSizeKb: 4000 },
  },
  {
    id: "instagram-portrait",
    label: "Instagram post (portrait)",
    description: "1080 × 1350 px · JPEG",
    category: "Instagram",
    requirements: { width: 1080, height: 1350, dpi: 96, format: "jpeg", fit: "cover", maxFileSizeKb: 4000 },
  },
  {
    id: "instagram-story",
    label: "Instagram story / Reel",
    description: "1080 × 1920 px · JPEG",
    category: "Instagram",
    requirements: { width: 1080, height: 1920, dpi: 96, format: "jpeg", fit: "cover", maxFileSizeKb: 4000 },
  },

  // E-commerce
  {
    id: "amazon-main",
    label: "Amazon main product",
    description: "2000 × 2000 px · JPEG",
    category: "E-commerce",
    requirements: { width: 2000, height: 2000, dpi: 72, format: "jpeg", fit: "contain", maxFileSizeKb: 10000 },
  },
  {
    id: "amazon-secondary",
    label: "Amazon secondary image",
    description: "1600 × 1600 px · JPEG",
    category: "E-commerce",
    requirements: { width: 1600, height: 1600, dpi: 72, format: "jpeg", fit: "cover", maxFileSizeKb: 10000 },
  },
]
