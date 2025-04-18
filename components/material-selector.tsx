"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type Material, parseMaterialsCSV } from "@/utils/csv-parser"
import { Search } from "lucide-react"

interface MaterialSelectorProps {
  onSelectionChange: (materials: Material[]) => void
  csvData: string
  onAllMaterialsLoaded?: (materials: Material[]) => void
}

export function MaterialSelector({ onSelectionChange, csvData, onAllMaterialsLoaded }: MaterialSelectorProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load materials only once
  useEffect(() => {
    if (isInitialized) return

    const loadMaterials = async () => {
      try {
        const parsedMaterials = await parseMaterialsCSV(csvData)
        setMaterials(parsedMaterials)
        setFilteredMaterials(parsedMaterials)

        if (onAllMaterialsLoaded) {
          onAllMaterialsLoaded(parsedMaterials)
        }

        setIsInitialized(true)
      } catch (error) {
        console.error("Error parsing materials:", error)
      }
    }

    loadMaterials()
  }, [csvData, onAllMaterialsLoaded, isInitialized])

  // Handle search input changes
  const handleSearch = (term: string) => {
    setSearchTerm(term)

    if (!term.trim()) {
      setFilteredMaterials(materials)
      return
    }

    const filtered = materials.filter(
      (material) =>
        material.name.toLowerCase().includes(term.toLowerCase()) ||
        material.type.toLowerCase().includes(term.toLowerCase()),
    )

    setFilteredMaterials(filtered)
  }

  // Toggle material selection
  const toggleMaterialSelection = (material: Material) => {
    setSelectedMaterials((prev) => {
      // If already selected, remove it
      if (prev.some((m) => m.id === material.id)) {
        const updated = prev.filter((m) => m.id !== material.id)
        onSelectionChange(updated)
        return updated
      }

      // If not selected and less than 5 are selected, add it
      if (prev.length < 5) {
        const updated = [...prev, material]
        onSelectionChange(updated)
        return updated
      }

      // Otherwise, don't change the selection
      return prev
    })
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search materials (e.g., 'Steel', 'Ti')"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="border rounded-md">
        <div className="p-2 bg-muted font-medium">
          Select 2-5 materials to compare
          {selectedMaterials.length > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">({selectedMaterials.length}/5 selected)</span>
          )}
        </div>

        <ScrollArea className="h-60">
          <div className="p-4 space-y-2">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => (
                <div key={material.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={material.id}
                    checked={selectedMaterials.some((m) => m.id === material.id)}
                    onCheckedChange={() => toggleMaterialSelection(material)}
                    disabled={selectedMaterials.length >= 5 && !selectedMaterials.some((m) => m.id === material.id)}
                  />
                  <Label htmlFor={material.id} className="flex-1 cursor-pointer">
                    <span className="font-medium">{material.name}</span>
                    <span className="ml-2 text-sm text-muted-foreground">({material.type})</span>
                  </Label>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">No materials found matching "{searchTerm}"</div>
            )}
          </div>
        </ScrollArea>
      </div>

      {selectedMaterials.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center"
            >
              {material.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1 rounded-full"
                onClick={() => toggleMaterialSelection(material)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
