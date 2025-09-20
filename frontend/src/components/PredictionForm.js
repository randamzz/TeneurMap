"use client"

import { useState } from "react"

const PredictionForm = () => {
  const [fieldX, setFieldX] = useState("")
  const [fieldY, setFieldY] = useState("")
  const [fieldZ, setFieldZ] = useState("")
  const [prediction, setPrediction] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState("") // état pour le popup

  // Limites
  const X_MIN = 426218
  const X_MAX = 427378
  const Y_MIN = 5839036
  const Y_MAX = 5840356
  const Z_MIN = 8764
  const Z_MAX = 10204

  const instructions = `
1. Les valeurs doivent être NUMÉRIQUES.
2. Utilisez le point '.' comme séparateur décimal (ex: 44.8 et non 44,8).
3. Respectez les plages suivantes :
   - X : ${X_MIN} à ${X_MAX}
   - Y : ${Y_MIN} à ${Y_MAX}
   - Z : ${Z_MIN} à ${Z_MAX}
4. Aucun caractère non numérique n'est autorisé.
`

  const handleSubmit = async (e) => {
    e.preventDefault()

    const x = Number.parseFloat(fieldX.replace(",", "."))
    const y = Number.parseFloat(fieldY.replace(",", "."))
    const z = Number.parseFloat(fieldZ.replace(",", "."))

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      setError(`Erreur : Les valeurs doivent être numériques.\n${instructions}`)
      return
    }

    if (x < X_MIN || x > X_MAX || y < Y_MIN || y > Y_MAX || z < Z_MIN || z > Z_MAX) {
      setError(`Erreur : Une ou plusieurs valeurs sont hors limites.\n${instructions}`)
      return
    }

    setError("")
    setIsCalculating(true)
const backendUrl = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await fetch(`${backendUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ X: x, Y: y, Z: z }),
      })

      if (!response.ok) {
        const err = await response.json()
        setError(`Erreur serveur: ${err.detail || "Impossible de prédire"}\n${instructions}`)
        setPrediction(null)
        return
      }

      const data = await response.json()
      setPrediction(data.prediction)
    } catch (err) {
      console.error(err)
      setError(`Erreur de communication avec le serveur.\n${instructions}`)
      setPrediction(null)
    } finally {
      setIsCalculating(false)
    }
  }

  // Fonction pour vider les champs et fermer le popup
  const handleClearFields = () => {
    setFieldX("")
    setFieldY("")
    setFieldZ("")
    setPrediction(null)
    setError("")
  }

  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 16px 0", color: "var(--text-primary)" }}>
        Prédiction
      </h2>

      <form className="prediction-form-sidebar" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fieldX">Valeur X</label>
          <input
            id="fieldX"
            type="text"
            value={fieldX}
            onChange={(e) => setFieldX(e.target.value)}
            placeholder="426218.951"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="fieldY">Valeur Y</label>
          <input
            id="fieldY"
            type="text"
            value={fieldY}
            onChange={(e) => setFieldY(e.target.value)}
            placeholder="5839036"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="fieldZ">Valeur Z</label>
          <input
            id="fieldZ"
            type="text"
            value={fieldZ}
            onChange={(e) => setFieldZ(e.target.value)}
            placeholder="8764.087675"
            className="form-input"
          />
        </div>

        <button type="submit" className="predict-button-sidebar" disabled={isCalculating}>
          {isCalculating ? "Calcul..." : "Prédire"}
        </button>
      </form>

      {prediction !== null && (
        <div className="prediction-result-sidebar">
          <span className="result-label">Résultat:</span>
          <span className="result-value">{prediction.toFixed(2)} %</span>
        </div>
      )}

      {error && (
        <div className="modal-overlay" onClick={() => setError("")}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Instructions de saisie</h3>
              <button className="modal-close" onClick={() => setError("")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <pre>{error}</pre>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={handleClearFields}>
                Compris
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .form-group { display: flex; flex-direction: column; margin-bottom: 12px; }
        .form-group label { margin-bottom: 2px; font-weight: 500; }
        .form-input { padding: 6px 10px; border-radius: 8px; border: 1px solid #ccc; font-size: 14px; outline: none; }
        .form-input:focus { border-color: #0070f3; box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2); }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .modal-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--mining-surface-elevated);
          border: 1px solid var(--mining-border);
          border-radius: 16px;
          max-width: 500px;
          width: 90vw;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
          animation: slideIn 0.3s ease-out;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 24px 16px 24px;
          border-bottom: 1px solid var(--mining-border);
        }

        .modal-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(245, 158, 11, 0.1);
          border-radius: 12px;
          color: var(--mining-accent-primary);
          flex-shrink: 0;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--mining-text-primary);
          flex: 1;
        }

        .modal-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--mining-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: var(--mining-surface);
          color: var(--mining-text-primary);
        }

        .modal-body {
          padding: 20px 24px;
          max-height: 400px;
          overflow-y: auto;
        }

        .modal-body pre {
          background: var(--mining-surface);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--mining-border);
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-size: 14px;
          line-height: 1.5;
          color: var(--mining-text-primary);
          white-space: pre-wrap;
          word-wrap: break-word;
          margin: 0;
        }

        .modal-footer {
          padding: 16px 24px 24px 24px;
          display: flex;
          justify-content: flex-end;
        }

        .modal-button {
          padding: 12px 24px;
          background: var(--mining-accent-primary);
          color: var(--mining-background);
          border: none;
          border-radius: 10px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
        }

        .modal-button:hover {
          background: var(--mining-accent-secondary);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
        }

        .modal-button:active {
          transform: translateY(0);
        }

        /* Responsive design */
        @media (max-width: 640px) {
          .modal-content {
            width: 95vw;
            margin: 20px;
          }
          
          .modal-header {
            padding: 20px 20px 12px 20px;
          }
          
          .modal-body {
            padding: 16px 20px;
          }
          
          .modal-footer {
            padding: 12px 20px 20px 20px;
          }
        }
      `}</style>
    </div>
  )
}

export default PredictionForm