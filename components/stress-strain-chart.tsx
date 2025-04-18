"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { cn } from "@/lib/utils"

Chart.register(...registerables)

interface StressStrainChartProps {
  data: any
  className?: string
  units: "psi" | "MPa"
}

export function StressStrainChart({ data, className, units }: StressStrainChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Prepare data
    const { engStrain, engStress } = data.curvePoints

    // Convert stress values if needed
    const conversionFactor = units === "MPa" ? 1 / 1000000 : 1
    const stressValues = engStress.map((value: number) => value * conversionFactor)

    // Format data points for Chart.js
    const dataPoints = engStrain.map((strain: number, index: number) => ({
      x: strain,
      y: stressValues[index],
    }))

    // Find yield point index
    const yieldPointIndex = engStrain.findIndex((strain: number) => Math.abs(strain - data.engStrainAtYield) < 0.0001)

    // Find ultimate point index
    const ultimatePointIndex = engStrain.findIndex(
      (strain: number) => Math.abs(strain - data.engStrainUltimate) < 0.0001,
    )

    // Create chart with improved margins
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: `Engineering Stress (${units})`,
            data: dataPoints,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.1,
            fill: false,
          },
          {
            label: "Yield Point",
            data: [
              {
                x: data.engStrainAtYield,
                y: data.engYieldStr * conversionFactor,
              },
            ],
            borderColor: "rgb(234, 88, 12)",
            backgroundColor: "rgb(234, 88, 12)",
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false,
          },
          {
            label: "Ultimate Point",
            data: [
              {
                x: data.engStrainUltimate,
                y: data.engUltStr * conversionFactor,
              },
            ],
            borderColor: "rgb(220, 38, 38)",
            backgroundColor: "rgb(220, 38, 38)",
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 15,
            right: 25,
            top: 25,
            bottom: 15,
          },
        },
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            title: {
              display: true,
              text: "Strain (ε)",
              font: {
                weight: "bold",
              },
              padding: { top: 10 },
            },
            min: 0,
            max: Math.min(data.engStrainUltimate * 1.1, 0.3), // Limit max strain to 30% or 110% of ultimate strain
            ticks: {
              callback: (value) => Number(value).toFixed(3),
              padding: 8,
            },
            grid: {
              display: true,
              drawBorder: true,
            },
          },
          y: {
            title: {
              display: true,
              text: `Stress (${units})`,
              font: {
                weight: "bold",
              },
              padding: { right: 10 },
            },
            beginAtZero: true,
            ticks: {
              padding: 8,
            },
            grid: {
              display: true,
              drawBorder: true,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || ""
                const value = context.parsed.y
                const strain = context.parsed.x
                return `${label}: ${value.toFixed(1)} ${units} at ε=${strain.toFixed(6)}`
              },
            },
          },
          legend: {
            position: "top",
            labels: {
              padding: 20,
            },
          },
        },
        interaction: {
          mode: "nearest",
          intersect: false,
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, units])

  if (!data) return null

  return (
    <div className={cn("w-full h-full min-h-[400px]", className)}>
      <canvas ref={chartRef} />
    </div>
  )
}
