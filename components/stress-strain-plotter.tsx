"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StressStrainChart } from "@/components/stress-strain-chart"
import { calculateStressStrainCurve } from "@/lib/stress-strain-calculator"
import { stressStrainMaterials, materialTypes, materialTypeGroups } from "@/utils/stress-strain-materials"

export function StressStrainPlotter() {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [materialProps, setMaterialProps] = useState({
    yieldStr: 70000, // psi
    ultStr: 90000, // psi
    elasticMod: 28000000, // psi
    pctElong: 0.1, // decimal
  })
  const [curveData, setCurveData] = useState<any>(null)
  const [units, setUnits] = useState<"psi" | "MPa">("psi")
  const [elasticModulus, setElasticModulus] = useState(28000000) // Default elastic modulus in psi

  // Handle material type selection
  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    setSelectedMaterial(null)
  }

  // Handle material selection
  const handleMaterialSelect = (materialId: string) => {
    const material = stressStrainMaterials.find((m) => m.id === materialId)
    if (material) {
      setSelectedMaterial(materialId)

      // Set material properties
      // For elastic modulus, use typical values based on material type
      let modulus = 28000000 // Default (steel)

      if (material.type.includes("Aluminum")) {
        modulus = 10000000 // ~10 million psi for aluminum
      } else if (material.type.includes("Titanium")) {
        modulus = 16000000 // ~16 million psi for titanium
      } else if (material.type.includes("Copper")) {
        modulus = 17000000 // ~17 million psi for copper alloys
      } else if (material.type.includes("Nickel")) {
        modulus = 30000000 // ~30 million psi for nickel alloys
      }

      setElasticModulus(modulus)

      setMaterialProps({
        yieldStr: material.yieldStrength,
        ultStr: material.tensileStrength,
        elasticMod: modulus,
        pctElong: material.elongation,
      })
    }
  }

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Convert MPa to psi if needed
    if (units === "MPa" && (name === "yieldStr" || name === "ultStr" || name === "elasticMod")) {
      setMaterialProps((prev) => ({
        ...prev,
        [name]: Number(value) * 145.038, // Convert MPa to psi
      }))
    } else {
      setMaterialProps((prev) => ({
        ...prev,
        [name]: Number(value) || 0,
      }))
    }
  }

  // Calculate the stress-strain curve
  const handleCalculate = () => {
    const result = calculateStressStrainCurve(materialProps)
    setCurveData(result)
  }

  // Format display values based on units
  const displayValue = (value: number) => {
    if (units === "MPa") {
      return (value / 145.038).toFixed(1) // Convert psi to MPa
    }
    return value.toFixed(1) // Keep as psi
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stress-Strain Curve Plotter</CardTitle>
        <CardDescription>
          Visualize how materials deform under load to better understand their mechanical behavior
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Material Type</Label>
              <Select value={selectedType || ""} onValueChange={handleTypeSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Material</Label>
              <Select value={selectedMaterial || ""} onValueChange={handleMaterialSelect} disabled={!selectedType}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedType ? "Choose a material" : "Select material type first"} />
                </SelectTrigger>
                <SelectContent>
                  {selectedType &&
                    materialTypeGroups[selectedType]?.map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Units</Label>
                <div className="flex space-x-2">
                  <Button variant={units === "psi" ? "default" : "outline"} size="sm" onClick={() => setUnits("psi")}>
                    psi
                  </Button>
                  <Button variant={units === "MPa" ? "default" : "outline"} size="sm" onClick={() => setUnits("MPa")}>
                    MPa
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yieldStr">Yield Strength ({units})</Label>
              <Input
                id="yieldStr"
                name="yieldStr"
                type="number"
                value={units === "MPa" ? Number((materialProps.yieldStr / 145.038).toFixed(1)) : materialProps.yieldStr}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ultStr">Ultimate Strength ({units})</Label>
              <Input
                id="ultStr"
                name="ultStr"
                type="number"
                value={units === "MPa" ? Number((materialProps.ultStr / 145.038).toFixed(1)) : materialProps.ultStr}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="elasticMod">Elastic Modulus ({units})</Label>
              <Input
                id="elasticMod"
                name="elasticMod"
                type="number"
                value={
                  units === "MPa" ? Number((materialProps.elasticMod / 145.038).toFixed(1)) : materialProps.elasticMod
                }
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pctElong">Percent Elongation (decimal)</Label>
              <Input
                id="pctElong"
                name="pctElong"
                type="number"
                step="0.01"
                value={materialProps.pctElong}
                onChange={handleInputChange}
              />
            </div>

            <Button className="w-full" onClick={handleCalculate}>
              Calculate Curve
            </Button>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="h-[450px] border rounded-md p-4">
              {curveData ? (
                <StressStrainChart data={curveData} units={units} />
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <p className="text-muted-foreground">Select a material or enter properties and click Calculate</p>
                  </div>
                </div>
              )}
            </div>

            {curveData && (
              <Tabs defaultValue="properties">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="properties">Material Properties</TabsTrigger>
                  <TabsTrigger value="data">Data Points</TabsTrigger>
                </TabsList>

                <TabsContent value="properties" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-medium">Yield Strength</p>
                      <p className="text-lg">
                        {displayValue(curveData.engYieldStr)} {units}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        at strain ε = {curveData.engStrainAtYield.toFixed(4)}
                      </p>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-medium">Ultimate Strength</p>
                      <p className="text-lg">
                        {displayValue(curveData.engUltStr)} {units}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        at strain ε = {curveData.engStrainUltimate.toFixed(4)}
                      </p>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-medium">Strain Hardening Exponent (n)</p>
                      <p className="text-lg">{curveData.n.toFixed(4)}</p>
                    </div>

                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-medium">Strength Coefficient (K)</p>
                      <p className="text-lg">
                        {displayValue(curveData.K)} {units}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="data">
                  <div className="max-h-[200px] overflow-auto mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Strain</TableHead>
                          <TableHead>Stress ({units})</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {curveData.curvePoints.engStrain.map((strain: number, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{strain.toFixed(4)}</TableCell>
                            <TableCell>{displayValue(curveData.curvePoints.engStress[index])}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
