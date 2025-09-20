"use client"

import { useState } from "react"
import ThemeToggle from "./ThemeToggle"

const Navbar = ({ theme, onToggle }) => {
  const [field1, setField1] = useState("")
  const [field2, setField2] = useState("")
  const [prediction, setPrediction] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsCalculating(true)

    setTimeout(() => {
      const sum = Number.parseFloat(field1 || 0) + Number.parseFloat(field2 || 0)
      setPrediction(sum)
      setIsCalculating(false)
    }, 500)
  }

  return (
    <nav className="navbar">
      <div className="navbar-title">
        <h1>Données Minières</h1>
        <p>Visualisation des teneurs au Maroc</p>
      </div>

      <div className="navbar-actions">
        <ThemeToggle theme={theme} onToggle={onToggle} />
      </div>

      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2% 1% ;
          padding-top:3% ;
        }

        .navbar-title {
          display: flex;
          flex-direction: column;
          align-items: flex-start; /* aligne h1 et p à gauche */
        }

        .navbar-title h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: var(--text-primary);
        }

        .navbar-title p {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
        }
      `}</style>
    </nav>
  )
}

export default Navbar
