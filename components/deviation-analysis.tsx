"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Material } from "@/utils/csv-parser"

interface DeviationAnalysisProps {
  materials: Material[]
}

export function DeviationAnalysis({ materials }: DeviationAnalysisProps) {
  const [selectedProperty, setSelectedProperty] = useState<string>("tensileStrength")
  const [chartData, setChartData] = useState<any[]>([])
  const [averageValue, setAverageValue] = useState<number>(0)

  const properties = [
    { value: "tensileStrength", label: "Tensile Strength (MPa)" },
    { value: "yieldStrength", label: "Yield Strength (MPa)" },
    { value: "elasticModulus", label: "Elastic Modulus (GPa)" },
    { value: "density", label: "Density (g/cm³)" },
    { value: "hardness", label: "Hardness (HV)" },
    { value: "fatigueStrength", label: "Fatigue Strength (MPa)" },
    { value: "corrosionResistance", label: "Corrosion Resistance (1-10)" },
  ]

  // Update chart data when materials or selected property changes
  useEffect(() => {
    if (!materials.length) return

    // Calculate average value for the selected property
    const values = materials.map((m) => m[selectedProperty as keyof Material] as number)
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length
    setAverageValue(avg)

    // Calculate deviation from average for each material
    const data = materials
      .map((material) => {
        const value = material[selectedProperty as keyof Material] as number
        const deviation = ((value - avg) / avg) * 100 // Percentage deviation

        return {
          name: material.name,
          value: value,
          deviation: Number.parseFloat(deviation.toFixed(2)),
        }
      })
      .sort((a, b) => b.deviation - a.deviation)

    setChartData(data)
  }, [materials, selectedProperty])

  const getPropertyUnit = (prop: string): string => {
    const property = properties.find((p) => p.value === prop)
    if (!property) return ""
    const match = property.label.match(/$$(.*?)$$/)
    return match ? match[1] : ""
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deviation Analysis</CardTitle>
        <CardDescription>Analyze how materials deviate from the average value</CardDescription>
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

        <div className="text-sm mb-4">
          <span className="font-medium">
            Average {properties.find((p) => p.value === selectedProperty)?.label.split(" (")[0]}:
          </span>
          <span className="ml-1">
            {averageValue.toFixed(2)} {getPropertyUnit(selectedProperty)}
          </span>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12, angle: -45, textAnchor: "end" }} height={80} />
              <YAxis
                label={{
                  value: "Deviation (%)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="deviation" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
