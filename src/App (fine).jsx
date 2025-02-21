import { useState, useEffect } from "react";
import rawData from "./data/timetable.json?raw"; // Import JSON as raw text
import "./App.css"; // Import CSS for styling

function App() {
  const [timetable, setTimetable] = useState(null);

  useEffect(() => {
    try {
      const parsedData = JSON.parse(rawData);
      setTimetable(parsedData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, []);

  return (
    <div className="container">
      <h1>School Timetable</h1>
      {timetable ? (
        <div>
          {/* Render Weekdays */}
          {timetable.days.map((day) => (
            <div key={day} className="day-section">
              <h2>{day}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {timetable.slots.map((slot, index) =>
                    slot.subjects ? (
                      Object.entries(slot.subjects).map(([grade, details]) => (
                        <tr key={`${day}-${index}-${grade}`}>
                          <td>{slot.time}</td>
                          <td>{grade}</td>
                          <td>{details.subject}</td>
                          <td>{details.teacher}</td>
                        </tr>
                      ))
                    ) : (
                      <tr key={`${day}-${index}`}>
                        <td>{slot.time}</td>
                        <td colSpan="3">{slot.remedial} ({slot.teacher})</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ))}

          {/* Render Friday Separately */}
          <div className="day-section">
            <h2>Friday</h2>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                </tr>
              </thead>
              <tbody>
                {timetable.friday.map((slot, index) =>
                  slot.subjects ? (
                    Object.entries(slot.subjects).map(([grade, details]) => (
                      <tr key={`Friday-${index}-${grade}`}>
                        <td>{slot.time}</td>
                        <td>{grade}</td>
                        <td>{details.subject}</td>
                        <td>{details.teacher}</td>
                      </tr>
                    ))
                  ) : (
                    <tr key={`Friday-${index}`}>
                      <td>{slot.time}</td>
                      <td colSpan="3">{slot.remedial} ({slot.teacher})</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
