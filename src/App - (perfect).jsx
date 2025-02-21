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
    <div>
      <h1>School Timetable</h1>

      {currentClass ? (
        <div>
          <h2>Ongoing Class</h2>
          <p><strong>Time:</strong> {currentClass.time}</p>

          {currentClass.subjects ? (
            Object.entries(currentClass.subjects).map(([grade, details]) => (
              <div key={grade}>
                <h3>Class {grade}</h3>
                <p><strong>Subject:</strong> {details.subject}</p>
                <p><strong>Teacher:</strong> {details.teacher}</p>
              </div>
            ))
          ) : (
            <p><strong>{currentClass.remedial}</strong> (Teacher: {currentClass.teacher})</p>
          )}
        </div>
      ) : (
        <p>No ongoing class right now</p>
      )}
    </div>
  );
}

export default App;
