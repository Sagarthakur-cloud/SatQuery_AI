import { useEffect, useState } from "react";

import {
  Search,
  MapPin,
  Satellite,
  ScanSearch,
  Loader2,
  Send,
  Navigation,
  Sparkles,
  X,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import Sidebar from "../components/Sidebar";


// =========================================
// LEAFLET MARKER FIX
// =========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// =========================================
// MAP CLICK LOCATION SELECTOR
// =========================================

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;

      onSelect({
        lat,
        lng,
        name: "Selected Location",
      });
    },
  });

  return null;
}


// =========================================
// MOVE MAP TO SELECTED LOCATION
// =========================================

function MapController({ location }) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    map.flyTo(
      [location.lat, location.lng],
      13,
      {
        duration: 1.2,
      }
    );
  }, [location, map]);

  return null;
}


// =========================================
// MAIN COMPONENT
// =========================================

function MapExplorer({
  onNavigate,
  theme,
  onToggleTheme,
}) {

  // Search
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);

  // Selected location
  const [selectedLocation, setSelectedLocation] =
    useState(null);

  // Query
  const [query, setQuery] = useState("");

  // AI answer
  const [answer, setAnswer] = useState("");
  const [answerLoading, setAnswerLoading] =
    useState(false);

  // Map type
  const [mapType, setMapType] = useState("street");

  // Default map position
  const defaultCenter = [
    22.9734,
    78.6569,
  ];


  // =========================================
  // SEARCH LOCATION
  // =========================================

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!searchText.trim()) return;

    try {
      setSearching(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchText
        )}&limit=1`
      );

      const data = await response.json();

      if (!data.length) {
        alert(
          "Location not found. Try another place."
        );

        return;
      }

      const result = data[0];

      const location = {
        lat: Number(result.lat),
        lng: Number(result.lon),
        name: result.display_name,
      };

      setSelectedLocation(location);

    } catch (error) {
      console.error(error);

      alert(
        "Unable to search location. Please try again."
      );

    } finally {
      setSearching(false);
    }
  };


  // =========================================
  // CLEAR SEARCH
  // =========================================

  const clearSearch = () => {
    setSearchText("");
  };


  // =========================================
  // SELECT LOCATION FROM MAP
  // =========================================

  const handleMapLocationSelect = (location) => {
    setSelectedLocation(location);

    // Clear previous answer when location changes
    setAnswer("");
  };


  // =========================================
  // AI QUERY
  // =========================================

  const handleGetAnswer = () => {

    if (!selectedLocation) {
      alert(
        "Please search or select a location on the map first."
      );

      return;
    }

    if (!query.trim()) {
      alert(
        "Please enter your satellite analysis query."
      );

      return;
    }

    setAnswerLoading(true);
    setAnswer("");

    // Frontend prototype response
    setTimeout(() => {

      setAnswer(
        `SatQuery AI analyzed the selected region around ${selectedLocation.lat.toFixed(
          4
        )}° N, ${selectedLocation.lng.toFixed(
          4
        )}° E. For the query "${query}", the system would inspect satellite imagery for water bodies, vegetation, agriculture, urban structures and other spatial features. This is currently a frontend prototype and can be connected to the AI analysis API later.`
      );

      setAnswerLoading(false);

    }, 1200);
  };


  // =========================================
  // SUGGESTED QUERY
  // =========================================

  const useSuggestedQuery = (text) => {
    setQuery(text);
    setAnswer("");
  };


  return (
    <div className="app-layout">


      {/* =====================================
          SIDEBAR
      ===================================== */}

      <Sidebar
        active="map"
        onNavigate={onNavigate}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="dashboard map-page">


        {/* =====================================
            PAGE CONTENT
        ===================================== */}

        <div className="real-map-content">


          {/* =====================================
              PAGE HEADING
          ===================================== */}

          <div className="map-page-heading">

            <div>

              <span className="page-eyebrow">
                GEOSPATIAL WORKSPACE
              </span>

              <h1>
                Explore Earth
              </h1>

              <p>
                Search any location, select a point
                and ask SatQuery AI about the region.
              </p>

            </div>


            <button
              type="button"
              className="map-new-analysis"
              onClick={() =>
                onNavigate("analysis")
              }
            >

              <ScanSearch size={16} />

              New Analysis

            </button>

          </div>


          {/* =====================================
              SEARCH BAR
          ===================================== */}

          <form
            className="real-map-search"
            onSubmit={handleSearch}
          >

            <Search size={18} />


            <input
              type="text"
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value
                )
              }
              placeholder="Search city, landmark, district or region..."
            />


            {searchText && (
              <button
                type="button"
                className="clear-search"
                onClick={clearSearch}
              >

                <X size={15} />

              </button>
            )}


            <button
              type="submit"
              className="map-search-button"
              disabled={searching}
            >

              {searching ? (
                <Loader2
                  size={15}
                  className="spin"
                />
              ) : (
                <Search size={15} />
              )}

              {searching
                ? "Searching..."
                : "Search"}

            </button>

          </form>


          {/* =====================================
              MAP + RIGHT QUERY PANEL
          ===================================== */}

          <div className="map-explorer-grid">


            {/* ===================================
                LEFT — MAP
            =================================== */}

            <section className="real-map-card">

              <div className="real-map-wrapper">

                <MapContainer
                  center={defaultCenter}
                  zoom={5}
                  scrollWheelZoom={true}
                  className="leaflet-map"
                >

                  {/* STREET MAP */}

                  {mapType === "street" ? (
                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  ) : (

                    /* SATELLITE MAP */

                    <TileLayer
                      attribution="Tiles &copy; Esri"
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />

                  )}


                  {/* CLICK LOCATION */}

                  <LocationSelector
                    onSelect={
                      handleMapLocationSelect
                    }
                  />


                  {/* SEARCH LOCATION */}

                  <MapController
                    location={
                      selectedLocation
                    }
                  />


                  {/* MARKER */}

                  {selectedLocation && (
                    <Marker
                      position={[
                        selectedLocation.lat,
                        selectedLocation.lng,
                      ]}
                    >

                      <Popup>

                        <strong>
                          Selected Location
                        </strong>

                        <br />

                        {selectedLocation.name}

                        <br />

                        {selectedLocation.lat.toFixed(
                          5
                        )}

                        {" , "}

                        {selectedLocation.lng.toFixed(
                          5
                        )}

                      </Popup>

                    </Marker>
                  )}

                </MapContainer>


                {/* MAP TYPE */}

                <div className="map-type-switch">

                  <button
                    type="button"
                    className={
                      mapType === "street"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setMapType("street")
                    }
                  >

                    <MapPin size={14} />

                    Map

                  </button>


                  <button
                    type="button"
                    className={
                      mapType === "satellite"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setMapType("satellite")
                    }
                  >

                    <Satellite size={14} />

                    Satellite

                  </button>

                </div>


                {/* MAP HINT */}

                <div className="map-click-hint">

                  <MapPin size={14} />

                  Click anywhere on the map
                  to select a location

                </div>

              </div>

            </section>


            {/* ===================================
                RIGHT — QUERY PANEL
            =================================== */}

            <aside className="map-query-panel">


              {/* =================================
                  LOCATION DETAILS
              ================================= */}

              <section className="map-info-panel">

                <div className="map-info-title">

                  <Navigation size={17} />

                  <div>

                    <small>
                      SELECTED LOCATION
                    </small>

                    <strong>
                      Location Details
                    </strong>

                  </div>

                </div>


                {selectedLocation ? (
                  <>

                    <div className="selected-place-name">

                      <MapPin size={16} />

                      <span>
                        {selectedLocation.name}
                      </span>

                    </div>


                    <div className="map-coordinate-grid">

                      <div>

                        <small>
                          LATITUDE
                        </small>

                        <strong>
                          {selectedLocation.lat.toFixed(
                            5
                          )}
                          °
                        </strong>

                      </div>


                      <div>

                        <small>
                          LONGITUDE
                        </small>

                        <strong>
                          {selectedLocation.lng.toFixed(
                            5
                          )}
                          °
                        </strong>

                      </div>

                    </div>


                    <div className="location-ready">

                      <span></span>

                      Location ready for analysis

                    </div>

                  </>

                ) : (

                  <div className="no-location-selected">

                    <MapPin size={25} />

                    <strong>
                      Select a location
                    </strong>

                    <p>
                      Search above or click
                      anywhere on the map.
                    </p>

                  </div>

                )}

              </section>


              {/* =================================
                  AI QUERY
              ================================= */}

              <section className="map-query-section">

                <div className="map-query-header">

                  <div className="query-ai-icon">

                    <Sparkles size={16} />

                  </div>


                  <div>

                    <h2>
                      Ask SatQuery AI
                    </h2>

                    <p>
                      Ask about this location.
                    </p>

                  </div>

                </div>


                {/* QUERY */}

                <div className="map-query-box">

                  <textarea
                    value={query}
                    onChange={(event) =>
                      setQuery(
                        event.target.value
                      )
                    }
                    placeholder="Ask something about this region..."
                  />


                  <button
                    type="button"
                    onClick={
                      handleGetAnswer
                    }
                    disabled={
                      answerLoading
                    }
                  >

                    {answerLoading ? (
                      <Loader2
                        size={15}
                        className="spin"
                      />
                    ) : (
                      <Send size={15} />
                    )}

                    {answerLoading
                      ? "Analyzing..."
                      : "Get Answer"}

                  </button>

                </div>


                {/* SUGGESTED QUERIES */}

                <div className="map-suggested-queries">

                  <span>
                    Try:
                  </span>


                  <button
                    type="button"
                    onClick={() =>
                      useSuggestedQuery(
                        "Identify all water bodies in this region"
                      )
                    }
                  >
                    Water
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      useSuggestedQuery(
                        "Detect vegetation and forest coverage"
                      )
                    }
                  >
                    Vegetation
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      useSuggestedQuery(
                        "Identify urban development in this area"
                      )
                    }
                  >
                    Urban
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      useSuggestedQuery(
                        "Analyze agricultural land around this location"
                      )
                    }
                  >
                    Agriculture
                  </button>

                </div>


                {/* =================================
                    AI ANSWER
                ================================= */}

                {(answerLoading || answer) && (

                  <div className="map-ai-answer">

                    <div className="map-answer-heading">

                      <Sparkles size={15} />

                      <strong>
                        SatQuery AI Response
                      </strong>

                    </div>


                    {answerLoading ? (

                      <div className="answer-loading">

                        <Loader2
                          size={17}
                          className="spin"
                        />

                        Analyzing selected
                        region...

                      </div>

                    ) : (

                      <p>
                        {answer}
                      </p>

                    )}

                  </div>

                )}

              </section>

            </aside>

          </div>

        </div>

      </main>

    </div>
  );
}


export default MapExplorer;