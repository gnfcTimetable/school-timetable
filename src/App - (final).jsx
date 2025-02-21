import { useState, useEffect } from "react";
import timetableData from "./data/timetable.json?raw";

function App() {
  const [currentClass, setCurrentClass] = useState(null);

  useEffect(() => {
    const checkCurrentClass = () => {
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

      let todayTimetable = today === "Friday" ? JSON.parse(timetableData).friday : JSON.parse(timetableData).slots;

      const currentSlot = todayTimetable.find((slot) => isCurrentSlot(slot.time));

      setCurrentClass(currentSlot || null);
    };

    checkCurrentClass();
    const interval = setInterval(checkCurrentClass, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const isCurrentSlot = (slotTime) => {
    const [start, end] = slotTime.split(" TO ");

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const startTime = convertToMinutes(start);
    const endTime = convertToMinutes(end);

    return currentTime >= startTime && currentTime < endTime;
  };

  const convertToMinutes = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📅 School Timetable</h1>

      {currentClass ? (
        <div style={styles.card}>
          <h2 style={styles.subtitle}>🕒 Ongoing Class</h2>
          <p><strong>⏰ Time:</strong> {currentClass.time}</p>

          {currentClass.subjects ? (
            <div style={styles.classList}>
              {Object.entries(currentClass.subjects).map(([grade, details]) => (
                <div key={grade} style={styles.classItem}>
                  <h3 style={styles.grade}>🎓 Class {grade}</h3>
                  <p><strong>📖 Subject:</strong> {details.subject}</p>
                  <p><strong>👨‍🏫 Teacher:</strong> {details.teacher}</p>
                </div>
              ))}
            </div>
          ) : (
            <p><strong>📚 {currentClass.remedial}</strong> (👨‍🏫 {currentClass.teacher})</p>
          )}
        </div>
      ) : (
        <p style={styles.noClass}>❌ No ongoing class right now</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#333",
  },
  subtitle: {
    fontSize: "1.5rem",
    color: "#007bff",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    display: "inline-block",
    textAlign: "left",
    width: "80%",
    maxWidth: "600px",
  },
  classList: {
    marginTop: "10px",
  },
  classItem: {
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
    marginBottom: "10px",
  },
  grade: {
    marginBottom: "5px",
    color: "#28a745",
  },
  noClass: {
    fontSize: "1.2rem",
    color: "#d9534f",
    marginTop: "20px",
  },
};

export default App;
