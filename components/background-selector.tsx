"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { backgrounds } from "@/lib/backgrounds"
import { Palette, ImageIcon, Upload } from "lucide-react"

interface BackgroundSelectorProps {
  selectedBackground: string
  onBackgroundSelect: (background: string) => void
}

export function BackgroundSelector({ selectedBackground, onBackgroundSelect }: BackgroundSelectorProps) {
  const [activeTab, setActiveTab] = useState<"gradients" | "solid" | "textures">("gradients")
  const [customColor, setCustomColor] = useState("#3b82f6")
  const [uploadedTextures, setUploadedTextures] = useState<Array<{ id: string; name: string; url: string }>>([])

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color)
    onBackgroundSelect(color)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= 5 * 1024 * 1024) {
      // 5MB limit
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        const newTexture = {
          id: `custom-${Date.now()}`,
          name: file.name.split(".")[0],
          url: imageUrl,
        }
        setUploadedTextures((prev) => [...prev, newTexture])
        // Select the newly uploaded texture immediately
        onBackgroundSelect(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-3 md:space-y-4 h-full flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg flex-shrink-0">
        <Button
          variant={activeTab === "gradients" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("gradients")}
          className="flex-1 text-xs md:text-sm"
        >
          <Palette className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          Gradients
        </Button>
        <Button
          variant={activeTab === "solid" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("solid")}
          className="flex-1 text-xs md:text-sm"
        >
          Solid
        </Button>
        <Button
          variant={activeTab === "textures" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("textures")}
          className="flex-1 text-xs md:text-sm"
        >
          <ImageIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          Textures
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "gradients" && (
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {backgrounds.gradients.map((bg) => (
              <button
                key={bg.id}
                onClick={() => onBackgroundSelect(bg.value)}
                className={`relative h-16 md:h-20 w-full rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                  selectedBackground === bg.value
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ background: bg.value }}
                title={bg.name}
              >
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                  {bg.name}
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === "solid" && (
          <div className="space-y-3 md:space-y-4">
            {/* Color Picker */}
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-12 md:w-16 h-8 md:h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 text-xs md:text-sm"
              />
            </div>

            {/* Preset Colors */}
            <div className="grid grid-cols-6 gap-1 md:gap-2">
              {backgrounds.solid.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => onBackgroundSelect(bg.value)}
                  className={`h-10 md:h-12 w-full rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedBackground === bg.value
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: bg.value }}
                  title={bg.name}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "textures" && (
          <div className="space-y-3 md:space-y-4">
            {/* Upload Custom Texture */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 md:p-4 text-center hover:border-gray-400 transition-colors">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="texture-upload" />
              <label htmlFor="texture-upload" className="cursor-pointer block">
                <Upload className="h-6 w-6 md:h-8 md:w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-xs md:text-sm text-gray-600">Upload your own texture</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
              </label>
            </div>

            {/* All Textures in One Grid */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {/* Uploaded Textures First */}
              {uploadedTextures.map((texture) => (
                <button
                  key={texture.id}
                  onClick={() => onBackgroundSelect(texture.url)}
                  className={`relative h-16 md:h-20 w-full rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    selectedBackground === texture.url
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  title={texture.name}
                >
                  <img
                    src={texture.url || "/placeholder.svg"}
                    alt={texture.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                    {texture.name}
                  </div>
                  <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1 rounded">Custom</div>
                </button>
              ))}

              {/* Preset Textures */}
              {backgrounds.textures.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => onBackgroundSelect(bg.value)}
                  className={`relative h-16 md:h-20 w-full rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                    selectedBackground === bg.value
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    background: bg.value,
                    backgroundImage: bg.pattern,
                    backgroundSize: "20px 20px",
                  }}
                  title={bg.name}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                    {bg.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
