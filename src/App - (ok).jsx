import { useState, useEffect } from "react";
import rawData from "./data/timetable.json?raw"; // Import JSON as raw text
import "./App.css"; // Import CSS for styling

function App() {
  const [timetable, setTimetable] = useState(null);
  const [currentSlot, setCurrentSlot] = useState(null);

  useEffect(() => {
    try {
      const parsedData = JSON.parse(rawData);
      setTimetable(parsedData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, []);

  useEffect(() => {
    const updateCurrentSlot = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      if (timetable) {
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
        const todaySlots = day === 5 ? timetable.friday : timetable.slots; // Friday has a full schedule
        const activeSlot = todaySlots.find(slot => {
          const [start, end] = slot.time.split(" TO ");
          return isTimeInRange(currentTime, start, end);
        });

        setCurrentSlot(activeSlot || null);
      }
    };

    updateCurrentSlot();
    const interval = setInterval(updateCurrentSlot, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timetable]);

  const isTimeInRange = (currentTime, startTime, endTime) => {
    const toMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    return toMinutes(currentTime) >= toMinutes(startTime) && toMinutes(currentTime) < toMinutes(endTime);
  };

  return (
    <div className="container">
      <h1>Currently Running Class</h1>
      {currentSlot ? (
        <div className="current-slot">
          <h2>{currentSlot.time}</h2>
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Subject</th>
                <th>Teacher</th>
              </tr>
            </thead>
            <tbody>
              {currentSlot.subjects
                ? Object.entries(currentSlot.subjects).map(([grade, details]) => (
                    <tr key={grade}>
                      <td>{grade}</td>
                      <td>{details.subject}</td>
                      <td>{details.teacher}</td>
                    </tr>
                  ))
                : (
                    <tr>
                      <td colSpan="3">{currentSlot.remedial} ({currentSlot.teacher})</td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No ongoing class right now.</p>
      )}
    </div>
  );
}

export default App;
