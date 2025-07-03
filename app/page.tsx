"use client"

import { useState, useCallback } from "react"
import { ImageUpload } from "@/components/image-upload"
import { BackgroundSelector } from "@/components/background-selector"
import { ImageControls } from "@/components/image-controls"
import { ImagePreview } from "@/components/image-preview"
import { Card } from "@/components/ui/card"
import { backgrounds } from "@/lib/backgrounds"
import { CropModal } from "@/components/crop-modal"

export interface ImageSettings {
  padding: number
  borderRadius: number
  background: string
  rotation: number
  scale: number
  shadow: number
  shadowBlur: number
  backgroundPadding: number
  backgroundRatio: string
}

export default function ImageEditor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedBackground, setSelectedBackground] = useState<string>(backgrounds.gradients[0].value)
  const [settings, setSettings] = useState<ImageSettings>({
    padding: 20,
    borderRadius: 8,
    background: backgrounds.gradients[0].value,
    rotation: 0,
    scale: 1,
    shadow: 10,
    shadowBlur: 15,
    backgroundPadding: 40,
    backgroundRatio: "free",
  })

  const [showCropModal, setShowCropModal] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)

  const handleImageUpload = useCallback((imageUrl: string) => {
    setOriginalImage(imageUrl)
    setShowCropModal(true)
  }, [])

  const handleCropComplete = useCallback((croppedImageUrl: string) => {
    setUploadedImage(croppedImageUrl)
    setShowCropModal(false)
  }, [])

  const handleCropCancel = useCallback(() => {
    setShowCropModal(false)
    setOriginalImage(null)
  }, [])

  const handleBackgroundSelect = useCallback((background: string) => {
    setSelectedBackground(background)
    setSettings((prev) => ({ ...prev, background }))
  }, [])

  const handleSettingsChange = useCallback((newSettings: Partial<ImageSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }, [])

  return (
    <div className="h-screen bg-gray-50 p-2 md:p-4">
      <div className="h-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-4 h-full">
          {/* Left Panel - Upload & Backgrounds */}
          <div className="lg:col-span-3 space-y-2 md:space-y-4 overflow-y-auto">
            <Card className="p-3 md:p-4">
              <h2 className="text-base md:text-lg font-semibold mb-3">Upload Image</h2>
              <ImageUpload onImageUpload={handleImageUpload} />
            </Card>

            <Card className="p-3 md:p-4 flex-1 overflow-hidden">
              <h2 className="text-base md:text-lg font-semibold mb-3">Background</h2>
              <BackgroundSelector selectedBackground={selectedBackground} onBackgroundSelect={handleBackgroundSelect} />
            </Card>
          </div>

          {/* Center Panel - Preview */}
          <div className="lg:col-span-6 order-first lg:order-none">
            <Card className="p-3 md:p-4 h-full flex flex-col">
              <h2 className="text-base md:text-lg font-semibold mb-3 flex-shrink-0">Preview</h2>
              <div className="flex-1 min-h-0">
                <ImagePreview image={uploadedImage} settings={settings} />
              </div>
            </Card>
          </div>

          {/* Right Panel - Controls */}
          <div className="lg:col-span-3 overflow-y-auto">
            <Card className="p-3 md:p-4 h-full">
              <h2 className="text-base md:text-lg font-semibold mb-3">Controls</h2>
              <ImageControls settings={settings} onSettingsChange={handleSettingsChange} hasImage={!!uploadedImage} />
            </Card>
          </div>
        </div>
      </div>

      {showCropModal && originalImage && (
        <CropModal image={originalImage} onCropComplete={handleCropComplete} onCancel={handleCropCancel} />
      )}
    </div>
  )
}
