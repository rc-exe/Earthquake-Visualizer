import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet"; // Import React Leaflet map components
import "leaflet/dist/leaflet.css"; // Leaflet default CSS
import L from "leaflet"; // Leaflet library core

// ============================
// FIX DEFAULT LEAFLET ICONS
// ============================
// Without this fix, markers may not appear properly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function App() {
  // ============================
  // STATE VARIABLES
  // ============================
  const [earthquakes, setEarthquakes] = useState([]); // stores earthquake data
  const [lastUpdated, setLastUpdated] = useState(null); // stores timestamp of last update

  // ============================
  // FETCH FUNCTION
  // ============================
  const fetchEarthquakeData = () => {
    console.log("Fetching earthquake data..."); // TRACE LOG
    fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Data received:", data); // TRACE LOG
        setEarthquakes(data.features || []); // save features to state
        setLastUpdated(new Date()); // save fetch time
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  // ============================
  // EFFECT HOOK
  // ============================
  useEffect(() => {
    // Initial fetch
    fetchEarthquakeData();

    // Set up interval to refresh every 5 minutes
    const interval = setInterval(fetchEarthquakeData, 5 * 60 * 1000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  // ============================
  // MAP BOUNDS
  // ============================
  const worldBounds = [
    [-90, -180], // Southwest corner of the world
    [90, 180],   // Northeast corner of the world
  ];

  // ============================
  // UI LAYOUT
  // ============================
  return (
    <div className="h-screen w-screen bg-gray-900 text-white relative flex flex-col">
      {/* ================= HEADER ================= */}
      {/* Fixed header bar, always visible at top */}
      <div className="fixed top-0 left-0 w-full text-center p-4 bg-blue-600 text-white font-bold text-xl shadow-md z-[1000]">
        🌍 Earthquake Visualizer
      </div>

      {/* ================= INFO SECTION ================= */}
      {/* Displays instructions + update interval + last updated time */}
      <div className="fixed top-14 left-0 w-full px-6 py-3 bg-gray-800 text-sm md:text-base text-center shadow-md z-[999]">
        <p>
          This application displays{" "}
          <span className="font-semibold">real-time global earthquakes</span>{" "}
          on an interactive map using data from the{" "}
          <a
            href="https://earthquake.usgs.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-400"
          >
            USGS Earthquake API
          </a>
          .
        </p>
        <p className="mt-1 text-gray-300">
          🔄 Earthquake data is refreshed automatically every{" "}
          <span className="font-semibold">5 minutes</span>.
        </p>
        {lastUpdated && (
          <p className="mt-1 text-gray-400 text-xs">
            ⏰ Last Updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* ================= MAP SECTION ================= */}
      {/* Fills the screen below header & above footer */}
      <div className="pt-36 pb-12 flex-1 flex justify-center items-center">
        {/*
          Responsive behavior:
          - Mobile: map takes full screen height/width
          - Desktop: maintain 16:9 widescreen ratio
        */}
        <div className="w-full h-full md:h-auto md:aspect-[16/9] md:max-w-screen-2xl">
          <MapContainer
            center={[20, 0]}          // Initial map center
            zoom={2}                  // Default zoom
            minZoom={2}               // Prevent zooming out infinitely
            maxZoom={12}              // Prevent too much zoom in
            maxBounds={worldBounds}   // Lock map bounds
            maxBoundsViscosity={1.0}  // Prevent dragging beyond bounds
            scrollWheelZoom={true}    // Allow zoom with mouse wheel
            className="h-full w-full"
            worldCopyJump={false}
            dragging={true}
          >
            {/* --- Tile Layer: background map (OpenStreetMap) --- */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              noWrap={true} // prevent repeating map copies
            />

            {/* --- Markers: Plot each earthquake --- */}
            {earthquakes.map((eq) => {
              const [lon, lat, depth] = eq.geometry.coordinates; // GeoJSON coordinates = [lon, lat, depth]
              console.log("Placing marker at:", lat, lon); // TRACE LOG
              return (
                <Marker key={eq.id} position={[lat, lon]}>
                  <Popup>
                    <strong>{eq.properties.place}</strong>
                    <br />
                    Magnitude: {eq.properties.mag}
                    <br />
                    Depth: {depth} km
                    <br />
                    Time: {new Date(eq.properties.time).toLocaleString()}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      {/* Fixed footer at bottom of screen */}
      <div className="fixed bottom-0 left-0 w-full text-center p-3 bg-gray-800 text-gray-300 text-sm shadow-inner z-[1000]">
        © Created by <span className="font-semibold">Ritesh Chakramani</span>
      </div>
    </div>
  );
}
