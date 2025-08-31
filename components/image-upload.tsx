"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onUpload: (url: string) => void
  accept?: string
  placeholder?: string
  currentImage?: string
  className?: string
}

export function ImageUpload({
  onUpload,
  accept = "image/*",
  placeholder = "Upload image",
  currentImage,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    setIsUploading(true)

    try {
      // For now, we'll use a simple file reader to convert to base64
      // In production, you'd upload to UploadThing here
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onUpload(result)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Upload failed:", error)
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("w-full", className)}>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleInputChange} className="hidden" />

      {currentImage ? (
        <Card className="relative group">
          <img
            src={currentImage || "/placeholder.svg"}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Button variant="secondary" size="sm" onClick={handleClick} disabled={isUploading}>
              Change Image
            </Button>
          </div>
        </Card>
      ) : (
        <Card
          className={cn(
            "border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer",
            dragActive && "border-primary bg-primary/5",
            "h-48 flex flex-col items-center justify-center gap-2",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">{isUploading ? "Uploading..." : placeholder}</p>
          <p className="text-xs text-muted-foreground">Click or drag to upload</p>
        </Card>
      )}
    </div>
  )
}
