const DataSummary = ({ statistics }) => {
  return (
    <div>
      <h2
        style={{
          fontSize: "18px",
          fontWeight: "600",
          margin: "0 0 16px 0",
          color: "var(--text-primary)",
        }}
      >
        Résumé des Données
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div
          style={{
            background: "var(--surface-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "16px",
          }}
        >
          <h4
            style={{
              margin: "0 0 12px 0",
              color: "var(--text-primary)",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Teneur (%)
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Minimum</span>
              <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>
                {statistics.minTeneur.toFixed(3)}%
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Maximum</span>
              <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>
                {statistics.maxTeneur.toFixed(3)}%
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Écart</span>
              <span style={{ color: "var(--accent-primary)", fontWeight: "600" }}>
                {(statistics.maxTeneur - statistics.minTeneur).toFixed(3)}%
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--surface-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "16px",
          }}
        >
          <h4
            style={{
              margin: "0 0 12px 0",
              color: "var(--text-primary)",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Altitude (m)
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Minimum</span>
              <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>
                {statistics.minAltitude.toFixed(0)}m
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Maximum</span>
              <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>
                {statistics.maxAltitude.toFixed(0)}m
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Dénivelé</span>
              <span style={{ color: "var(--accent-primary)", fontWeight: "600" }}>
                {(statistics.maxAltitude - statistics.minAltitude).toFixed(0)}m
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataSummary
