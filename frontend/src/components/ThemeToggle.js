"use client"

const ThemeToggle = ({ theme, onToggle }) => {
  return (
    <button
      className="theme-toggle-modern"
      onClick={onToggle}
      title={`Basculer vers le thème ${theme === "dark" ? "clair" : "sombre"}`}
      style={{
        background: "none", // supprime le fond
        border: "none",     // supprime les bordures par défaut
        cursor: "pointer",
        padding: "0",       // évite les marges internes
      }}
    >
      <div
        className="toggle-track"
        style={{
          width: "60px",   // largeur du toggle
          height: "34px",  // hauteur du toggle
          borderRadius: "20px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: theme === "dark" ? "flex-end" : "flex-start",
          padding: "4px",
        }}
      >
        <div
          className={`toggle-thumb ${theme === "dark" ? "dark" : "light"}`}
          style={{
            width: "28px",   // taille du bouton rond
            height: "28px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
        >
          {theme === "dark" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="5" />
              <path d="m12 1-1 1v4l1 1 1-1V2l-1-1zM21 11l-1 1h-4l-1-1 1-1h4l1 1zM12 21l-1 1 1 1 1-1v-4l-1-1-1 1v4zM4.22 4.22l-1.42 1.42 2.83 2.83 1.42-1.42L4.22 4.22zM16.36 16.36l-1.42 1.42 2.83 2.83 1.42-1.42-2.83-2.83zM1 12l1-1h4l1 1-1 1H2l-1-1zM19.78 19.78l1.42-1.42-2.83-2.83-1.42 1.42 2.83 2.83z" />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}

export default ThemeToggle
