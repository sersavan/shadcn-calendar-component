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
  onDateSelect,
}: React.HTMLAttributes<HTMLDivElement> & {
  date: DateRange;
  onDateSelect: (range: { from: Date; to: Date }) => void;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [selectedRange, setSelectedRange] = React.useState<string | null>(
    "This Year"
  );
  const [month, setMonth] = React.useState<Date | undefined>(date?.to);

  const handleClose = () => setIsPopoverOpen(false);
  const handleTogglePopover = () => setIsPopoverOpen((prev) => !prev);

  const selectDateRange = (from: Date, to: Date, range: string) => {
    const startDate = startOfDay(from);
    const endDate = endOfDay(to);
    onDateSelect({ from: startDate, to: endDate });
    setSelectedRange(range);
    setMonth(from);
    setIsPopoverOpen(false);
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      const from = startOfDay(range.from as Date);
      const to = range.to ? endOfDay(range.to) : from;
      onDateSelect({ from, to });
      setMonth(to || from);
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
