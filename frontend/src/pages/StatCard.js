const StatCard = ({ label, value, color, subtitle }) => {
  return (
    <div
      style={{
        background: "var(--surface-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "16px",
        transition: "all 0.3s ease",
        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            fontWeight: "500",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: color || "var(--text-primary)",
          lineHeight: "1.2",
        }}
      >
        {value}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            marginTop: "4px",
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  )
}

export default StatCard
