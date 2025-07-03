"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Crop, Square, Smartphone, Monitor, Tv, Phone } from "lucide-react"

interface CropModalProps {
  image: string
  onCropComplete: (croppedImageUrl: string) => void
  onCancel: () => void
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

const ASPECT_RATIOS = [
  { name: "Free", ratio: null, icon: Square, description: "No constraints" },
  { name: "1:1", ratio: 1, icon: Square, description: "Square" },
  { name: "3:4", ratio: 3 / 4, icon: Smartphone, description: "Portrait" },
  { name: "4:3", ratio: 4 / 3, icon: Monitor, description: "Landscape" },
  { name: "16:9", ratio: 16 / 9, icon: Tv, description: "Widescreen" },
  { name: "9:16", ratio: 9 / 16, icon: Phone, description: "Story" },
]

export function CropModal({ image, onCropComplete, onCancel }: CropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null)
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageData, setImageData] = useState<{
    img: HTMLImageElement
    scale: number
    offsetX: number
    offsetY: number
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Set canvas size
      const maxWidth = 600
      const maxHeight = 400

      const { width, height } = img
      const scale = Math.min(maxWidth / width, maxHeight / height, 1)

      const scaledWidth = width * scale
      const scaledHeight = height * scale

      canvas.width = maxWidth
      canvas.height = maxHeight

      const offsetX = (maxWidth - scaledWidth) / 2
      const offsetY = (maxHeight - scaledHeight) / 2

      setImageData({ img, scale, offsetX, offsetY })

      // Initialize crop area to full image for "Free" mode
      setCropArea({
        x: offsetX,
        y: offsetY,
        width: scaledWidth,
        height: scaledHeight,
      })

      drawCanvas(ctx, img, scale, offsetX, offsetY, {
        x: offsetX,
        y: offsetY,
        width: scaledWidth,
        height: scaledHeight,
      })
    }

    img.src = image
  }, [image])

  const drawCanvas = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      scale: number,
      offsetX: number,
      offsetY: number,
      crop: CropArea,
    ) => {
      const canvas = ctx.canvas

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw image
      ctx.drawImage(img, offsetX, offsetY, img.width * scale, img.height * scale)

      // Draw semi-transparent overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Clear crop area (make it fully visible)
      ctx.clearRect(crop.x, crop.y, crop.width, crop.height)

      // Redraw image in crop area
      const cropSourceX = (crop.x - offsetX) / scale
      const cropSourceY = (crop.y - offsetY) / scale
      const cropSourceWidth = crop.width / scale
      const cropSourceHeight = crop.height / scale

      ctx.drawImage(
        img,
        cropSourceX,
        cropSourceY,
        cropSourceWidth,
        cropSourceHeight,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
      )

      // Draw crop border
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.strokeRect(crop.x, crop.y, crop.width, crop.height)

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 1

      // Vertical lines
      ctx.beginPath()
      ctx.moveTo(crop.x + crop.width / 3, crop.y)
      ctx.lineTo(crop.x + crop.width / 3, crop.y + crop.height)
      ctx.moveTo(crop.x + (crop.width * 2) / 3, crop.y)
      ctx.lineTo(crop.x + (crop.width * 2) / 3, crop.y + crop.height)
      ctx.stroke()

      // Horizontal lines
      ctx.beginPath()
      ctx.moveTo(crop.x, crop.y + crop.height / 3)
      ctx.lineTo(crop.x + crop.width, crop.y + crop.height / 3)
      ctx.moveTo(crop.x, crop.y + (crop.height * 2) / 3)
      ctx.lineTo(crop.x + crop.width, crop.y + (crop.height * 2) / 3)
      ctx.stroke()

      // Draw resize handles
      const handleSize = 10
      ctx.fillStyle = "#3b82f6"
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2

      // Corner handles
      const corners = [
        { x: crop.x - handleSize / 2, y: crop.y - handleSize / 2 },
        { x: crop.x + crop.width - handleSize / 2, y: crop.y - handleSize / 2 },
        { x: crop.x - handleSize / 2, y: crop.y + crop.height - handleSize / 2 },
        { x: crop.x + crop.width - handleSize / 2, y: crop.y + crop.height - handleSize / 2 },
      ]

      corners.forEach((corner) => {
        ctx.fillRect(corner.x, corner.y, handleSize, handleSize)
        ctx.strokeRect(corner.x, corner.y, handleSize, handleSize)
      })
    },
    [],
  )

  useEffect(() => {
    if (!imageData) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    drawCanvas(ctx, imageData.img, imageData.scale, imageData.offsetX, imageData.offsetY, cropArea)
  }, [cropArea, imageData, drawCanvas])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageData) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicking on resize handles
    const handleSize = 10
    const corners = [
      { x: cropArea.x - handleSize / 2, y: cropArea.y - handleSize / 2 },
      { x: cropArea.x + cropArea.width - handleSize / 2, y: cropArea.y - handleSize / 2 },
      { x: cropArea.x - handleSize / 2, y: cropArea.y + cropArea.height - handleSize / 2 },
      { x: cropArea.x + cropArea.width - handleSize / 2, y: cropArea.y + cropArea.height - handleSize / 2 },
    ]

    const clickedCorner = corners.find(
      (corner) => x >= corner.x && x <= corner.x + handleSize && y >= corner.y && y <= corner.y + handleSize,
    )

    if (clickedCorner) {
      setIsResizing(true)
      setDragStart({ x, y })
    } else if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      setIsDragging(true)
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageData || (!isDragging && !isResizing)) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (isDragging) {
      const newX = Math.max(
        imageData.offsetX,
        Math.min(x - dragStart.x, imageData.offsetX + imageData.img.width * imageData.scale - cropArea.width),
      )
      const newY = Math.max(
        imageData.offsetY,
        Math.min(y - dragStart.y, imageData.offsetY + imageData.img.height * imageData.scale - cropArea.height),
      )

      setCropArea((prev) => ({ ...prev, x: newX, y: newY }))
    } else if (isResizing) {
      const deltaX = x - dragStart.x
      const deltaY = y - dragStart.y

      let newWidth = cropArea.width + deltaX
      let newHeight = cropArea.height + deltaY

      if (selectedRatio) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / selectedRatio
        } else {
          newWidth = newHeight * selectedRatio
        }
      }

      // Constrain to image bounds
      const maxWidth = imageData.offsetX + imageData.img.width * imageData.scale - cropArea.x
      const maxHeight = imageData.offsetY + imageData.img.height * imageData.scale - cropArea.y

      newWidth = Math.max(50, Math.min(newWidth, maxWidth))
      newHeight = Math.max(50, Math.min(newHeight, maxHeight))

      setCropArea((prev) => ({ ...prev, width: newWidth, height: newHeight }))
      setDragStart({ x, y })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  const handleRatioSelect = (ratio: number | null) => {
    setSelectedRatio(ratio)

    if (!imageData) return

    if (ratio === null) {
      // Free mode - set to full image
      setCropArea({
        x: imageData.offsetX,
        y: imageData.offsetY,
        width: imageData.img.width * imageData.scale,
        height: imageData.img.height * imageData.scale,
      })
    } else {
      // Calculate optimal size for the ratio
      const maxWidth = imageData.img.width * imageData.scale
      const maxHeight = imageData.img.height * imageData.scale

      let newWidth = Math.min(maxWidth * 0.8, maxHeight * 0.8 * ratio)
      let newHeight = newWidth / ratio

      if (newHeight > maxHeight * 0.8) {
        newHeight = maxHeight * 0.8
        newWidth = newHeight * ratio
      }

      const centerX = imageData.offsetX + maxWidth / 2
      const centerY = imageData.offsetY + maxHeight / 2

      setCropArea({
        x: centerX - newWidth / 2,
        y: centerY - newHeight / 2,
        width: newWidth,
        height: newHeight,
      })
    }
  }

  const handleCrop = () => {
    if (!imageData) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Calculate crop area in original image coordinates
    const scaleX = imageData.img.width / (imageData.img.width * imageData.scale)
    const scaleY = imageData.img.height / (imageData.img.height * imageData.scale)

    const cropX = (cropArea.x - imageData.offsetX) * scaleX
    const cropY = (cropArea.y - imageData.offsetY) * scaleY
    const cropWidth = cropArea.width * scaleX
    const cropHeight = cropArea.height * scaleY

    canvas.width = cropWidth
    canvas.height = cropHeight

    ctx.drawImage(imageData.img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

    const croppedImageUrl = canvas.toDataURL("image/png")
    onCropComplete(croppedImageUrl)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Crop Image</h2>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Aspect Ratio Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Crop Size</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ASPECT_RATIOS.map((ratio) => {
                  const IconComponent = ratio.icon
                  return (
                    <Button
                      key={ratio.name}
                      variant={selectedRatio === ratio.ratio ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRatioSelect(ratio.ratio)}
                      className="flex flex-col items-center gap-2 h-auto py-3"
                    >
                      <IconComponent className="h-5 w-5" />
                      <div className="text-center">
                        <div className="font-medium">{ratio.name}</div>
                        <div className="text-xs text-muted-foreground">{ratio.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Canvas */}
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="border border-gray-300 rounded cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>

            {/* Instructions */}
            <div className="text-sm text-gray-600 text-center">
              <p>Drag to move • Drag corners to resize • Select crop size for quick setup</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleCrop} className="flex items-center gap-2">
                <Crop className="h-4 w-4" />
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
