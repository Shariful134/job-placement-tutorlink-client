import React from "react";

const ChartTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded shadow text-sm dark:text-gray-300">
        <p className="dark:text-gray-300 font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs dark:text-gray-300">
            {entry.name ?? "Bookings"}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null; // We'll handle default manually in main component
};

export default ChartTooltipContent;
