import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet"; // React Leaflet map components
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet"; // Leaflet core library

// --- Fix Leaflet marker icons (otherwise they won't show in some setups) ---
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
  // --- State to store earthquake data ---
  const [earthquakes, setEarthquakes] = useState([]);
  // --- State to store last updated time ---
  const [lastUpdated, setLastUpdated] = useState(null);

  // --- Function to fetch earthquake data from USGS ---
  const fetchEarthquakeData = () => {
    fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    )
      .then((res) => res.json())
      .then((data) => {
        setEarthquakes(data.features || []); // set earthquakes in state
        setLastUpdated(new Date()); // store last updated timestamp
      })
      .catch((err) => console.error("Error fetching data:", err));
  };

  // --- Fetch earthquake data on initial load + refresh every 5 minutes ---
  useEffect(() => {
    fetchEarthquakeData(); // initial fetch
    const interval = setInterval(fetchEarthquakeData, 5 * 60 * 1000); // 5-minute refresh
    return () => clearInterval(interval); // cleanup interval
  }, []);

  // --- Define world bounds (to prevent infinite scrolling beyond map edges) ---
  const worldBounds = [
    [-90, -180], // Southwest corner
    [90, 180],   // Northeast corner
  ];

  return (
    <div className="h-screen w-screen bg-gray-900 text-white relative">
      {/* --- Header (fixed at top, always visible) --- */}
      <div className="fixed top-0 left-0 w-full text-center p-4 bg-blue-600 text-white font-bold text-xl shadow-md z-[1000]">
        🌍 Earthquake Visualizer
      </div>

      {/* --- Info Section (below header, also fixed) --- */}
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

      {/* --- Map Section (pushed down below header + info using padding) --- */}
      <div className="pt-36 h-full flex justify-center items-center">
        {/*
          RESPONSIVE BEHAVIOR:
          - Mobile: map fills screen (below header/info)
          - Desktop: widescreen 16:9 ratio
        */}
        <div className="w-full h-full md:h-auto md:aspect-[16/9] md:max-w-screen-2xl">
          <MapContainer
            center={[20, 0]}          // Initial center
            zoom={2}                  // Starting zoom level
            minZoom={2}               // Prevent zooming out too far
            maxZoom={12}              // Limit zoom in
            maxBounds={worldBounds}   // Lock map to world bounds
            maxBoundsViscosity={1.0}  // Prevent dragging outside bounds
            scrollWheelZoom={true}
            className="h-full w-full"
            worldCopyJump={false}
            dragging={true}
          >
            {/* --- Map tiles (from OpenStreetMap) --- */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              noWrap={true}
            />

            {/* --- Plot earthquakes --- */}
            {earthquakes.map((eq) => {
              const [lon, lat, depth] = eq.geometry.coordinates;
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
    </div>
  );
}
