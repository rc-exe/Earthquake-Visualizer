 🌍 Earthquake Visualizer

A React-based web application that displays real-time earthquake data on
an interactive world map using React Leaflet and the USGS
Earthquake API.

------------------------------------------------------------------------

 🚀 Features

-   Fetches live earthquake data from the USGS GeoJSON feed.
-   Displays earthquakes as markers on an interactive map.
-   Shows details in a popup:
    -   Location
    -   Magnitude
    -   Depth
    -   Time (localized)
-   World bounds are enforced to prevent panning outside the map.
-   Responsive UI with a simple header.

------------------------------------------------------------------------

 🛠️ Tech Stack

-   React (frontend framework)
-   React-Leaflet (map rendering)
-   Leaflet.js (map library)
-   Tailwind CSS (styling)
-   USGS Earthquake API (live data)

------------------------------------------------------------------------

 📦 Installation

1.  Clone the repository:

     bash
    git clone https://github.com/your-username/earthquake-visualizer.git
    cd earthquake-visualizer
    

2.  Install dependencies:

     bash
    npm install
    

3.  Start the development server:

     bash
    npm run dev    for Vite
     or
    npm start      for CRA
    

------------------------------------------------------------------------

 🌐 Data Source

This app uses the USGS Earthquake GeoJSON Feed:\
<https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php>

Currently, it fetches earthquakes from the past 24 hours:

    https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson

------------------------------------------------------------------------



 ⚙️ Project Structure

    src/
    │── App.js            Main React component
    │── index.css         Tailwind + Leaflet CSS
    │── main.jsx / index.js

------------------------------------------------------------------------

 🔮 Future Enhancements

-   Add magnitude-based marker colors (green/yellow/red).
-   Show earthquake intensity heatmap.
-   Add filters (e.g., by region or magnitude).
-   Fullscreen toggle and zoom controls.

------------------------------------------------------------------------

