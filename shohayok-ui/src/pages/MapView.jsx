import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import mapboxgl from "mapbox-gl";
import { io } from "socket.io-client";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MAX_LOAD = 50;

// 🔥 single socket (lazy connect)
let socket;

export default function MapView() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markers = useRef({});
  const [blocked, setBlocked] = useState(false);
  const [loads, setLoads] = useState(0);

  useEffect(() => {
    let currentLoads = Number(localStorage.getItem("map_loads") || 0);

    // 🔥 check আগে
    if (currentLoads >= MAX_LOAD) {
      setBlocked(true);
      return;
    }

    // 🔥 increment safe way
    currentLoads++;
    localStorage.setItem("map_loads", currentLoads);
    setLoads(currentLoads);

    console.log("🧭 Map Loads:", currentLoads);

    // 🔥 create socket only when needed
    socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    // 🔥 prevent multiple map init
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [90.4125, 23.8103],
      zoom: 8
    });

    // 🔥 receive location
    socket.on("receive-location", ({ userId, lat, lng, role }) => {
  let color = "gray";
  let label = "Unknown";

  if (role === "volunteer") {
    color = "blue";
    label = "Volunteer 🚑";
  } else if (role === "user") {
    color = "red";
    label = "User 🆘";
  } else if (role === "head") {
    color = "green";
    label = "Team Lead 🧭";
  }

  // 🔥 update existing marker
  if (markers.current[userId]) {
    markers.current[userId].setLngLat([lng, lat]);
  } else {
    const el = document.createElement("div");
    el.style.width = "12px";
    el.style.height = "12px";
    el.style.borderRadius = "50%";
    el.style.background = color;
    el.style.border = "2px solid white";

    const marker = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup().setHTML(
          `<b>${label}</b><br/>ID: ${userId.slice(0, 6)}`
        )
      )
      .addTo(mapRef.current);

    markers.current[userId] = marker;
  }
});

    socket.on("stop-tracking", () => {
      Object.values(markers.current).forEach((m) => m.remove());
      markers.current = {};
    });

    // 🔥 cleanup
    return () => {
      if (socket) {
        socket.disconnect();
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 🔥 BLOCK UI
  if (blocked) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>🚫 Map Disabled</h2>
          <p>Usage limit reached (50 loads)</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* 🔥 usage indicator */}
      <p style={{
        position: "absolute",
        top: 10,
        left: 10,
        color: "white",
        zIndex: 10
      }}>
        🧭 Loads: {loads}
      </p>

      <div ref={containerRef} style={{ height: "90vh" }} />
    </div>
  );
}