"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Download, X } from "lucide-react"

interface ClothingItem {
  id: string
  type: "shirt" | "trouser"
  url: string
  processedUrl?: string
}

interface UserPhoto {
  id: string
  url: string
  processedUrl?: string
}

interface VirtualTryOnProps {
  userPhoto: UserPhoto
  shirt: ClothingItem
  trouser: ClothingItem
  onClose: () => void
}

export function VirtualTryOn({ userPhoto, shirt, trouser, onClose }: VirtualTryOnProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateTryOn = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-tryon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPhotoUrl: userPhoto.processedUrl || userPhoto.url,
          shirtUrl: shirt.processedUrl || shirt.url,
          trouserUrl: trouser.processedUrl || trouser.url,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate virtual try-on")
      }

      if (data.success && data.imageData) {
        setGeneratedImage(data.imageData)
      } else {
        throw new Error("No image data received")
      }
    } catch (err) {
      console.error("Virtual try-on error:", err)
      setError(err instanceof Error ? err.message : "Failed to generate virtual try-on. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a")
      link.href = generatedImage
      link.download = "virtual-try-on.png"
      link.click()
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Preview</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Selected Items</h3>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-2">
                <img
                  src={userPhoto.url || "/placeholder.svg"}
                  alt="Your photo"
                  className="w-full h-24 object-cover rounded"
                />
                <p className="text-xs text-center mt-1 text-muted-foreground">You</p>
              </Card>

              <Card className="p-2">
                <img
                  src={shirt.url || "/placeholder.svg"}
                  alt="Selected shirt"
                  className="w-full h-24 object-cover rounded"
                />
                <p className="text-xs text-center mt-1 text-muted-foreground">Shirt</p>
              </Card>

              <Card className="p-2">
                <img
                  src={trouser.url || "/placeholder.svg"}
                  alt="Selected trouser"
                  className="w-full h-24 object-cover rounded"
                />
                <p className="text-xs text-center mt-1 text-muted-foreground">Trouser</p>
              </Card>
            </div>

            {!generatedImage && (
              <Button
                onClick={handleGenerateTryOn}
                disabled={isGenerating}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            )}
          </div>

          {/* Generated Result */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Result</h3>

            <Card className="aspect-[3/4] flex items-center justify-center bg-muted/50">
              {isGenerating ? (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Wears is generating your look...</p>
                </div>
              ) : generatedImage ? (
                <img
                  src={generatedImage || "/placeholder.svg"}
                  alt="Virtual try-on result"
                  className="w-full h-full object-cover rounded"
                />
              ) : error ? (
                <div className="text-center text-destructive">
                  <X className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <p className="text-muted-foreground text-center">Click "Continue" to see the result</p>
              )}
            </Card>

            {generatedImage && (
              <Button onClick={handleDownload} variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
