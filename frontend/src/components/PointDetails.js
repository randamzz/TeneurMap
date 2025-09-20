"use client"

const PointDetails = ({ point, onClose }) => {
  const getColorByTeneur = (teneur) => {
    const normalized = (teneur - 2.1328) / (13.456 - 2.1328)

    if (normalized < 0.25) return "#3b82f6"
    if (normalized < 0.5) return "#10b981"
    if (normalized < 0.75) return "#f59e0b"
    return "#ef4444"
  }

  const getTeneurCategory = (teneur) => {
    if (teneur < 5) return "Faible"
    if (teneur < 8) return "Moyenne"
    if (teneur < 11) return "Élevée"
    return "Très élevée"
  }

  return (
    <div
      style={{
        background: "var(--surface-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "20px",
        boxShadow: "var(--shadow-lg)",
        animation: "slideIn 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Point Sélectionné
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "20px",
            padding: "4px",
            borderRadius: "4px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "var(--border)"
            e.target.style.color = "var(--text-primary)"
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "none"
            e.target.style.color = "var(--text-secondary)"
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
          }}
        >
          <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>ID</span>
          <span
            style={{
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            {point.id}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
          }}
        >
          <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Teneur</span>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                color: getColorByTeneur(point.teneur),
                fontWeight: "700",
                fontSize: "18px",
              }}
            >
              {point.teneur.toFixed(3)}%
            </div>
            <div
              style={{
                color: "var(--text-muted)",
                fontSize: "12px",
              }}
            >
              {getTeneurCategory(point.teneur)}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
          }}
        >
          <div
            style={{
              padding: "10px",
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            >
              X
            </div>
            <div
              style={{
                color: "var(--text-primary)",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {point.X.toFixed(1)}
            </div>
          </div>
          <div
            style={{
              padding: "10px",
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            >
              Y
            </div>
            <div
              style={{
                color: "var(--text-primary)",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {point.Y.toFixed(1)}
            </div>
          </div>
          <div
            style={{
              padding: "10px",
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "12px",
                marginBottom: "4px",
              }}
            >
              Z (Alt.)
            </div>
            <div
              style={{
                color: "var(--text-primary)",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              {point.Z.toFixed(0)}m
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default PointDetails
