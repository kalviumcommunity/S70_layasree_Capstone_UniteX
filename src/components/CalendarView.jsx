import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from "lucide-react";

const CalendarView = ({ events, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create grid slots
  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to get events for a specific day
  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter((evt) => {
      if (!evt.date) return false;
      const d = new Date(evt.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <CalIcon className="w-6 h-6 text-violet-400" />
          <h2 className="text-xl font-bold">
            {monthNames[month]} {year}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-zinc-500 mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {totalSlots.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

          return (
            <div
              key={index}
              className={`min-h-[90px] p-2 border border-zinc-900 rounded-xl flex flex-col justify-between transition ${
                day ? "bg-zinc-900/50" : "bg-transparent border-none"
              } ${isToday ? "ring-1 ring-violet-500 bg-violet-950/20" : ""}`}
            >
              {day && (
                <>
                  <span className={`text-xs font-bold ${isToday ? "text-violet-400" : "text-zinc-400"}`}>
                    {day}
                  </span>
                  <div className="flex-1 overflow-y-auto mt-1 space-y-1 max-h-[60px]">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt._id}
                        onClick={() => onEventClick(evt)}
                        className="text-[10px] truncate bg-violet-605/50 border border-violet-800/40 text-violet-200 px-1 py-0.5 rounded cursor-pointer hover:bg-violet-600 hover:text-white transition"
                        title={evt.title}
                      >
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
