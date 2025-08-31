"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shirt, User, Palette, TrendingUp } from "lucide-react"

interface ClothingItem {
  id: string
  type: "shirt" | "trouser"
  url: string
  processedUrl?: string
  name?: string
  color?: string
  brand?: string
}

interface ClosetStatsProps {
  items: ClothingItem[]
  selectedShirt: ClothingItem | null
  selectedTrouser: ClothingItem | null
}

export function ClosetStats({ items, selectedShirt, selectedTrouser }: ClosetStatsProps) {
  const shirts = items.filter((item) => item.type === "shirt")
  const trousers = items.filter((item) => item.type === "trouser")

  const colors = [...new Set(items.map((item) => item.color).filter(Boolean))]
  const brands = [...new Set(items.map((item) => item.brand).filter(Boolean))]

  const stats = [
    {
      title: "Total Items",
      value: items.length,
      icon: User,
      description: `${shirts.length} shirts, ${trousers.length} trousers`,
    },
    {
      title: "Colors",
      value: colors.length,
      icon: Palette,
      description: colors.slice(0, 3).join(", ") + (colors.length > 3 ? "..." : ""),
    },
    {
      title: "Brands",
      value: brands.length,
      icon: TrendingUp,
      description: brands.slice(0, 2).join(", ") + (brands.length > 2 ? "..." : ""),
    },
    {
      title: "Outfit Ready",
      value: selectedShirt && selectedTrouser ? "Yes" : "No",
      icon: Shirt,
      description: selectedShirt && selectedTrouser ? "Ready for try-on" : "Select shirt & trouser",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1 truncate">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
