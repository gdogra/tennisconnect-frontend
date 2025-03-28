import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

import "react-day-picker/dist/style.css";

export const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) => {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-white rounded-xl shadow-md", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-between items-center",
        nav: "space-x-2 flex items-center",
        nav_button: "p-1 hover:bg-gray-100 rounded",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "w-9 text-center text-gray-500 text-sm",
        row: "flex w-full mt-2",
        cell: cn(
          "w-9 h-9 text-center text-sm rounded-full transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "disabled:text-gray-400 disabled:opacity-50",
          "selected:bg-primary selected:text-white",
          "hover:bg-gray-100"
        ),
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
};

