#### ⭐ Support this repository by giving it a ⭐

## Calendar Date Picker Component in Next.js

### Prerequisites

Ensure you have a Next.js project set up. If not, create one:

```bash
npx create-next-app my-app --typescript
cd my-app
```

### Step 1: Install Required Dependencies

Install the necessary dependencies:

```bash
npm install date-fns react-day-picker
npx shadcn-ui@latest init
npx shadcn-ui@latest add button calendar popover
```

### Step 2: Create the Calendar Date Picker Component

Create `calendar-date-picker.tsx` in your `components` directory:

```tsx
// src/components/calendar-date-picker.tsx

"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay,
} from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CalendarDatePicker({
  className,
  date,
  closeOnSelect = false,
  onDateSelect,
}: React.HTMLAttributes<HTMLDivElement> & {
  date: DateRange;
  closeOnSelect?: boolean;
  onDateSelect: (range: { from: Date; to: Date }) => void;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [selectedRange, setSelectedRange] = React.useState<string | null>(
    "This Year"
  );
  const [month, setMonth] = React.useState<Date | undefined>(date?.from);

  const handleClose = () => setIsPopoverOpen(false);
  const handleTogglePopover = () => setIsPopoverOpen((prev) => !prev);

  const selectDateRange = (from: Date, to: Date, range: string) => {
    const startDate = startOfDay(from);
    const endDate = endOfDay(to);
    onDateSelect({ from: startDate, to: endDate });
    setSelectedRange(range);
    setMonth(from);
    closeOnSelect && setIsPopoverOpen(false);
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      const from = startOfDay(range.from as Date);
      const to = range.to ? endOfDay(range.to) : from;
      onDateSelect({ from, to });
    }
    setSelectedRange(null);
  };

  const today = new Date();

  const dateRanges = [
    { label: "Today", start: today, end: today },
    { label: "Yesterday", start: subDays(today, 1), end: subDays(today, 1) },
    {
      label: "This Week",
      start: startOfWeek(today, { weekStartsOn: 1 }),
      end: endOfWeek(today, { weekStartsOn: 1 }),
    },
    {
      label: "Last Week",
      start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
      end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
    },
    { label: "Last 7 Days", start: subDays(today, 6), end: today },
    { label: "This Month", start: startOfMonth(today), end: endOfMonth(today) },
    {
      label: "Last Month",
      start: startOfMonth(subDays(today, today.getDate())),
      end: endOfMonth(subDays(today, today.getDate())),
    },
    { label: "This Year", start: startOfYear(today), end: endOfYear(today) },
    {
      label: "Last Year",
      start: startOfYear(subDays(today, 365)),
      end: endOfYear(subDays(today, 365)),
    },
  ];

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className={cn(
            "flex justify-start text-left font-normal hover:bg-card",
            !date && "text-muted-foreground"
          )}
          onClick={handleTogglePopover}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      {isPopoverOpen && (
        <PopoverContent
          className="w-auto"
          align="start"
          onInteractOutside={handleClose}
          onEscapeKeyDown={handleClose}
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="block sm:absolute right-0 bottom-0 z-10 border border-foreground/10"
              onClick={handleClose}
            >
              Close
            </Button>
            <div className="flex">
              <div className="flex flex-col gap-1 pr-3 text-left border-r border-foreground/10">
                {dateRanges.map(({ label, start, end }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "justify-start",
                      selectedRange === label &&
                        "bg-accent aria-selected:text-accent-foreground"
                    )}
                    onClick={() => selectDateRange(start, end, label)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={month}
                month={month}
                onMonthChange={setMonth}
                selected={date}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                showOutsideDays={false}
                className={className}
              />
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
```

### Step 3: Integrate the Component

Update `page.tsx`:

```tsx
// src/app/page.tsx

"use client";

import React, { useState } from "react";
import { CalendarDatePicker } from "@/components/calendar-date-picker";

function Home() {
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  return (
    <div className="p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">
        Calendar Date Picker Component
      </h1>
      <CalendarDatePicker
        date={selectedDateRange}
        onDateSelect={setSelectedDateRange}
      />
      <div className="mt-4">
        <h2 className="text-md font-semibold">Selected Date Range:</h2>
        <p className="text-sm">
          {selectedDateRange.from.toDateString()} -{" "}
          {selectedDateRange.to.toDateString()}
        </p>
      </div>
    </div>
  );
}

export default Home;
```

### Step 4: Run Your Project

```bash
npm run dev
```
