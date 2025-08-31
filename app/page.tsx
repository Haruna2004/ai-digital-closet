"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/image-upload"
import { ClothingGrid } from "@/components/clothing-grid"
import { VirtualTryOn } from "@/components/virtual-try-on"
import { Camera, Shirt, User } from "lucide-react"

interface ClothingItem {
  id: string
  type: "shirt" | "trouser"
  url: string
  processedUrl?: string
  name?: string
  color?: string
  brand?: string
}

interface UserPhoto {
  id: string
  url: string
  processedUrl?: string
}

export default function FashionClosetPage() {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([])
  const [userPhoto, setUserPhoto] = useState<UserPhoto | null>(null)
  const [selectedShirt, setSelectedShirt] = useState<ClothingItem | null>(null)
  const [selectedTrouser, setSelectedTrouser] = useState<ClothingItem | null>(null)
  const [showTryOn, setShowTryOn] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedClothing = localStorage.getItem("fashionCloset_clothing")
    const savedUserPhoto = localStorage.getItem("fashionCloset_userPhoto")

    if (savedClothing) {
      setClothingItems(JSON.parse(savedClothing))
    }
    if (savedUserPhoto) {
      setUserPhoto(JSON.parse(savedUserPhoto))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("fashionCloset_clothing", JSON.stringify(clothingItems))
  }, [clothingItems])

  useEffect(() => {
    if (userPhoto) {
      localStorage.setItem("fashionCloset_userPhoto", JSON.stringify(userPhoto))
    }
  }, [userPhoto])

  const handleClothingUpload = (url: string, type: "shirt" | "trouser") => {
    const newItem: ClothingItem = {
      id: Date.now().toString(),
      type,
      url,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${Date.now()}`,
    }
    setClothingItems((prev) => [...prev, newItem])
  }

  const handleUserPhotoUpload = (url: string) => {
    const newPhoto: UserPhoto = {
      id: Date.now().toString(),
      url,
    }
    setUserPhoto(newPhoto)
  }

  const handleDeleteItem = (id: string) => {
    setClothingItems((prev) => prev.filter((item) => item.id !== id))
    // Clear selection if deleted item was selected
    if (selectedShirt?.id === id) setSelectedShirt(null)
    if (selectedTrouser?.id === id) setSelectedTrouser(null)
  }

  const shirts = clothingItems.filter((item) => item.type === "shirt")
  const trousers = clothingItems.filter((item) => item.type === "trouser")

  const canTryOn = userPhoto && selectedShirt && selectedTrouser

  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-medium text-foreground mb-2 text-balance">Wears</h1>
          <p className="text-muted-foreground text-lg text-pretty">A virtual wardrobe to store your clothings and see how they blend with new ones using AI</p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Photo Upload */}
          <Card className="bg-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                Your Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onUpload={handleUserPhotoUpload}
                accept="image/*"
                placeholder="Upload your photo"
                currentImage={userPhoto?.url}
              />
            </CardContent>
          </Card>

          {/* Shirt Upload */}
          <Card className="bg-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                Shirts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onUpload={(url) => handleClothingUpload(url, "shirt")}
                accept="image/*"
                placeholder="Upload shirt"
              />
            </CardContent>
          </Card>

          {/* Trouser Upload */}
          <Card className="bg-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                Trousers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onUpload={(url) => handleClothingUpload(url, "trouser")}
                accept="image/*"
                placeholder="Upload trouser"
              />
            </CardContent>
          </Card>
        </div>

        {/* Clothing Grid */}
        <ClothingGrid
          items={clothingItems}
          selectedShirt={selectedShirt}
          selectedTrouser={selectedTrouser}
          onSelectShirt={setSelectedShirt}
          onSelectTrouser={setSelectedTrouser}
          onDeleteItem={handleDeleteItem}
        />

        {/* Virtual Try-On Button */}
        {canTryOn ? (
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowTryOn(true)}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
            >
              Try On Outfit
            </Button>
          </div>
        ): (<p className="text-center mt-8">Pick a shirt and trouser to Try on</p>)}

        {/* Virtual Try-On Modal */}
        {showTryOn && userPhoto && selectedShirt && selectedTrouser && (
          <VirtualTryOn
            userPhoto={userPhoto}
            shirt={selectedShirt}
            trouser={selectedTrouser}
            onClose={() => setShowTryOn(false)}
          />
        )}

      </div>
    </div>
  )
}
