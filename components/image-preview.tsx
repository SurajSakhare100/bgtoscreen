"use client"

import { useEffect, useRef } from "react"
import type { ImageSettings } from "@/app/page"

interface ImagePreviewProps {
  image: string | null
  settings: ImageSettings
}

export function ImagePreview({ image, settings }: ImagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, background: string) => {
    // Apply border radius to all backgrounds
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(0, 0, width, height, 20)
    ctx.clip()

    if (background.startsWith("data:image/")) {
      // Handle uploaded image backgrounds - COVER entire background area
      const bgImg = new Image()
      bgImg.crossOrigin = "anonymous"
      bgImg.onload = () => {
        // Calculate background area (respecting background padding)
        const bgPadding = settings.backgroundPadding
        const bgWidth = width - bgPadding * 2
        const bgHeight = height - bgPadding * 2
        const bgX = bgPadding
        const bgY = bgPadding

        // COVER behavior - fill entire background area, crop if necessary
        const bgAspect = bgImg.width / bgImg.height
        const bgAreaAspect = bgWidth / bgHeight

        let drawWidth, drawHeight, drawX, drawY

        if (bgAspect > bgAreaAspect) {
          // Background is wider, fit to height and crop sides
          drawHeight = bgHeight
          drawWidth = bgHeight * bgAspect
          drawX = bgX - (drawWidth - bgWidth) / 2 // Center and allow cropping
          drawY = bgY
        } else {
          // Background is taller, fit to width and crop top/bottom
          drawWidth = bgWidth
          drawHeight = bgWidth / bgAspect
          drawX = bgX
          drawY = bgY - (drawHeight - bgHeight) / 2 // Center and allow cropping
        }

        // Clear and clip the background area first
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(bgX, bgY, bgWidth, bgHeight, 15)
        ctx.clip()
        ctx.clearRect(bgX, bgY, bgWidth, bgHeight)
        ctx.drawImage(bgImg, drawX, drawY, drawWidth, drawHeight)
        ctx.restore()

        // Force a redraw of the main image on top
        setTimeout(() => {
          if (image) {
            const mainImg = new Image()
            mainImg.crossOrigin = "anonymous"
            mainImg.onload = () => {
              drawMainImage(ctx, mainImg, width, height)
            }
            mainImg.src = image
          }
        }, 10)
      }
      bgImg.src = background
      ctx.restore()
      return
    }

    if (background.includes("gradient")) {
      if (background.includes("linear-gradient")) {
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        const colors = background.match(/#[a-fA-F0-9]{6}|rgb$$[^)]+$$|rgba$$[^)]+$$/g) || []

        if (colors.length >= 2) {
          gradient.addColorStop(0, colors[0])
          gradient.addColorStop(1, colors[colors.length - 1])

          if (colors.length > 2) {
            for (let i = 1; i < colors.length - 1; i++) {
              gradient.addColorStop(i / (colors.length - 1), colors[i])
            }
          }
        } else {
          gradient.addColorStop(0, "#f0f0f0")
          gradient.addColorStop(1, "#e0e0e0")
        }

        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = "#f0f0f0"
      }
    } else {
      ctx.fillStyle = background
    }

    ctx.fillRect(0, 0, width, height)

    const texturePattern = getTexturePattern(ctx, background)
    if (texturePattern) {
      ctx.fillStyle = texturePattern
      ctx.fillRect(0, 0, width, height)
    }

    ctx.restore()
  }

  const drawMainImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number,
  ) => {
    // HIGH QUALITY RENDERING SETTINGS
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    // Use background padding to determine available space
    const availableWidth = canvasWidth - settings.backgroundPadding * 2
    const availableHeight = canvasHeight - settings.backgroundPadding * 2

    // Calculate display size - PRESERVE ORIGINAL QUALITY
    // Use original image dimensions as base, don't reduce quality
    let displayWidth = img.width * settings.scale
    let displayHeight = img.height * settings.scale

    // ONLY scale down if absolutely necessary (image too large for container)
    // This preserves maximum quality by avoiding unnecessary scaling
    const containerMaxScale = Math.min(
      (availableWidth - settings.padding * 2) / displayWidth,
      (availableHeight - settings.padding * 2) / displayHeight,
    )

    // Only apply container scaling if image is larger than available space
    if (containerMaxScale < 1) {
      displayWidth *= containerMaxScale
      displayHeight *= containerMaxScale
    }

    // Calculate center position within available space
    const centerX = settings.backgroundPadding + availableWidth / 2
    const centerY = settings.backgroundPadding + availableHeight / 2

    // Save context for transformations
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((settings.rotation * Math.PI) / 180)

    const imageX = -displayWidth / 2
    const imageY = -displayHeight / 2

    // Draw shadow ONLY if shadow is enabled
    if (settings.shadow > 0 || settings.shadowBlur > 0) {
      ctx.save()

      // Set shadow properties
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = settings.shadowBlur
      ctx.shadowOffsetX = settings.shadow
      ctx.shadowOffsetY = settings.shadow

      // Draw shadow shape
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"

      if (settings.borderRadius > 0) {
        ctx.beginPath()
        ctx.roundRect(
          imageX - settings.padding,
          imageY - settings.padding,
          displayWidth + settings.padding * 2,
          displayHeight + settings.padding * 2,
          settings.borderRadius,
        )
        ctx.fill()
      } else {
        ctx.fillRect(
          imageX - settings.padding,
          imageY - settings.padding,
          displayWidth + settings.padding * 2,
          displayHeight + settings.padding * 2,
        )
      }

      ctx.restore()
    }

    // Reset shadow for actual content
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // Draw white padding background (on top of shadow)
    if (settings.padding > 0) {
      ctx.fillStyle = "white"
      if (settings.borderRadius > 0) {
        ctx.beginPath()
        ctx.roundRect(
          imageX - settings.padding,
          imageY - settings.padding,
          displayWidth + settings.padding * 2,
          displayHeight + settings.padding * 2,
          settings.borderRadius,
        )
        ctx.fill()
      } else {
        ctx.fillRect(
          imageX - settings.padding,
          imageY - settings.padding,
          displayWidth + settings.padding * 2,
          displayHeight + settings.padding * 2,
        )
      }
    }

    // Apply clipping for border radius on image
    if (settings.borderRadius > 0) {
      ctx.beginPath()
      const clipRadius = Math.max(0, settings.borderRadius - settings.padding / 2)
      ctx.roundRect(imageX, imageY, displayWidth, displayHeight, clipRadius)
      ctx.clip()
    }

    // HIGHEST QUALITY IMAGE RENDERING
    // Enable high-quality image smoothing for the main image
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    // Draw the main image with maximum quality preservation
    ctx.drawImage(img, imageX, imageY, displayWidth, displayHeight)

    ctx.restore()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || !image) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Get container dimensions
      const containerRect = container.getBoundingClientRect()

      // INCREASE CANVAS SIZE FOR BETTER QUALITY
      // Use higher resolution canvas for better quality
      const maxWidth = Math.min(containerRect.width - 20, 800) // Increased from 700
      const maxHeight = Math.min(containerRect.height - 20, 600) // Increased from 500

      // Calculate canvas size based on background ratio
      let canvasWidth = maxWidth
      let canvasHeight = maxHeight

      if (settings.backgroundRatio !== "free") {
        const [ratioW, ratioH] = settings.backgroundRatio.split(":").map(Number)
        const targetRatio = ratioW / ratioH

        // Fit the ratio within max dimensions
        if (maxWidth / maxHeight > targetRatio) {
          // Container is wider, fit to height
          canvasHeight = maxHeight
          canvasWidth = maxHeight * targetRatio
        } else {
          // Container is taller, fit to width
          canvasWidth = maxWidth
          canvasHeight = maxWidth / targetRatio
        }
      }

      // SET HIGH DPI CANVAS FOR CRISP RENDERING
      const dpr = window.devicePixelRatio || 1
      const displayWidth = canvasWidth
      const displayHeight = canvasHeight

      // Set actual canvas size in memory (scaled up for high DPI)
      canvas.width = canvasWidth * dpr
      canvas.height = canvasHeight * dpr

      // Scale the canvas back down using CSS
      canvas.style.width = displayWidth + "px"
      canvas.style.height = displayHeight + "px"

      // Scale the drawing context so everything draws at the higher resolution
      ctx.scale(dpr, dpr)

      // ENABLE HIGH QUALITY RENDERING
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      // Step 1: Draw background FIRST (bottom layer)
      drawBackground(ctx, canvasWidth, canvasHeight, settings.background)

      // Step 2: Draw main image with shadow ON TOP (top layer)
      drawMainImage(ctx, img, canvasWidth, canvasHeight)
    }

    img.src = image
  }, [image, settings])

  const getTexturePattern = (ctx: CanvasRenderingContext2D, background: string): CanvasPattern | null => {
    if (background === "#f8f9fa") {
      const patternCanvas = document.createElement("canvas")
      patternCanvas.width = 20
      patternCanvas.height = 20
      const patternCtx = patternCanvas.getContext("2d")

      if (patternCtx) {
        patternCtx.fillStyle = "#f8f9fa"
        patternCtx.fillRect(0, 0, 20, 20)
        patternCtx.fillStyle = "#dee2e6"
        patternCtx.beginPath()
        patternCtx.arc(10, 10, 1, 0, Math.PI * 2)
        patternCtx.fill()

        return ctx.createPattern(patternCanvas, "repeat")
      }
    } else if (background === "#ffffff") {
      const patternCanvas = document.createElement("canvas")
      patternCanvas.width = 20
      patternCanvas.height = 20
      const patternCtx = patternCanvas.getContext("2d")

      if (patternCtx) {
        patternCtx.fillStyle = "#ffffff"
        patternCtx.fillRect(0, 0, 20, 20)
        patternCtx.strokeStyle = "#e9ecef"
        patternCtx.lineWidth = 1
        patternCtx.beginPath()
        patternCtx.moveTo(0, 0)
        patternCtx.lineTo(20, 0)
        patternCtx.moveTo(0, 0)
        patternCtx.lineTo(0, 20)
        patternCtx.stroke()

        return ctx.createPattern(patternCanvas, "repeat")
      }
    }

    return null
  }

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg p-2">
      {image ? (
        <canvas
          ref={canvasRef}
          id="image-preview-canvas"
          className="max-w-full max-h-full border border-gray-200 rounded shadow-lg"
        />
      ) : (
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 md:w-12 md:h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm md:text-base">Upload an image to see preview</p>
        </div>
      )}
    </div>
  )
}
