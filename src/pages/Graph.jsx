import React from "react";
import ReactCalendarHeatmap from "react-calendar-heatmap";
export default function () {
  const dateData = [
    { date: "2025-01-20", count: 5 },
    { date: "2025-01-21", count: 8 },
    { date: "2025-01-22", count: 3 },
    // Add more data here
  ];
  return (
    <div className=" w-[50%] flex justify-center mt-20 bg-green-300">
      <ReactCalendarHeatmap
        startDate={new Date("2025-01-01")}
        endDate={new Date("2025-12-31")}
        values={dateData}
      />
    </div>
  );
}
