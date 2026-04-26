import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"]
});

export default function UserTracker() {
  const user = JSON.parse(localStorage.getItem("user"));
  const mission = JSON.parse(localStorage.getItem("activeMission"));

  useEffect(() => {
    if (!user || !mission) return;

    const watchId = navigator.geolocation.watchPosition((pos) => {
      socket.emit("send-location", {
        userId: user.id,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        missionId: mission.id,
        role: "user" // 🔥 IMPORTANT
      });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return null;
}