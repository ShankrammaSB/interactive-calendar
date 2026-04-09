"use client";

import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
];

export default function CalendarUI() {
  const [date, setDate] = useState(new Date());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [apiHolidays, setApiHolidays] = useState<{ [key: string]: string }>({});

  // ✅ NEW: toast
  const [toast, setToast] = useState("");

  // ✅ NEW: today
  const today = new Date();

  const getKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  useEffect(() => {
    const stored = localStorage.getItem("calendar-notes");
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch(
          `https://calendarific.com/api/v2/holidays?api_key=tisD3RW17CnqTYcyNvGPBUwuS3Q0kCRQ&country=IN&year=${date.getFullYear()}`
        );
        const data = await res.json();

        const holidayMap: { [key: string]: string } = {};
        data.response.holidays.forEach((h: any) => {
          const date = h.date.iso.split("T")[0];
          holidayMap[date] = h.name;
        });

        setApiHolidays(holidayMap);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHolidays();
  }, [date]);

  const handleDateClick = (d: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(d);
      setEndDate(null);
    } else {
      if (d < startDate) {
        setEndDate(startDate);
        setStartDate(d);
      } else {
        setEndDate(d);
      }
    }
  };

  const isInRange = (d: Date) =>
    startDate && endDate && d >= startDate && d <= endDate;

  const isSameDay = (d1: Date | null, d2: Date | null) =>
    d1 && d2 && d1.toDateString() === d2.toDateString();

  const saveNote = () => {
    if (!startDate) return alert("Select a date first");

    const key = getKey(startDate);
    const updated = { ...notes, [key]: note };

    setNotes(updated);
    localStorage.setItem("calendar-notes", JSON.stringify(updated));

    // ✅ toast
    setToast("✅ Note saved!");
    setTimeout(() => setToast(""), 2000);
  };

  const deleteNote = () => {
    if (!startDate) return alert("Select a date first");

    const key = getKey(startDate);
    const updated = { ...notes };

    delete updated[key];
    setNotes(updated);
    setNote("");

    localStorage.setItem("calendar-notes", JSON.stringify(updated));

    // ✅ toast
    setToast("🗑️ Note deleted!");
    setTimeout(() => setToast(""), 2000);
  };

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  const changeMonth = (dir: number) => {
    setDate(new Date(year, month + dir, 1));
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-start pt-16 relative overflow-hidden"
      style={{
        backgroundImage: "url('/wall2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* 🔔 Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      <img src="/plant.png" className="absolute bottom-0 left-0 w-[220px]" />

      {/* Hook */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <div className="w-4 h-4 bg-gray-700 rounded-full border-2 border-white shadow-md"></div>
        <div className="w-[2px] h-10 bg-gray-500"></div>
      </div>

      <div className="w-full flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={month}
            whileHover={{ rotateZ: [0, 2, -2, 0] }}
            style={{ transformOrigin: "top center" }}
            className="w-[90%] max-w-[420px] bg-white rounded-xl shadow-2xl"
          >
            <div className="py-3 text-center font-semibold">
              {date.toLocaleString("default", { month: "long" })} {year}
            </div>

            <img src={images[month]} className="w-full h-[180px]" />

            <div className="p-4">
              <div className="flex justify-between mb-2">
                <button onClick={() => changeMonth(-1)}>‹</button>
                <button onClick={() => changeMonth(1)}>›</button>
              </div>

              <div className="grid grid-cols-7 text-xs mb-2 text-gray-600">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                  <div key={d} className="text-center">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-sm">
                {days.map((d, i) => {
                  if (!d) return <div key={i}></div>;

                  const isHoliday =
                    d.getDay() === 0 ||
                    (d.getDay() === 6 && Math.ceil(d.getDate() / 7) === 2) ||
                    (d.getDay() === 6 && Math.ceil(d.getDate() / 7) === 4);

                  return (
                    <div
                      key={i}
                      onClick={() => handleDateClick(d)}
                      className={`
                        py-1 text-center cursor-pointer rounded-full
                        ${isSameDay(d, startDate) ? "bg-blue-600 text-white" : ""}
                        ${isSameDay(d, endDate) ? "bg-purple-600 text-white" : ""}
                        ${isInRange(d) ? "bg-blue-100" : ""}
                        ${isSameDay(d, today) ? "border-2 border-black" : ""}
                        ${isHoliday ? "text-red-500" : ""}
                      `}
                    >
                      {d.getDate()}
                    </div>
                  );
                })}
              </div>

              {/* Notes */}
              <div className="mt-5 bg-gray-100 p-4 rounded-xl border">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 rounded border"
                />

                <div className="flex justify-between mt-3">
                  <span className="text-xs">
                    {startDate && endDate
                      ? `🟦 ${startDate.toDateString()} → 🟪 ${endDate.toDateString()}`
                      : startDate
                      ? `Start: ${startDate.toDateString()}`
                      : "Select range"}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={saveNote}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={deleteNote}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}