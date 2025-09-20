"use client"

import { useState, useEffect, useMemo } from "react"
import MapContainer from "./pages/mapcontainer"
import PanelInfo from "./pages/panelinfo"
import Navbar from "./components/Navbar"
import StatsPanel from "./pages/StatsPanel"
import "./index.css"

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [theme, setTheme] = useState("dark")

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

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])
const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${backendUrl}/data`)
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données")
      }
      const result = await response.json()
      setData(result)
      console.log(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Chargement des données minières...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <Navbar theme={theme} onToggle={toggleTheme} />
      <div className="app-body">
        <PanelInfo data={data} selectedPoint={selectedPoint} onPointSelect={setSelectedPoint} statistics={statistics} />
        <div className="main-content">
          <MapContainer data={data} selectedPoint={selectedPoint} onPointSelect={setSelectedPoint} theme={theme} />
        </div>
        <StatsPanel data={data} />
      </div>
    </div>
  )
}

export default App
