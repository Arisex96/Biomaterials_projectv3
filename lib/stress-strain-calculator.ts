interface MaterialProperties {
  yieldStr: number
  ultStr: number
  elasticMod: number
  pctElong: number
}

export function calculateStressStrainCurve(matProps: MaterialProperties) {
  const { yieldStr, ultStr, elasticMod, pctElong } = matProps

  // Calculate key points
  const engStrainAtYield = yieldStr / elasticMod // Calculate yield strain properly
  const engStrainUltimate = pctElong // Use provided elongation
  const trueStrainAtBreak = Math.log(1 + pctElong)
  const trueUltStr = ultStr * (1 + pctElong)

  // Calculate strain hardening exponent (n) and strength coefficient (K)
  const n = Math.log(ultStr / yieldStr) / Math.log(engStrainUltimate / engStrainAtYield)
  const K = yieldStr / Math.pow(engStrainAtYield, n)

  // Generate curve points
  const numPoints = 100
  const engStrain: number[] = []
  const engStress: number[] = []
  const trueStrain: number[] = []
  const trueStress: number[] = []

  // Elastic region
  const elasticPoints = 20
  for (let i = 0; i < elasticPoints; i++) {
    const strain = (i / (elasticPoints - 1)) * engStrainAtYield
    engStrain.push(strain)
    engStress.push(strain * elasticMod)

    // Calculate true values
    trueStrain.push(Math.log(1 + strain))
    trueStress.push(engStress[i] * (1 + strain))
  }

  // Plastic region
  const plasticPoints = numPoints - elasticPoints
  const strainStep = (engStrainUltimate - engStrainAtYield) / plasticPoints

  for (let i = 1; i <= plasticPoints; i++) {
    const strain = engStrainAtYield + i * strainStep
    engStrain.push(strain)

    // Use power law relationship for plastic region
    const stress = K * Math.pow(strain, n)
    engStress.push(stress)

    // Calculate true values
    trueStrain.push(Math.log(1 + strain))
    trueStress.push(stress * (1 + strain))
  }

  return {
    engStrainUltimate,
    engUltStr: ultStr,
    trueStrainAtBreak,
    trueUltStr,
    engStrainAtYield,
    engYieldStr: yieldStr,
    n,
    K,
    curvePoints: {
      engStrain,
      engStress,
      trueStrain,
      trueStress,
    },
  }
}
