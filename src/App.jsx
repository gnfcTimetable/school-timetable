import React, { useState, useEffect } from "react";
import timetableData from "./data/timetable.json";

const App = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentSlot, setCurrentSlot] = useState(null);
  const [upcomingSlot, setUpcomingSlot] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [teacherSchedule, setTeacherSchedule] = useState([]);

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    // Fetch correct schedule for the day
    const todaySchedule = timetableData.schedule[today];
    let slots = todaySchedule?.classes ?? [];

    // If commonRoutine is true, add common routine slots
    if (todaySchedule?.commonRoutine) {
      slots = [...slots, ...timetableData.commonRoutine];
    }

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

  useEffect(() => {
    if (selectedTeacher) {
      const today = new Date().toLocaleString("en-US", { weekday: "long" });
      const todaySchedule = timetableData.schedule[today];
      let slots = todaySchedule?.classes ?? [];

      if (todaySchedule?.commonRoutine) {
        slots = [...slots, ...timetableData.commonRoutine];
      }

      const schedule = [];
      
      slots.forEach(slot => {
        if (slot.subjects) {
          Object.entries(slot.subjects).forEach(([className, details]) => {
            const teachers = details.teacher?.split("/").map(t => t.trim()) ?? [];
            if (teachers.includes(selectedTeacher)) {
              schedule.push({ time: slot.time, className, subject: details.subject });
            }
          });
        }
      });

      setTeacherSchedule(schedule);
    } else {
      setTeacherSchedule([]);
    }
  }, [selectedTeacher]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", background: "#eef2f3" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>School Timetable</h1>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        <div style={{ flex: 1, background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          {currentSlot ? (
            <div>
              <h2 style={{ color: "#007bff" }}>Ongoing Class ({currentSlot.time})</h2>
              {currentSlot.remedial ? (
                <p><strong>{currentSlot.remedial}</strong> by <em>{currentSlot.teacher}</em></p>
              ) : currentSlot.break ? (
                <p><strong>{currentSlot.break}</strong></p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: "2px solid #007bff", padding: "10px", textAlign: "left" }}>Class</th>
                      <th style={{ borderBottom: "2px solid #007bff", padding: "10px", textAlign: "left" }}>Subject</th>
                      <th style={{ borderBottom: "2px solid #007bff", padding: "10px", textAlign: "left" }}>Teacher</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSlot.subjects &&
                      Object.entries(currentSlot.subjects).map(([className, details]) => (
                        <tr key={className}>
                          <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{className}</td>
                          <td style={{ padding: "10px", borderBottom: "1px solid #ddd", color: "#5bc0de", fontWeight: "bold" }}>{details.subject}</td>
                          <td style={{ padding: "10px", borderBottom: "1px solid #ddd", fontStyle: "italic", color: "#5a5a5a" }}>{details.teacher}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <h2 style={{ color: "#d9534f" }}>No ongoing class right now</h2>
          )}
        </div>
        <div style={{ width: "30%", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <h2 style={{ color: "#28a745" }}>Select Teacher</h2>
          <select onChange={(e) => setSelectedTeacher(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }}>
            <option value="">-- Select Teacher --</option>
            {Array.from(new Set(
              Object.values(timetableData.schedule)
                .flatMap(day => day.classes.flatMap(slot => 
                  Object.values(slot.subjects || {}).flatMap(subj => subj.teacher?.split("/").map(t => t.trim()) ?? [])
                ))
            )).map(teacher => (
              <option key={teacher} value={teacher}>{teacher}</option>
            ))}
          </select>
          {teacherSchedule.length > 0 && (
            <div>
              <h2 style={{ color: "#007bff" }}>Schedule for {selectedTeacher}</h2>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {teacherSchedule.map((entry, index) => (
                  <li key={index} style={{ marginBottom: "5px" }}>
                    <strong style={{ color: "#d9534f" }}>{entry.className}</strong>: {entry.subject} ({entry.time})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
