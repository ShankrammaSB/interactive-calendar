"use client";
import CalendarCard from "./components/CalendarCard";
import CalendarUI from "./components/CalendarCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
      <CalendarCard />
    </div>
  );
}