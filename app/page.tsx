"use client"

import { useState, useCallback } from "react"
import { MaterialSelector } from "@/components/material-selector"
import { MaterialRadarChart } from "@/components/material-radar-chart"
import { PropertySelector } from "@/components/property-selector"
import { PropertyComparison } from "@/components/property-comparison"
import { DeviationAnalysis } from "@/components/deviation-analysis"
import { StressStrainPlotter } from "@/components/stress-strain-plotter"
import type { Material } from "@/utils/csv-parser"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Dummy data - always use this for now
const DUMMY_CSV = `Name,Type,TensileStrength,YieldStrength,ElasticModulus,Density,Hardness,FatigueStrength,CorrosionResistance
Ti6Al4V,Titanium Alloy,950,880,114,4.43,36,510,9
316L,Stainless Steel,485,170,193,8.0,79,200,8
CoCrMo,Cobalt Alloy,655,450,210,8.3,35,310,7
PEEK,Polymer,100,90,3.6,1.3,85,50,10
Zirconia,Ceramic,900,500,210,6.0,1200,350,10
Ti-Nb,Titanium Alloy,800,600,65,4.5,30,400,9
Ti-Ta,Titanium Alloy,780,630,70,5.0,32,380,9
Ti-Zr,Titanium Alloy,900,830,100,4.6,35,470,9
Steel 17-4PH,Stainless Steel,1100,1000,197,7.8,40,550,6
Steel 304,Stainless Steel,505,215,200,8.0,80,240,7
Steel 316,Stainless Steel,515,205,193,8.0,79,260,8
Al 6061,Aluminum Alloy,310,276,68.9,2.7,95,96,6
Al 7075,Aluminum Alloy,572,503,71.7,2.81,150,159,5
Mg AZ31,Magnesium Alloy,260,200,45,1.77,49,97,4
Mg AZ91,Magnesium Alloy,230,150,45,1.81,63,80,3
Ti6Al4V ELI,Titanium Alloy,860,795,110,4.43,32,480,9
Ti-13Nb-13Zr,Titanium Alloy,900,800,79,5.2,30,450,9
Ti-15Mo,Titanium Alloy,874,544,78,5.0,35,400,8
Ti-35Nb-7Zr-5Ta,Titanium Alloy,590,547,55,6.45,25,350,9
NiTi (Nitinol),Shape Memory Alloy,900,150-800,28-75,6.45,200-300,350,7
Co-28Cr-6Mo,Cobalt Alloy,900,650,230,8.3,35,400,7
Co-20Cr-15W-10Ni,Cobalt Alloy,950,450,210,9.1,30,380,6
316LVM,Stainless Steel,515,205,193,8.0,79,260,8
2205 Duplex,Stainless Steel,620,450,200,7.8,30,350,9
MP35N,Cobalt Alloy,1600,1100,230,8.4,35,600,8
Alumina (Al2O3),Ceramic,300,,380,3.98,2000,,10
Zirconia-Toughened Alumina,Ceramic,500,,300,4.4,1400,,10
3Y-TZP Zirconia,Ceramic,900,,210,6.0,1200,,10
Hydroxyapatite,Ceramic,40,,80,3.16,350,,10
β-Tricalcium Phosphate,Ceramic,20,,50,3.07,300,,9
Bioactive Glass 45S5,Ceramic,42,,35,2.7,450,,10
Si3N4 (Silicon Nitride),Ceramic,850,,300,3.2,1500,,10
PEEK (Polyether ether ketone),Polymer,100,90,3.6,1.3,85,50,10
UHMWPE (Ultra-high MW Polyethylene),Polymer,40,20,0.8,0.93,10,20,8
PMMA (Bone Cement),Polymer,35,,2.5,1.18,80,15,6
PLA (Polylactic Acid),Polymer,50,45,3.5,1.25,80,25,5
PGA (Polyglycolic Acid),Polymer,70,60,7.0,1.5,90,30,4
PDMS (Silicone),Polymer,10,,0.001-0.1,1.02,5,5,8
PCL (Polycaprolactone),Polymer,16,12,0.4,1.1,70,10,4
PLLA (Poly-L-lactic acid),Polymer,60,50,2.7,1.25,75,30,5
PEEK-HA Composite,Composite,80,70,5.0,1.8,100,40,9
PLGA (50:50),Polymer,45,40,2.0,1.3,60,20,4
CF-PEEK (30% Carbon Fiber),Composite,300,280,18,1.5,120,150,9
HA/UHMWPE Composite,Composite,30,25,2.0,1.5,50,15,8
Ti/HA FGM,Functionally Graded Material,600-40,550-30,110-2,4.5-3.0,35-200,300-20,9
ZrO2/Ti FGM,Functionally Graded Material,800-100,750-80,200-110,6.5-4.8,1200-35,350-50,10
Mg WE43,Magnesium Alloy,250,150,44,1.84,60,100,3
Mg-Zn-Ca,Magnesium Alloy,220,130,42,1.8,55,90,4
Fe-Mn (Biodegradable),Iron Alloy,450,200,190,7.9,120,200,2
Zn-3Ag,Zinc Alloy,200,120,90,7.2,80,80,5
Ta (Tantalum),Metal,345,140,185,16.6,120,200,10
Nb (Niobium),Metal,275,105,105,8.57,80,150,9
Ti-6Al-7Nb,Titanium Alloy,900,800,105,4.52,34,500,9
Ti-15Mo-3Nb-3Al,Titanium Alloy,825,725,80,5.1,32,400,8
Ti-24Nb-4Zr-7.9Sn,Titanium Alloy,650,550,42,5.8,28,300,9
Ti-29Nb-13Ta-4.6Zr,Titanium Alloy,600,500,65,6.0,25,280,9
Ti-35.3Nb-5.1Ta-7.1Zr,Titanium Alloy,570,520,55,6.2,24,260,9
Ti-45Nb,Titanium Alloy,420,380,62,5.8,22,200,8
316L (High Nitrogen),Stainless Steel,750,450,200,8.0,250,350,8
Co-20Cr-15W-10Ni (Wrought),Cobalt Alloy,950,450,210,9.1,30,380,6
Ti-6Al-2Sn-4Zr-2Mo,Titanium Alloy,1000,900,110,4.54,36,550,8
Ti-10V-2Fe-3Al,Titanium Alloy,1100,1000,105,4.65,38,600,7
Ti-5Al-2.5Fe,Titanium Alloy,850,750,110,4.45,33,450,8
Ti-15Mo-5Zr-3Al,Titanium Alloy,900,800,80,5.0,35,450,8
Ti-15Mo-2.8Nb-0.2Si,Titanium Alloy,850,750,82,5.1,34,420,8
Ti-15Zr-4Nb-4Ta,Titanium Alloy,800,700,85,5.2,32,400,9
Ti-30Ta,Titanium Alloy,700,600,75,5.5,30,350,9
Ti-40Nb,Titanium Alloy,500,450,60,5.7,25,250,8
Ti-50Ta,Titanium Alloy,650,550,85,6.0,28,300,9
Ti-50Zr,Titanium Alloy,850,750,95,4.8,33,400,9
Ti-6Al-2Sn-4Zr-6Mo,Titanium Alloy,1150,1050,115,4.6,40,650,8
`

export default function Home() {
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([])
  const [matchingMaterials, setMatchingMaterials] = useState<Material[]>([])
  const [allMaterials, setAllMaterials] = useState<Material[]>([])

  // Memoize callbacks to prevent unnecessary re-renders
  const handleSelectionChange = useCallback((materials: Material[]) => {
    setSelectedMaterials(materials)
  }, [])

  const handleMatchingMaterialsChange = useCallback((materials: Material[]) => {
    setMatchingMaterials(materials)
  }, [])

  const handleAllMaterialsLoaded = useCallback((materials: Material[]) => {
    setAllMaterials(materials)
  }, [])

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Biomaterial Analysis Tool</h1>

      {/* Main tabs for the three separate modules */}
      <Tabs defaultValue="material-selection" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="material-selection">Material Selection</TabsTrigger>
          <TabsTrigger value="property-search">Property-Based Search</TabsTrigger>
          <TabsTrigger value="stress-strain">Stress-Strain Analysis</TabsTrigger>
        </TabsList>

        {/* Material Selection Module */}
        <TabsContent value="material-selection" className="mt-4">
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Material Selection</CardTitle>
                <CardDescription>
                  Search for materials by name or type and select 2-5 materials to compare
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MaterialSelector
                  onSelectionChange={handleSelectionChange}
                  csvData={DUMMY_CSV}
                  onAllMaterialsLoaded={handleAllMaterialsLoaded}
                />
              </CardContent>
            </Card>

            {selectedMaterials.length >= 2 && (
              <Tabs defaultValue="radar">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="radar">Radar Chart</TabsTrigger>
                  <TabsTrigger value="comparison">Property Comparison</TabsTrigger>
                  <TabsTrigger value="deviation">Deviation Analysis</TabsTrigger>
                  <TabsTrigger value="data">Raw Data</TabsTrigger>
                </TabsList>

                <TabsContent value="radar" className="mt-4">
                  <MaterialRadarChart materials={selectedMaterials} />
                </TabsContent>

                <TabsContent value="comparison" className="mt-4">
                  <PropertyComparison materials={selectedMaterials} />
                </TabsContent>

                <TabsContent value="deviation" className="mt-4">
                  <DeviationAnalysis materials={selectedMaterials} />
                </TabsContent>

                <TabsContent value="data" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Material Properties Data</CardTitle>
                      <CardDescription>Raw property values for selected materials</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Property</TableHead>
                            {selectedMaterials.map((material) => (
                              <TableHead key={material.id}>{material.name}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Type</TableCell>
                            {selectedMaterials.map((material) => (
                              <TableCell key={`${material.id}-type`}>{material.type}</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Tensile Strength (MPa)</TableCell>
                            {selectedMaterials.map((material) => (
                              <TableCell key={`${material.id}-tensile`}>{material.tensileStrength}</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Yield Strength (MPa)</TableCell>
                            {selectedMaterials.map((material) => (
                              <TableCell key={`${material.id}-yield`}>{material.yieldStrength}</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Elastic Modulus (GPa)</TableCell>
                            {selectedMaterials.map((material) => (
                              <TableCell key={`${material.id}-elastic`}>{material.elasticModulus}</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Density (g/cm³)</TableCell>
                            {selectedMaterials.map((material) => (
                              <TableCell key={`${material.id}-density`}>{material.density}</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Hardness (HV)</TableCell>
                            {selectedMaterials.map((material) => (
                              <TableCell key={`${material.id}-hardness`}>{material.hardness}</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Fatigue Strength (MPa)</TableCell>
                            {selectedMaterials.map((material) => (
                              <TableCell key={`${material.id}-fatigue`}>{material.fatigueStrength}</TableCell>
                            ))}
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Corrosion Resistance (1-10)</TableCell>
                            {selectedMaterials.map((material) => (
                              <TableCell key={`${material.id}-corrosion`}>{material.corrosionResistance}</TableCell>
                            ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </TabsContent>

        {/* Property-Based Search Module */}
        <TabsContent value="property-search" className="mt-4">
          <div className="grid gap-8">
            {allMaterials.length > 0 ? (
              <PropertySelector materials={allMaterials} onMatchingMaterialsChange={handleMatchingMaterialsChange} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Property-Based Search</CardTitle>
                  <CardDescription>Loading materials data...</CardDescription>
                </CardHeader>
              </Card>
            )}

            {matchingMaterials.length >= 2 && (
              <div className="mt-4">
                <h2 className="text-2xl font-bold mb-4">Property-Matched Materials Analysis</h2>
                {matchingMaterials.length > 8 && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
                    <p>
                      Showing analysis for the first 8 matching materials. Refine your property filters for more
                      specific results.
                    </p>
                  </div>
                )}
                <Tabs defaultValue="radar">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="radar">Radar Chart</TabsTrigger>
                    <TabsTrigger value="comparison">Property Comparison</TabsTrigger>
                    <TabsTrigger value="deviation">Deviation Analysis</TabsTrigger>
                    <TabsTrigger value="data">Raw Data</TabsTrigger>
                  </TabsList>

                  <TabsContent value="radar" className="mt-4">
                    <MaterialRadarChart materials={matchingMaterials.slice(0, 8)} />
                  </TabsContent>

                  <TabsContent value="comparison" className="mt-4">
                    <PropertyComparison materials={matchingMaterials.slice(0, 8)} />
                  </TabsContent>

                  <TabsContent value="deviation" className="mt-4">
                    <DeviationAnalysis materials={matchingMaterials.slice(0, 8)} />
                  </TabsContent>

                  <TabsContent value="data" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Material Properties Data</CardTitle>
                        <CardDescription>
                          Raw property values for matched materials{" "}
                          {matchingMaterials.length > 8 ? "(showing first 8)" : ""}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Property</TableHead>
                              {matchingMaterials.slice(0, 8).map((material) => (
                                <TableHead key={material.id}>{material.name}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Type</TableCell>
                              {matchingMaterials.slice(0, 8).map((material) => (
                                <TableCell key={`${material.id}-type`}>{material.type}</TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Tensile Strength (MPa)</TableCell>
                              {matchingMaterials.slice(0, 8).map((material) => (
                                <TableCell key={`${material.id}-tensile`}>{material.tensileStrength}</TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Yield Strength (MPa)</TableCell>
                              {matchingMaterials.slice(0, 8).map((material) => (
                                <TableCell key={`${material.id}-yield`}>{material.yieldStrength}</TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Elastic Modulus (GPa)</TableCell>
                              {matchingMaterials.slice(0, 8).map((material) => (
                                <TableCell key={`${material.id}-elastic`}>{material.elasticModulus}</TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Density (g/cm³)</TableCell>
                              {matchingMaterials.slice(0, 8).map((material) => (
                                <TableCell key={`${material.id}-density`}>{material.density}</TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Hardness (HV)</TableCell>
                              {matchingMaterials.slice(0, 8).map((material) => (
                                <TableCell key={`${material.id}-hardness`}>{material.hardness}</TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Fatigue Strength (MPa)</TableCell>
                              {matchingMaterials.slice(0, 8).map((material) => (
                                <TableCell key={`${material.id}-fatigue`}>{material.fatigueStrength}</TableCell>
                              ))}
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Corrosion Resistance (1-10)</TableCell>
                              {matchingMaterials.slice(0, 8).map((material) => (
                                <TableCell key={`${material.id}-corrosion`}>{material.corrosionResistance}</TableCell>
                              ))}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Stress-Strain Analysis Module */}
        <TabsContent value="stress-strain" className="mt-4">
          <div className="grid gap-8">
            <StressStrainPlotter />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
