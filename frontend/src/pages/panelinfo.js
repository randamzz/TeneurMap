"use client"

import { useMemo } from "react"
import StatCard from "../components/StatCard"
import PointDetails from "../components/PointDetails"
import DataSummary from "../components/DataSummary"
import PredictionForm from "../components/PredictionForm"

const PanelInfo = ({ data, selectedPoint, onPointSelect }) => {
  const statistics = useMemo(() => {
    if (!data.length) return null

    const teneurs = data.map((d) => d.teneur)
    const altitudes = data.map((d) => d.Z)

    return {
      totalPoints: data.length,
      avgTeneur: teneurs.reduce((a, b) => a + b, 0) / teneurs.length,
      maxTeneur: Math.max(...teneurs),
      minTeneur: Math.min(...teneurs),
      avgAltitude: altitudes.reduce((a, b) => a + b, 0) / altitudes.length,
      maxAltitude: Math.max(...altitudes),
      minAltitude: Math.min(...altitudes),
    }
  }, [data])

  const teneurDistribution = useMemo(() => {
    if (!data.length) return []

    const ranges = [
      { label: "Faible (2-5%)", min: 2, max: 5, color: "#3b82f6" },
      { label: "Moyenne (5-8%)", min: 5, max: 8, color: "#10b981" },
      { label: "Élevée (8-11%)", min: 8, max: 11, color: "#f59e0b" },
      { label: "Très élevée (11%+)", min: 11, max: 15, color: "#ef4444" },
    ]

    return ranges.map((range) => {
      const count = data.filter((d) => d.teneur >= range.min && d.teneur < range.max).length
      const percentage = (count / data.length) * 100
      return { ...range, count, percentage }
    })
  }, [data])

  if (!statistics) {
    return (
      <div className="sidebar">
        <div className="loading">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="sidebar">
  

      <div
        style={{
          padding: "24px",
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <PredictionForm />
{/* 
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              margin: "0 0 16px 0",
              color: "var(--text-primary)",
            }}
          >
            Statistiques Générales
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <StatCard
              label="Points totaux"
              value={statistics.totalPoints.toLocaleString()}
              color="var(--accent-primary)"
            />
            <StatCard label="Teneur moyenne" value={`${statistics.avgTeneur.toFixed(2)}%`} color="var(--success)" />
            <StatCard
              label="Altitude moyenne"
              value={`${statistics.avgAltitude.toFixed(0)}m`}
              color="var(--accent-secondary)"
            />
          </div>
        </div> */}

        {/* <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              margin: "0 0 16px 0",
              color: "var(--text-primary)",
            }}
          >
            Distribution des Teneurs
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {teneurDistribution.map((range, index) => (
              <div
                key={index}
                style={{
                  background: "var(--surface-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "12px",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                    }}
                  >
                    {range.label}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: range.color,
                    }}
                  >
                    {range.percentage.toFixed(1)}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    backgroundColor: "var(--border)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${range.percentage}%`,
                      height: "100%",
                      backgroundColor: range.color,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginTop: "4px",
                  }}
                >
                  {range.count} points
                </div>
              </div>
            ))}
          </div>
        </div> */}

        <DataSummary statistics={statistics} />

        {selectedPoint && <PointDetails point={selectedPoint} onClose={() => onPointSelect(null)} />}
      </div>
    </div>
  )
}

export default PanelInfo
