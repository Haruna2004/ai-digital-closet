"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Eye, Trash2 } from "lucide-react"

interface TryOnResult {
  id: string
  generatedImage: string
  userPhoto: string
  shirt: string
  trouser: string
  timestamp: string
}

interface TryOnHistoryProps {
  tryOnResults: TryOnResult[]
  onDelete: (id: string) => void
}

export function TryOnHistory({ tryOnResults, onDelete }: TryOnHistoryProps) {
  const [selectedResult, setSelectedResult] = useState<TryOnResult | null>(null)

  const handleDownload = (result: TryOnResult) => {
    const link = document.createElement("a")
    link.href = result.generatedImage
    link.download = `try-on-${result.id}.png`
    link.click()
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (tryOnResults.length === 0) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Try-On History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No try-on results yet. Generate your first virtual try-on!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Try-On History ({tryOnResults.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tryOnResults.map((result) => (
              <div key={result.id} className="relative group">
                <Card className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={result.generatedImage || "/placeholder.svg"}
                      alt="Try-on result"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedResult(result)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(result)
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(result.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground text-center">{formatDate(result.timestamp)}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedResult && (
        <Dialog open={true} onOpenChange={() => setSelectedResult(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Try-On Result Details</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Original Items</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-2">
                    <img
                      src={selectedResult.userPhoto || "/placeholder.svg"}
                      alt="User photo"
                      className="w-full h-24 object-cover rounded"
                    />
                    <p className="text-xs text-center mt-1 text-muted-foreground">You</p>
                  </Card>
                  <Card className="p-2">
                    <img
                      src={selectedResult.shirt || "/placeholder.svg"}
                      alt="Shirt"
                      className="w-full h-24 object-cover rounded"
                    />
                    <p className="text-xs text-center mt-1 text-muted-foreground">Shirt</p>
                  </Card>
                  <Card className="p-2">
                    <img
                      src={selectedResult.trouser || "/placeholder.svg"}
                      alt="Trouser"
                      className="w-full h-24 object-cover rounded"
                    />
                    <p className="text-xs text-center mt-1 text-muted-foreground">Trouser</p>
                  </Card>
                </div>
                <p className="text-sm text-muted-foreground">Generated on {formatDate(selectedResult.timestamp)}</p>
              </div>

              {/* Generated Result */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Generated Result</h3>
                <Card className="aspect-[3/4] flex items-center justify-center">
                  <img
                    src={selectedResult.generatedImage || "/placeholder.svg"}
                    alt="Virtual try-on result"
                    className="w-full h-full object-contain rounded"
                  />
                </Card>
                <Button onClick={() => handleDownload(selectedResult)} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
