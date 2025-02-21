import React, { useState, useEffect } from "react";
import timetableData from "./data/timetable.json";

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSlot, setCurrentSlot] = useState(null);
  const [upcomingSlot, setUpcomingSlot] = useState(null);

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });
    const slots = today === "Friday" ? timetableData.friday : timetableData.slots;
    
    const now = new Date();
    let foundCurrent = null;
    let foundUpcoming = null;

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const [startTime, endTime] = slot.time.split(" TO ").map(t => {
        const [hour, minute, period] = t.match(/(\d+):(\d+) (AM|PM)/).slice(1);
        let hours = parseInt(hour, 10);
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, parseInt(minute, 10));
      });
      
      if (now >= startTime && now <= endTime) {
        foundCurrent = slot;
      } else if (now < startTime && !foundUpcoming) {
        foundUpcoming = slot;
      }
    }
    
    setCurrentSlot(foundCurrent);
    setUpcomingSlot(foundUpcoming);
  }, [currentTime]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", background: "#eef2f3" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>School Timetable</h1>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        <div style={{ flex: 1, background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          {currentSlot ? (
            <div>
              <h2 style={{ color: "#007bff" }}>Ongoing Class ({currentSlot.time})</h2>
              {currentSlot.remedial ? (
                <p><strong>{currentSlot.remedial}</strong> by {currentSlot.teacher}</p>
              ) : (
                <ul>
                  {Object.entries(currentSlot.subjects).map(([className, details]) => (
                    <li key={className}><strong>{className}:</strong> {details.subject} ({details.teacher})</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <h2 style={{ color: "#d9534f" }}>No ongoing class right now</h2>
          )}
        </div>
        <div style={{ width: "30%", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <h2 style={{ color: "#28a745" }}>Current Date & Time</h2>
          <p>{currentTime.toLocaleDateString("en-GB")} {currentTime.toLocaleTimeString()}</p>
          {upcomingSlot && (
            <div>
              <h2 style={{ color: "#ff9800" }}>Upcoming Class ({upcomingSlot.time})</h2>
              {upcomingSlot.remedial ? (
                <p><strong>{upcomingSlot.remedial}</strong> by {upcomingSlot.teacher}</p>
              ) : (
                <ul>
                  {Object.entries(upcomingSlot.subjects).map(([className, details]) => (
                    <li key={className}><strong>{className}:</strong> {details.subject} ({details.teacher})</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
