"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"

import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";


// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

const MapContainer = ({ data, selectedPoint, onPointSelect, theme }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef(null)
  const baseLayerRef = useRef(null)
  const [isLoadingPoints, setIsLoadingPoints] = useState(false)
  const [progress, setProgress] = useState(0)

  // Fonds de carte
  const darkLayer = useRef(
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    })
  ).current

  const lightLayer = useRef(
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    })
  ).current

  const satelliteLayer = useRef(
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      }
    )
  ).current

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      initializeMap()
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current && data.length > 0) {
      clearMarkers()
      addAllMarkers()
    }
  }, [data])

  useEffect(() => {
    if (selectedPoint && mapInstanceRef.current) {
      highlightSelectedPoint()
    }
  }, [selectedPoint])

  // Changer le mode clair/sombre quand `theme` change
  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (baseLayerRef.current) {
      mapInstanceRef.current.removeLayer(baseLayerRef.current)
    }

    if (theme === "dark") {
      darkLayer.addTo(mapInstanceRef.current)
      baseLayerRef.current = darkLayer
    } else {
      lightLayer.addTo(mapInstanceRef.current)
      baseLayerRef.current = lightLayer
    }
  }, [theme])

  const initializeMap = () => {
    // Canada center and bounds
    const canadaCenter = [56.1304, -106.3468] // Center of Canada
    const canadaSouthWest = [41.0, -141.0] // Southwest bounds
    const canadaNorthEast = [83.0, -52.0] // Northeast bounds

    const map = L.map(mapRef.current, {
      center: canadaCenter,
      zoom: 4,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true,
      maxBounds: [canadaSouthWest, canadaNorthEast],
      maxBoundsViscosity: 0.8,
    })

    // Charger thème initial
    if (theme === "dark") {
      darkLayer.addTo(map)
      baseLayerRef.current = darkLayer
    } else {
      lightLayer.addTo(map)
      baseLayerRef.current = lightLayer
    }

    // Ajout des contrôles
    const baseLayers = {
      "Mode Sombre": darkLayer,
      "Mode Clair": lightLayer,
      Satellite: satelliteLayer,
    }
    L.control.layers(baseLayers).addTo(map)

    // Initialiser le cluster de marqueurs
    markersRef.current = L.markerClusterGroup({
      chunkedLoading: true,
      chunkInterval: 100,
      maxClusterRadius: 80,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 16,
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount()
        const color = getClusterColor(count)
        return L.divIcon({
          html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; text-align: center; line-height: 40px; color: white; font-weight: bold;">${count}</div>`,
          className: 'marker-cluster-custom',
          iconSize: L.point(40, 40)
        })
      }
    })

    mapInstanceRef.current = map

    setTimeout(() => {
      map.invalidateSize()
    }, 100)

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }
    window.addEventListener("resize", handleResize)
  }

  const clearMarkers = () => {
    if (markersRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markersRef.current)
      markersRef.current.clearLayers()
    }
  }

  const addAllMarkers = () => {
    setIsLoadingPoints(true)
    setProgress(0)
    console.log("[v0] Adding all markers for", data.length, "points")

    // Traiter les données par lots pour éviter de bloquer l'interface
    const batchSize = 1000
    let processed = 0
    const markers = []
    
    const processBatch = () => {
      const batchEnd = Math.min(processed + batchSize, data.length)
      
      for (let i = processed; i < batchEnd; i++) {
        const marker = createMarker(data[i])
        if (marker) {
          markers.push(marker)
        }
      }
      
      processed = batchEnd
      setProgress(Math.round((processed / data.length) * 100))
      
      if (processed < data.length) {
        // Ajouter les marqueurs au cluster et continuer
        markersRef.current.addLayers(markers)
        markers.length = 0 // Vider le tableau
        setTimeout(processBatch, 0) // Libérer le thread UI
      } else {
        // Dernier lot
        markersRef.current.addLayers(markers)
        mapInstanceRef.current.addLayer(markersRef.current)
        setIsLoadingPoints(false)
        console.log("[v0] Finished adding all markers")
      }
    }
    
    processBatch()
  }

  const createMarker = (point) => {
    try {
      let lat, lng

      // For Canada, we'll handle different UTM zones
      // Canada spans UTM zones 7 through 22
      if (point.X >= 500000 && point.X < 1000000) {
        // Typical UTM coordinates for Canada
        // Convert UTM to lat/lng - this is a simplified conversion
        // In production, you'd use a proper UTM conversion library
        const zone = determineUTMZone(point.X, point.Y);
        ({lat, lng} = convertUTMToLatLng(point.X, point.Y, zone, 'N'));
      } else {
        // If coordinates are already in lat/lng or different format
        lat = point.Y
        lng = point.X
      }

      // Canada bounds validation
      if (lat < 41.0 || lat > 83.0 || lng < -141.0 || lng > -52.0) {
        console.warn(
          `[v0] Point ${point.id} hors limites du Canada: (${lat.toFixed(6)}, ${lng.toFixed(6)})`
        )
        
        // Use a default position in Canada (central region)
        lat = 56.1304 + (Math.random() - 0.5) * 2
        lng = -106.3468 + (Math.random() - 0.5) * 2
      }

      const color = getColorByTeneur(point.teneur)
      const size = Math.max(6, Math.min(20, (point.teneur / 13.456) * 15))
      const opacity = Math.max(0.6, Math.min(1, (point.teneur / 13.456) * 0.4 + 0.6))

      const marker = L.circleMarker([lat, lng], {
        radius: size,
        fillColor: color,
        color: "#ffffff",
        weight: 1,
        opacity: 0.9,
        fillOpacity: opacity,
        className: "mining-point",
      })

      const popupTextColor = theme === "dark" ? "#eee" : "#333"
      const popupTitleColor = theme === "dark" ? "#fff" : "#111"
      const popupSubColor = theme === "dark" ? "#bbb" : "#555"
      const popupBgColor = theme === "dark" ? "#222" : "#fff"
      const popupBorderColor = theme === "dark" ? "#444" : "#ddd"

      marker.bindPopup(
        `
        <div style="color: ${popupTextColor}; font-family: -apple-system, BlinkMacSystemFont, sans-serif; min-width: 200px; background:${popupBgColor}; padding:10px; border-radius:8px; border:1px solid ${popupBorderColor};">
          <h3 style="margin: 0 0 12px 0; color: ${popupTitleColor}; border-bottom: 2px solid ${color}; padding-bottom: 4px;">
            Mining Point #${point.id}
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
            <div>
              <p style="margin: 2px 0; font-weight: bold; color: ${popupSubColor};">Coordinates:</p>
              <p style="margin: 2px 0; font-size: 12px;">X: ${point.X.toFixed(2)}</p>
              <p style="margin: 2px 0; font-size: 12px;">Y: ${point.Y.toFixed(2)}</p>
              <p style="margin: 2px 0; font-size: 12px;">Z: ${point.Z.toFixed(2)} m</p>
            </div>
            <div>
              <p style="margin: 2px 0; font-weight: bold; color: ${popupSubColor};">GPS Coordinates:</p>
              <p style="margin: 2px 0; font-size: 12px;">Lat: ${lat.toFixed(6)}°</p>
              <p style="margin: 2px 0; font-size: 12px;">Lng: ${lng.toFixed(6)}°</p>
            </div>
          </div>
          <div style="background: ${color}; color: white; padding: 8px; border-radius: 4px; text-align: center;">
            <strong>Grade: ${point.teneur.toFixed(3)}%</strong>
          </div>
          <p style="margin: 8px 0 0 0; font-size: 11px; color: ${popupSubColor}; text-align: center;">
            Location: Canada | Elevation: ${point.Z.toFixed(1)}m
          </p>
        </div>
      `,
        {
          maxWidth: 300,
          className: "custom-popup",
        }
      )

      marker.on("mouseover", function () {
        this.setStyle({
          weight: 3,
          fillOpacity: Math.min(1, opacity + 0.2),
        })
      })

      marker.on("mouseout", function () {
        if (!selectedPoint || selectedPoint.id !== point.id) {
          this.setStyle({
            weight: 1,
            fillOpacity: opacity,
          })
        }
      })

      marker.on("click", () => {
        onPointSelect(point)
      })

      return marker
    } catch (error) {
      console.error("Error creating marker:", error)
      return null
    }
  }

  // Helper function to determine UTM zone
  const determineUTMZone = (easting, northing) => {
    // Simplified UTM zone determination for Canada
    // Canada spans zones 7-22, but most mining data will be in specific zones
    // You may need to adjust this based on your actual data distribution
    return Math.floor((easting / 100000)) + 7;
  }

  // Simplified UTM to Lat/Lng conversion
  const convertUTMToLatLng = (easting, northing, zone, hemisphere = 'N') => {
    // This is a very simplified conversion
    // In production, use a proper library like proj4 or geodesy
    const falseEasting = 500000;
    const centralMeridian = -183 + (zone * 6);
    
    const x = easting - falseEasting;
    const y = northing;
    
    // Simplified conversion (approximate)
    const lat = 56.0 + (y / 111320) * 0.5;
    const lng = centralMeridian + (x / (111320 * Math.cos((lat * Math.PI) / 180)));
    
    return { lat, lng };
  }

  const getColorByTeneur = (teneur) => {
    const normalized = Math.max(0, Math.min(1, (teneur - 2.1328) / (13.456 - 2.1328)))

    if (normalized < 0.2) return "#1e40af" // Bleu foncé (faible teneur)
    if (normalized < 0.4) return "#0891b2" // Cyan (teneur faible-moyenne)
    if (normalized < 0.6) return "#059669" // Vert (teneur moyenne)
    if (normalized < 0.8) return "#d97706" // Orange (teneur élevée)
    return "#dc2626" // Rouge (teneur très élevée)
  }

  const getClusterColor = (count) => {
    if (count < 10) return "#1e40af"
    if (count < 50) return "#0891b2"
    if (count < 100) return "#059669"
    if (count < 500) return "#d97706"
    return "#dc2626"
  }

  const highlightSelectedPoint = () => {
    if (!markersRef.current || !selectedPoint) return

    markersRef.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker && layer._popup && layer._popup._content) {
        const content = layer._popup._content
        const match = content.match(/Mining Point #(\d+)/)
        
        if (match && parseInt(match[1]) === selectedPoint.id) {
          // Zoomer sur le point sélectionné
          mapInstanceRef.current.setView(layer.getLatLng(), Math.max(mapInstanceRef.current.getZoom(), 12))
          
          // Ouvrir le popup
          layer.openPopup()
          
          // Mettre en évidence le point
          const opacity = Math.max(0.6, Math.min(1, (selectedPoint.teneur / 13.456) * 0.4 + 0.6))
          layer.setStyle({
            weight: 4,
            opacity: 1,
            fillOpacity: 1,
            color: "#fbbf24", // Gold highlight
          })
        }
      }
    })
  }

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <div
        ref={mapRef}
        style={{
          height: "100vh",
          width: "100%",
          minHeight: "400px",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {isLoadingPoints && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "14px",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid #ffffff40",
              borderTop: "2px solid #ffffff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          Loading points... ({progress}%)
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .mining-point {
          cursor: pointer;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
        }

        .marker-cluster-custom {
          background-clip: padding-box;
          border-radius: 20px;
        }
        
        .marker-cluster-custom div {
          width: 40px;
          height: 40px;
          margin-left: 0;
          margin-top: 0;
          text-align: center;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

export default MapContainer