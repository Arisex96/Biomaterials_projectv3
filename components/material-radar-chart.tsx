"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts"
import type { Material } from "@/utils/csv-parser"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Info } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MaterialRadarChartProps {
  materials: Material[]
}

export function MaterialRadarChart({ materials }: MaterialRadarChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [visibleMaterials, setVisibleMaterials] = useState<string[]>([])
  const [chartConfig, setChartConfig] = useState<Record<string, any>>({})
  const [isNormalized, setIsNormalized] = useState<boolean>(true)

  // Set all materials visible initially when materials change
  useEffect(() => {
    if (!materials.length) return
    setVisibleMaterials(materials.map((m) => m.id))

    // Create config for chart colors
    const config: Record<string, any> = {}
    const colors = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#ea580c"]

    materials.forEach((material, index) => {
      config[material.id] = {
        label: material.name,
        color: colors[index % colors.length],
      }
    })

    setChartConfig(config)
  }, [materials])

  // Prepare chart data when materials change or normalization setting changes
  useEffect(() => {
    if (!materials.length) return

    // Define properties to display
    const properties = [
      "tensileStrength",
      "yieldStrength",
      "elasticModulus",
      "density",
      "hardness",
      "fatigueStrength",
      "corrosionResistance",
    ]

    // Find max values for each property
    const maxValues = properties.reduce(
      (acc, prop) => {
        const values = materials.map((m) => m[prop as keyof Material] as number)
        acc[prop] = Math.max(...values)
        return acc
      },
      {} as Record<string, number>,
    )

    // Create data for radar chart
    const data = properties.map((prop) => {
      const dataPoint: Record<string, any> = {
        property: formatPropertyName(prop),
        fullName: formatFullPropertyName(prop),
        unit: getPropertyUnit(prop),
        maxValue: maxValues[prop],
      }

      materials.forEach((material) => {
        const value = material[prop as keyof Material] as number

        // Store both raw and normalized values
        dataPoint[`${material.id}_raw`] = value

        // Normalize value to 0-100 scale for better visualization
        if (isNormalized) {
          dataPoint[material.id] = maxValues[prop] > 0 ? (value / maxValues[prop]) * 100 : 0
        } else {
          dataPoint[material.id] = value
        }
      })

      return dataPoint
    })

    setChartData(data)
  }, [materials, isNormalized])

  const formatPropertyName = (prop: string): string => {
    return prop
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/Strength/g, "Str.")
      .replace(/Resistance/g, "Res.")
      .replace(/Modulus/g, "Mod.")
  }

  const formatFullPropertyName = (prop: string): string => {
    return prop.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  }

  const getPropertyUnit = (prop: string): string => {
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

  const toggleMaterialVisibility = (materialId: string) => {
    setVisibleMaterials((prev) =>
      prev.includes(materialId) ? prev.filter((id) => id !== materialId) : [...prev, materialId],
    )
  }

  const toggleNormalization = () => {
    setIsNormalized((prev) => !prev)
  }

  // Custom tooltip component to show actual values with units
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-1">
            {payload.map((entry: any, index: number) => {
              // Extract material ID from the dataKey
              const materialId = entry.dataKey
              // Find the raw value using the material ID
              const rawValue = payload[0].payload[`${materialId}_raw`]
              const unit = payload[0].payload.unit

              return (
                <p key={`value-${index}`} style={{ color: entry.color }}>
                  {entry.name}: {rawValue.toFixed(2)} {unit}
                  {isNormalized && ` (${entry.value.toFixed(0)}%)`}
                </p>
              )
            })}
          </div>
        </div>
      )
    }
    return null
  }

  if (materials.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Material Properties Comparison</CardTitle>
          <CardDescription>Please select at least 2 materials to compare</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Material Properties Comparison</CardTitle>
            <CardDescription>
              {isNormalized
                ? "Normalized property values (0-100%) for better comparison"
                : "Actual property values of selected materials"}
            </CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={toggleNormalization}>
                  {isNormalized ? "Show Actual Values" : "Show Normalized Values"}
                  <Info className="ml-1 h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isNormalized
                    ? "Values are normalized to 0-100% scale for better visualization. Hover over points to see actual values."
                    : "Showing actual values. Some properties may appear very small due to scale differences."}
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {materials.map((material) => {
            const isVisible = visibleMaterials.includes(material.id)
            const color = chartConfig[material.id]?.color || "#888"

            return (
              <Button
                key={material.id}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => toggleMaterialVisibility(material.id)}
              >
                {isVisible ? (
                  <CheckCircle className="h-4 w-4" style={{ color }} />
                ) : (
                  <Circle className="h-4 w-4" style={{ color }} />
                )}
                <span style={{ opacity: isVisible ? 1 : 0.5 }}>{material.name}</span>
              </Button>
            )
          })}
        </div>
        {materials.length > 8 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
            <p>
              Displaying many materials at once may reduce chart clarity. Consider selecting fewer materials for better
              visualization.
            </p>
          </div>
        )}

        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 20, right: 50, left: 50, bottom: 20 }}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis
                dataKey="property"
                tick={{
                  fill: "hsl(var(--foreground))",
                  fontSize: 12,
                }}
                tickFormatter={(value, index) => {
                  // Add unit to the property name
                  const unit = chartData[index]?.unit
                  return unit ? `${value} (${unit})` : value
                }}
              />
              <Tooltip content={<CustomTooltip />} />

              {materials.map(
                (material) =>
                  visibleMaterials.includes(material.id) && (
                    <Radar
                      key={material.id}
                      name={material.name}
                      dataKey={material.id}
                      stroke={chartConfig[material.id]?.color}
                      fill={chartConfig[material.id]?.color}
                      fillOpacity={0.2}
                    />
                  ),
              )}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
