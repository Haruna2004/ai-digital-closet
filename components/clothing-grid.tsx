"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClothingItem {
  id: string
  type: "shirt" | "trouser"
  url: string
  processedUrl?: string
  name?: string
  color?: string
  brand?: string
}

interface ClothingGridProps {
  items: ClothingItem[]
  selectedShirt: ClothingItem | null
  selectedTrouser: ClothingItem | null
  onSelectShirt: (item: ClothingItem) => void
  onSelectTrouser: (item: ClothingItem) => void
  onDeleteItem?: (id: string) => void
}

export function ClothingGrid({
  items,
  selectedShirt,
  selectedTrouser,
  onSelectShirt,
  onSelectTrouser,
  onDeleteItem,
}: ClothingGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "shirt" | "trouser">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || item.type === filterType

    return matchesSearch && matchesFilter
  })

  const shirts = filteredItems.filter((item) => item.type === "shirt")
  const trousers = filteredItems.filter((item) => item.type === "trouser")

  const handleItemClick = (item: ClothingItem) => {
    if (item.type === "shirt") {
      onSelectShirt(item)
    } else {
      onSelectTrouser(item)
    }
  }

  const isSelected = (item: ClothingItem) => {
    return item.type === "shirt" ? selectedShirt?.id === item.id : selectedTrouser?.id === item.id
  }

  const handleDelete = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation()
    if (onDeleteItem) {
      onDeleteItem(itemId)
    }
  }

  if (items.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No clothing items uploaded yet. Start by uploading some shirts and trousers!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, color, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: "all" | "shirt" | "trouser") => setFilterType(value)}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="shirt">Shirts</SelectItem>
              <SelectItem value="trouser">Trousers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredItems.length} of {items.length} items
          </Badge>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No items match your search criteria. Try adjusting your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Shirts Section */}
          {shirts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-semibold">Shirts</h2>
                <Badge variant="secondary">{shirts.length}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {shirts.map((item) => (
                  <Card
                    key={item.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md group relative",
                      isSelected(item) && "ring-2 ring-primary bg-primary/5",
                    )}
                    onClick={() => handleItemClick(item)}
                  >
                    <CardContent className="p-2">
                      <div className="relative">
                        <img
                          src={item.processedUrl || item.url}
                          alt="Shirt"
                          className="w-full h-32 object-cover rounded"
                        />
                        {onDeleteItem && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                            onClick={(e) => handleDelete(e, item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      {(item.name || item.color || item.brand) && (
                        <div className="mt-2 space-y-1">
                          {item.name && <p className="text-xs font-medium truncate">{item.name}</p>}
                          <div className="flex gap-1 text-xs text-muted-foreground">
                            {item.color && <span>{item.color}</span>}
                            {item.brand && item.color && <span>•</span>}
                            {item.brand && <span>{item.brand}</span>}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Trousers Section */}
          {trousers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-semibold">Trousers</h2>
                <Badge variant="secondary">{trousers.length}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {trousers.map((item) => (
                  <Card
                    key={item.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md group relative",
                      isSelected(item) && "ring-2 ring-primary bg-primary/5",
                    )}
                    onClick={() => handleItemClick(item)}
                  >
                    <CardContent className="p-2">
                      <div className="relative">
                        <img
                          src={item.processedUrl || item.url}
                          alt="Trouser"
                          className="w-full h-32 object-cover rounded"
                        />
                        {onDeleteItem && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                            onClick={(e) => handleDelete(e, item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      {(item.name || item.color || item.brand) && (
                        <div className="mt-2 space-y-1">
                          {item.name && <p className="text-xs font-medium truncate">{item.name}</p>}
                          <div className="flex gap-1 text-xs text-muted-foreground">
                            {item.color && <span>{item.color}</span>}
                            {item.brand && item.color && <span>•</span>}
                            {item.brand && <span>{item.brand}</span>}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
