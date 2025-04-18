export interface StressStrainMaterial {
  id: string
  name: string
  type: string
  yieldStrength: number // psi
  tensileStrength: number // psi
  elongation: number // decimal (e.g., 0.10 for 10%)
}

// This data is specifically curated for materials that will show proper stress-strain curves
export const stressStrainMaterials: StressStrainMaterial[] = [
  // Example materials
  {
    id: "example-1",
    name: "Example Material 1",
    type: "Fictitious",
    yieldStrength: 20000,
    tensileStrength: 40000,
    elongation: 0.1,
  },
  {
    id: "example-2",
    name: "Example Material 2",
    type: "Fictitious",
    yieldStrength: 60000,
    tensileStrength: 80000,
    elongation: 0.15,
  },

  // Aluminum Alloys
  {
    id: "al-2014-t6-1",
    name: "Al 2014 T6",
    type: "Aluminum Alloy",
    yieldStrength: 57000,
    tensileStrength: 64000,
    elongation: 0.06,
  },
  {
    id: "al-2014-t6-2",
    name: "Al 2014 T651",
    type: "Aluminum Alloy",
    yieldStrength: 59000,
    tensileStrength: 67000,
    elongation: 0.07,
  },
  {
    id: "al-2024-t3",
    name: "Al 2024 T3",
    type: "Aluminum Alloy",
    yieldStrength: 42000,
    tensileStrength: 62000,
    elongation: 0.15,
  },
  {
    id: "al-2024-t351",
    name: "Al 2024 T351",
    type: "Aluminum Alloy",
    yieldStrength: 42000,
    tensileStrength: 64000,
    elongation: 0.12,
  },
  {
    id: "al-5083-h32",
    name: "Al 5083 H32",
    type: "Aluminum Alloy",
    yieldStrength: 31000,
    tensileStrength: 56000,
    elongation: 0.12,
  },
  {
    id: "al-6061-t6",
    name: "Al 6061 T6",
    type: "Aluminum Alloy",
    yieldStrength: 35000,
    tensileStrength: 42000,
    elongation: 0.1,
  },
  {
    id: "al-7075-t6",
    name: "Al 7075 T6",
    type: "Aluminum Alloy",
    yieldStrength: 68000,
    tensileStrength: 78000,
    elongation: 0.09,
  },
  {
    id: "al-7075-t651",
    name: "Al 7075 T651",
    type: "Aluminum Alloy",
    yieldStrength: 67000,
    tensileStrength: 78000,
    elongation: 0.07,
  },

  // Carbon/Alloy Steels
  {
    id: "astm-a36",
    name: "ASTM A36",
    type: "Carbon/Alloy Steel",
    yieldStrength: 36000,
    tensileStrength: 58000,
    elongation: 0.23,
  },
  {
    id: "astm-a572-50",
    name: "ASTM A572 Grade 50",
    type: "Carbon/Alloy Steel",
    yieldStrength: 50000,
    tensileStrength: 70000,
    elongation: 0.18,
  },
  {
    id: "astm-a514",
    name: "ASTM A514",
    type: "Carbon/Alloy Steel",
    yieldStrength: 100000,
    tensileStrength: 110000,
    elongation: 0.18,
  },
  {
    id: "astm-a516-70",
    name: "ASTM A516 Grade 70",
    type: "Carbon/Alloy Steel",
    yieldStrength: 38000,
    tensileStrength: 70000,
    elongation: 0.17,
  },
  {
    id: "aisi-1020",
    name: "AISI 1020",
    type: "Carbon/Alloy Steel",
    yieldStrength: 32000,
    tensileStrength: 50000,
    elongation: 0.25,
  },
  {
    id: "aisi-1045",
    name: "AISI 1045",
    type: "Carbon/Alloy Steel",
    yieldStrength: 45000,
    tensileStrength: 75000,
    elongation: 0.15,
  },
  {
    id: "aisi-4130",
    name: "AISI 4130",
    type: "Carbon/Alloy Steel",
    yieldStrength: 70000,
    tensileStrength: 90000,
    elongation: 0.2,
  },
  {
    id: "aisi-4140",
    name: "AISI 4140",
    type: "Carbon/Alloy Steel",
    yieldStrength: 90000,
    tensileStrength: 120000,
    elongation: 0.15,
  },

  // Stainless Steels
  {
    id: "aisi-304",
    name: "AISI 304",
    type: "Stainless Steel",
    yieldStrength: 30000,
    tensileStrength: 75000,
    elongation: 0.4,
  },
  {
    id: "aisi-316",
    name: "AISI 316",
    type: "Stainless Steel",
    yieldStrength: 30000,
    tensileStrength: 75000,
    elongation: 0.4,
  },
  {
    id: "aisi-410",
    name: "AISI 410",
    type: "Stainless Steel",
    yieldStrength: 40000,
    tensileStrength: 70000,
    elongation: 0.2,
  },
  {
    id: "17-4ph-h900",
    name: "17-4PH H900",
    type: "Stainless Steel",
    yieldStrength: 170000,
    tensileStrength: 190000,
    elongation: 0.1,
  },

  // Titanium Alloys
  {
    id: "ti-grade-2",
    name: "Titanium Grade 2",
    type: "Titanium Alloy",
    yieldStrength: 40000,
    tensileStrength: 50000,
    elongation: 0.2,
  },
  {
    id: "ti-6al-4v",
    name: "Titanium 6Al-4V",
    type: "Titanium Alloy",
    yieldStrength: 120000,
    tensileStrength: 130000,
    elongation: 0.1,
  },
  {
    id: "ti-6al-4v-eli",
    name: "Titanium 6Al-4V ELI",
    type: "Titanium Alloy",
    yieldStrength: 110000,
    tensileStrength: 120000,
    elongation: 0.1,
  },

  // Nickel Alloys
  {
    id: "inconel-625",
    name: "Inconel 625",
    type: "Nickel Alloy",
    yieldStrength: 60000,
    tensileStrength: 120000,
    elongation: 0.3,
  },
  {
    id: "inconel-718",
    name: "Inconel 718",
    type: "Nickel Alloy",
    yieldStrength: 150000,
    tensileStrength: 180000,
    elongation: 0.1,
  },
  {
    id: "monel-400",
    name: "Monel 400",
    type: "Nickel Alloy",
    yieldStrength: 50000,
    tensileStrength: 84000,
    elongation: 0.1,
  },
  {
    id: "monel-k500",
    name: "Monel K-500",
    type: "Nickel Alloy",
    yieldStrength: 100000,
    tensileStrength: 140000,
    elongation: 0.2,
  },

  // Copper Alloys
  {
    id: "copper-nickel-70-30",
    name: "70/30 Copper-Nickel",
    type: "Copper Alloy",
    yieldStrength: 20000,
    tensileStrength: 50000,
    elongation: 0.3,
  },
  {
    id: "beryllium-copper",
    name: "Beryllium Copper",
    type: "Copper Alloy",
    yieldStrength: 140000,
    tensileStrength: 165000,
    elongation: 0.03,
  },
]

// Group materials by type for easier selection
export const materialTypeGroups = stressStrainMaterials.reduce(
  (groups, material) => {
    if (!groups[material.type]) {
      groups[material.type] = []
    }
    groups[material.type].push(material)
    return groups
  },
  {} as Record<string, StressStrainMaterial[]>,
)

// Get material types for dropdown
export const materialTypes = Object.keys(materialTypeGroups).sort()
