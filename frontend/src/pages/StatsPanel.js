"use client"

import { useMemo, useState } from "react"
import StatCard from "./StatCard"

const StatsPanel = ({ data }) => {
  const [isOpen, setIsOpen] = useState(true)
  
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

  if (!statistics || !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 15px",
          background: "var(--accent-primary)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius)",
          cursor: "pointer",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        Afficher les statistiques
      </button>
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "400px",
        maxHeight: "60vh",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "relative",
        }}
      >
        <button
          onClick={() => setIsOpen(false)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: "5px",
            borderRadius: "4px",
          }}
          aria-label="Fermer le panneau"
        >
          ×
        </button>
        
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              margin: "0 0 16px 0",
              color: "var(--text-primary)",
              borderBottom: "2px solid var(--accent-primary)",
              paddingBottom: "8px",
            }}
          >
            Statistiques Générales
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
            <StatCard label="Teneur max" value={`${statistics.maxTeneur.toFixed(2)}%`} color="var(--warning)" />
          </div>
        </div>

        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              margin: "0 0 16px 0",
              color: "var(--text-primary)",
              borderBottom: "2px solid var(--accent-secondary)",
              paddingBottom: "8px",
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
        </div>
      </div>
    </div>
  )
}

export default StatsPanel