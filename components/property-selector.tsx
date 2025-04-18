"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { Material } from "@/utils/csv-parser"

interface PropertyRange {
  min: number
  max: number
  current: [number, number]
  unit: string
}

interface PropertySelectorProps {
  materials: Material[]
  onMatchingMaterialsChange: (materials: Material[]) => void
}

export function PropertySelector({ materials, onMatchingMaterialsChange }: PropertySelectorProps) {
  const [propertyRanges, setPropertyRanges] = useState<Record<string, PropertyRange>>({})
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)

  // Initialize property ranges
  useEffect(() => {
    if (!materials.length || initialized) return

    const properties = [
      "tensileStrength",
      "yieldStrength",
      "elasticModulus",
      "density",
      "hardness",
      "fatigueStrength",
      "corrosionResistance",
    ]

    const ranges: Record<string, PropertyRange> = {}

    properties.forEach((prop) => {
      const values = materials.map((m) => m[prop as keyof Material] as number)
      const min = Math.min(...values)
      const max = Math.max(...values)

      ranges[prop] = {
        min,
        max,
        current: [min, max],
        unit: getPropertyUnit(prop),
      }
    })

    setPropertyRanges(ranges)
    setInitialized(true)
  }, [materials, initialized])

  // Find matching materials when filters or ranges change
  useEffect(() => {
    if (!activeFilters.length || !materials.length) {
      onMatchingMaterialsChange([])
      return
    }

    const filtered = materials.filter((material) => {
      return activeFilters.every((property) => {
        const range = propertyRanges[property]
        if (!range) return true
        const value = material[property as keyof Material] as number
        return value >= range.current[0] && value <= range.current[1]
      })
    })

    onMatchingMaterialsChange(filtered)
  }, [activeFilters, propertyRanges, materials, onMatchingMaterialsChange])

  const handleRangeChange = (property: string, values: [number, number]) => {
    setPropertyRanges((prev) => ({
      ...prev,
      [property]: {
        ...prev[property],
        current: values,
      },
    }))
  }

  const toggleFilter = (property: string) => {
    setActiveFilters((prev) => (prev.includes(property) ? prev.filter((p) => p !== property) : [...prev, property]))
  }

  function getPropertyUnit(prop: string): string {
    switch (prop) {
      case "tensileStrength":
      case "yieldStrength":
      case "fatigueStrength":
        return "MPa"
      case "elasticModulus":
        return "GPa"
      case "density":
        return "g/cm³"
      case "hardness":
        return "HV"
      case "corrosionResistance":
        return "1-10"
      default:
        return ""
    }
  }

  const formatPropertyName = (prop: string): string => {
    return prop.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  }

  if (!initialized || Object.keys(propertyRanges).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Find Materials by Properties</CardTitle>
          <CardDescription>Loading property ranges...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Calculate matching materials for display
  const matchingMaterials = materials.filter((material) => {
    if (!activeFilters.length) return false

    return activeFilters.every((property) => {
      const range = propertyRanges[property]
      if (!range) return true
      const value = material[property as keyof Material] as number
      return value >= range.current[0] && value <= range.current[1]
    })
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Materials by Properties</CardTitle>
        <CardDescription>Select property ranges to find matching materials</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {Object.entries(propertyRanges).map(([property, range]) => (
            <div key={property} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={property} className="text-sm font-medium">
                  {formatPropertyName(property)} ({range.unit})
                </Label>
                <Button
                  variant={activeFilters.includes(property) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFilter(property)}
                >
                  {activeFilters.includes(property) ? "Active" : "Inactive"}
                </Button>
              </div>
              <div className="pt-2 px-1">
                <Slider
                  id={property}
                  min={range.min}
                  max={range.max}
                  step={(range.max - range.min) / 100}
                  value={range.current}
                  onValueChange={(values) => handleRangeChange(property, values as [number, number])}
                  disabled={!activeFilters.includes(property)}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {range.current[0].toFixed(1)} {range.unit}
                </span>
                <span>
                  {range.current[1].toFixed(1)} {range.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-medium mb-2">Matching Materials: {matchingMaterials.length}</h4>
          {matchingMaterials.length > 8 && (
            <div className="mb-2 text-amber-600 text-sm">
              <p>Many materials match your criteria. Consider refining your filters for more specific results.</p>
            </div>
          )}
          {matchingMaterials.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchingMaterials.slice(0, 20).map((material) => (
                <Badge key={material.id} variant="secondary">
                  {material.name} ({material.type})
                </Badge>
              ))}
              {matchingMaterials.length > 20 && <Badge variant="outline">+{matchingMaterials.length - 20} more</Badge>}
            </div>
          ) : activeFilters.length > 0 ? (
            <p className="text-sm text-muted-foreground">No materials match the selected criteria</p>
          ) : (
            <p className="text-sm text-muted-foreground">Activate at least one property filter</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
