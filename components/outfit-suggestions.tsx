"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Heart, Clock } from "lucide-react"

interface ClothingItem {
  id: string
  type: "shirt" | "trouser"
  url: string
  processedUrl?: string
  name?: string
  color?: string
  brand?: string
}

interface OutfitCombination {
  id: string
  shirt: ClothingItem
  trouser: ClothingItem
  name: string
  isFavorite: boolean
  lastWorn?: string
  createdAt: string
}

interface OutfitSuggestionsProps {
  shirts: ClothingItem[]
  trousers: ClothingItem[]
  onSelectOutfit: (shirt: ClothingItem, trouser: ClothingItem) => void
  selectedShirt: ClothingItem | null
  selectedTrouser: ClothingItem | null
}

export function OutfitSuggestions({
  shirts,
  trousers,
  onSelectOutfit,
  selectedShirt,
  selectedTrouser,
}: OutfitSuggestionsProps) {
  const [savedOutfits, setSavedOutfits] = useState<OutfitCombination[]>([])
  const [suggestions, setSuggestions] = useState<OutfitCombination[]>([])

  // Load saved outfits from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fashionCloset_savedOutfits")
    if (saved) {
      setSavedOutfits(JSON.parse(saved))
    }
  }, [])

  // Save outfits to localStorage
  useEffect(() => {
    localStorage.setItem("fashionCloset_savedOutfits", JSON.stringify(savedOutfits))
  }, [savedOutfits])

  // Generate outfit suggestions
  useEffect(() => {
    if (shirts.length > 0 && trousers.length > 0) {
      const newSuggestions: OutfitCombination[] = []

      // Create smart combinations (limit to 6 suggestions)
      for (let i = 0; i < Math.min(shirts.length, 3); i++) {
        for (let j = 0; j < Math.min(trousers.length, 2); j++) {
          const shirt = shirts[i]
          const trouser = trousers[j]

          newSuggestions.push({
            id: `${shirt.id}-${trouser.id}`,
            shirt,
            trouser,
            name: `${shirt.name || "Shirt"} + ${trouser.name || "Trouser"}`,
            isFavorite: false,
            createdAt: new Date().toISOString(),
          })
        }
      }

      setSuggestions(newSuggestions.slice(0, 6))
    }
  }, [shirts, trousers])

  const saveCurrentOutfit = () => {
    if (selectedShirt && selectedTrouser) {
      const newOutfit: OutfitCombination = {
        id: `${selectedShirt.id}-${selectedTrouser.id}-${Date.now()}`,
        shirt: selectedShirt,
        trouser: selectedTrouser,
        name: `${selectedShirt.name || "Shirt"} + ${selectedTrouser.name || "Trouser"}`,
        isFavorite: false,
        createdAt: new Date().toISOString(),
      }

      setSavedOutfits((prev) => [newOutfit, ...prev])
    }
  }

  const toggleFavorite = (outfitId: string) => {
    setSavedOutfits((prev) =>
      prev.map((outfit) => (outfit.id === outfitId ? { ...outfit, isFavorite: !outfit.isFavorite } : outfit)),
    )
  }

  const deleteOutfit = (outfitId: string) => {
    setSavedOutfits((prev) => prev.filter((outfit) => outfit.id !== outfitId))
  }

  if (shirts.length === 0 || trousers.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Current Selection & Save */}
      {selectedShirt && selectedTrouser && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Current Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-2">
                <img
                  src={selectedShirt.url || "/placeholder.svg"}
                  alt="Selected shirt"
                  className="w-12 h-12 object-cover rounded"
                />
                <img
                  src={selectedTrouser.url || "/placeholder.svg"}
                  alt="Selected trouser"
                  className="w-12 h-12 object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {selectedShirt.name} + {selectedTrouser.name}
                </p>
              </div>
            </div>
            <Button onClick={saveCurrentOutfit} variant="outline" size="sm">
              Save This Outfit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Outfit Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Outfit Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((suggestion) => (
              <Card
                key={suggestion.id}
                className="cursor-pointer hover:shadow-md transition-shadow bg-muted/30"
                onClick={() => onSelectOutfit(suggestion.shirt, suggestion.trouser)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-2 mb-3">
                    <img
                      src={suggestion.shirt.url || "/placeholder.svg"}
                      alt="Shirt"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <img
                      src={suggestion.trouser.url || "/placeholder.svg"}
                      alt="Trouser"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                  <p className="text-sm font-medium text-center">
                    {suggestion.shirt.name} + {suggestion.trouser.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Outfits */}
      {savedOutfits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Saved Outfits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedOutfits.slice(0, 5).map((outfit) => (
                <div
                  key={outfit.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onSelectOutfit(outfit.shirt, outfit.trouser)}
                >
                  <div className="flex gap-2">
                    <img
                      src={outfit.shirt.url || "/placeholder.svg"}
                      alt="Shirt"
                      className="w-10 h-10 object-cover rounded"
                    />
                    <img
                      src={outfit.trouser.url || "/placeholder.svg"}
                      alt="Trouser"
                      className="w-10 h-10 object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{outfit.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Saved {new Date(outfit.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {outfit.isFavorite && (
                      <Badge variant="secondary" className="text-xs">
                        <Heart className="w-3 h-3 mr-1 fill-current" />
                        Favorite
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(outfit.id)
                      }}
                    >
                      <Heart className={`w-4 h-4 ${outfit.isFavorite ? "fill-current text-red-500" : ""}`} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
