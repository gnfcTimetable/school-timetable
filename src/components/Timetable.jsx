import React, { useState, useEffect } from "react";

function Timetable() {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/timetable.json") // 🔥 Ensure the path is correct!
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load timetable");
        }
        return response.json();
      })
      .then((data) => {
        setTimetable(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading timetable:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Timetable Loading...</p>;
  }

  if (!timetable) {
    return <p>Failed to load timetable.</p>;
  }

  return (
    <div>
      <h2>Timetable</h2>
      <pre>{JSON.stringify(timetable, null, 2)}</pre>
    </div>
  );
}

export default Timetable;
