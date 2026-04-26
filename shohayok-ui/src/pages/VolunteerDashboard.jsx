import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

export default function VolunteerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const mission = JSON.parse(localStorage.getItem("activeMission"));

  useEffect(() => {
    if (!mission || !user) return;

    let lastSent = 0;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();

        // 🔥 send প্রতি 3 সেকেন্ডে একবার (VERY IMPORTANT)
        if (now - lastSent < 3000) return;

        lastSent = now;

        socket.emit("send-location", {
          userId: user.id,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          missionId: mission.id,
          role: "volunteer"
        });
      },
      (err) => console.error(err),
      {
        enableHighAccuracy: true,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return <div>📡 Tracking (low usage mode)...</div>;
}