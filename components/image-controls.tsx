"use client"

import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Download, RotateCcw } from "lucide-react"
import type { ImageSettings } from "@/app/page"

interface ImageControlsProps {
  settings: ImageSettings
  onSettingsChange: (settings: Partial<ImageSettings>) => void
  hasImage: boolean
}

export function ImageControls({ settings, onSettingsChange, hasImage }: ImageControlsProps) {
  const handleDownload = async () => {
    const canvas = document.getElementById("image-preview-canvas") as HTMLCanvasElement
    if (!canvas) return

    try {
      // EXPORT AT MAXIMUM QUALITY
      const link = document.createElement("a")
      link.download = `edited-image-${Date.now()}.png`

      // Export at highest quality (1.0 = maximum quality)
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
    } catch (error) {
      console.error("Failed to download image:", error)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6 h-full flex flex-col">
      <div className="space-y-3 md:space-y-4 flex-1 overflow-y-auto">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Background Padding: {settings.backgroundPadding}px
          </label>
          <Slider
            value={[settings.backgroundPadding]}
            onValueChange={(value) => onSettingsChange({ backgroundPadding: value[0] })}
            max={100}
            min={10}
            step={5}
            className="w-full"
            disabled={!hasImage}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">Background Ratio</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: "Free", value: "free", aspect: "flex" },
              { name: "1:1", value: "1:1", aspect: "1:1" },
              { name: "4:3", value: "4:3", aspect: "4:3" },
              { name: "3:4", value: "3:4", aspect: "3:4" },
              { name: "16:9", value: "16:9", aspect: "16:9" },
              { name: "9:16", value: "9:16", aspect: "9:16" },
            ].map((ratio) => (
              <Button
                key={ratio.value}
                variant={settings.backgroundRatio === ratio.value ? "default" : "outline"}
                size="sm"
                onClick={() => onSettingsChange({ backgroundRatio: ratio.value })}
                disabled={!hasImage}
                className="flex flex-col items-center gap-1 h-auto py-2 text-xs"
              >
                <div
                  className={`border rounded ${
                    settings.backgroundRatio === ratio.value
                      ? "border-white bg-white/20"
                      : "border-gray-400 bg-gray-100"
                  }`}
                  style={{
                    width:
                      ratio.value === "free"
                        ? "16px"
                        : ratio.value === "1:1"
                          ? "16px"
                          : ratio.value === "4:3"
                            ? "20px"
                            : ratio.value === "3:4"
                              ? "12px"
                              : ratio.value === "16:9"
                                ? "24px"
                                : "10px",
                    height:
                      ratio.value === "free"
                        ? "16px"
                        : ratio.value === "1:1"
                          ? "16px"
                          : ratio.value === "4:3"
                            ? "15px"
                            : ratio.value === "3:4"
                              ? "16px"
                              : ratio.value === "16:9"
                                ? "13px"
                                : "18px",
                  }}
                />
                <span>{ratio.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Image Padding: {settings.padding}px</label>
          <Slider
            value={[settings.padding]}
            onValueChange={(value) => onSettingsChange({ padding: value[0] })}
            max={100}
            min={0}
            step={1}
            className="w-full"
            disabled={!hasImage}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Border Radius: {settings.borderRadius}px
          </label>
          <Slider
            value={[settings.borderRadius]}
            onValueChange={(value) => onSettingsChange({ borderRadius: value[0] })}
            max={50}
            min={0}
            step={1}
            className="w-full"
            disabled={!hasImage}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Shadow: {settings.shadow}px</label>
          <Slider
            value={[settings.shadow]}
            onValueChange={(value) => onSettingsChange({ shadow: value[0] })}
            max={50}
            min={0}
            step={1}
            className="w-full"
            disabled={!hasImage}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Shadow Blur: {settings.shadowBlur}px</label>
          <Slider
            value={[settings.shadowBlur]}
            onValueChange={(value) => onSettingsChange({ shadowBlur: value[0] })}
            max={50}
            min={0}
            step={1}
            className="w-full"
            disabled={!hasImage}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Rotation: {settings.rotation}°</label>
          <Slider
            value={[settings.rotation]}
            onValueChange={(value) => onSettingsChange({ rotation: value[0] })}
            max={360}
            min={0}
            step={1}
            className="w-full"
            disabled={!hasImage}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Scale: {Math.round(settings.scale * 100)}%
          </label>
          <Slider
            value={[settings.scale]}
            onValueChange={(value) => onSettingsChange({ scale: value[0] })}
            max={3}
            min={0.1}
            step={0.1}
            className="w-full"
            disabled={!hasImage}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onSettingsChange({
                rotation: 0,
                scale: 1,
                shadow: 0,
                shadowBlur: 0,
                padding: 0,
                borderRadius: 0,
                backgroundPadding: 40,
                backgroundRatio: "free",
              })
            }
            disabled={!hasImage}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSettingsChange({ rotation: (settings.rotation + 90) % 360 })}
            disabled={!hasImage}
            className="flex-1"
          >
            Rotate 90°
          </Button>
        </div>
      </div>

      <div className="flex-shrink-0 pt-2 border-t">
        <Button onClick={handleDownload} disabled={!hasImage} className="w-full" size="lg">
          <Download className="h-4 w-4 mr-2" />
          Download High Quality
        </Button>

        {!hasImage && <p className="text-xs text-gray-500 text-center mt-2">Upload an image to enable controls</p>}
      </div>
    </div>
  )
}
