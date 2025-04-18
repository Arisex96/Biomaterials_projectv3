export interface Material {
  id: string
  name: string
  type: string
  tensileStrength: number
  yieldStrength: number
  elasticModulus: number
  density: number
  hardness: number
  fatigueStrength: number
  corrosionResistance: number
}

export async function parseMaterialsCSV(csvText: string): Promise<Material[]> {
  const lines = csvText.split("\n")
  const headers = lines[0].split(",")

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line, index) => {
      const values = line.split(",")
      return {
        id: `material-${index}`,
        name: values[0]?.trim() || "",
        type: values[1]?.trim() || "",
        tensileStrength: Number.parseFloat(values[2]) || 0,
        yieldStrength: Number.parseFloat(values[3]) || 0,
        elasticModulus: Number.parseFloat(values[4]) || 0,
        density: Number.parseFloat(values[5]) || 0,
        hardness: Number.parseFloat(values[6]) || 0,
        fatigueStrength: Number.parseFloat(values[7]) || 0,
        corrosionResistance: Number.parseFloat(values[8]) || 0,
      }
    })
}
