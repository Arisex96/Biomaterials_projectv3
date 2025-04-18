"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Material } from "@/utils/csv-parser"

interface PropertyComparisonProps {
  materials: Material[]
}

export function PropertyComparison({ materials }: PropertyComparisonProps) {
  const [selectedProperty, setSelectedProperty] = useState<string>("tensileStrength")

  const properties = [
    { value: "tensileStrength", label: "Tensile Strength (MPa)" },
    { value: "yieldStrength", label: "Yield Strength (MPa)" },
    { value: "elasticModulus", label: "Elastic Modulus (GPa)" },
    { value: "density", label: "Density (g/cm³)" },
    { value: "hardness", label: "Hardness (HV)" },
    { value: "fatigueStrength", label: "Fatigue Strength (MPa)" },
    { value: "corrosionResistance", label: "Corrosion Resistance (1-10)" },
  ]

  const getPropertyUnit = (prop: string): string => {
    const property = properties.find((p) => p.value === prop)
    if (!property) return ""
    const match = property.label.match(/$$(.*?)$$/)
    return match ? match[1] : ""
  }

  // Prepare chart data
  const chartData = materials
    .map((material) => ({
      name: material.name,
      value: material[selectedProperty as keyof Material] as number,
      color: material.id,
    }))
    .sort((a, b) => b.value - a.value)

  // Create color map for materials
  const colors = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#ea580c"]
  const colorMap = materials.reduce(
    (acc, material, index) => {
      acc[material.id] = colors[index % colors.length]
      return acc
    },
    {} as Record<string, string>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Comparison</CardTitle>
        <CardDescription>Compare a specific property across materials</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger>
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.value} value={property.value}>
                  {property.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                label={{
                  value: getPropertyUnit(selectedProperty),
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Bar dataKey="value" fill="#8884d8" barSize={30}>
                {chartData.map((entry, index) => (
                  <Bar key={`bar-${index}`} dataKey="value" fill={colorMap[entry.color] || "#8884d8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
