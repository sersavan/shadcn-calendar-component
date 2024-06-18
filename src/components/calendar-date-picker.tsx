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
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const multiSelectVariants = cva(
  "flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-forground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground text-background",
        link: "text-primary underline-offset-4 hover:underline text-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CalendarDatePickerProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  className?: string;
  date: DateRange;
  closeOnSelect?: boolean;
  onDateSelect: (range: { from: Date; to: Date }) => void;
}

export const CalendarDatePicker = React.forwardRef<
  HTMLButtonElement,
  CalendarDatePickerProps
>(
  (
    { className, date, closeOnSelect = false, onDateSelect, variant, ...props },
    ref
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [selectedRange, setSelectedRange] = React.useState<string | null>(
      "This Year"
    );
    const [month, setMonth] = React.useState<Date | undefined>(date?.from);
    const [year, setYear] = React.useState<number | undefined>(
      date?.from?.getFullYear()
    );

    const handleClose = () => setIsPopoverOpen(false);

    const handleTogglePopover = () => setIsPopoverOpen((prev) => !prev);

    const selectDateRange = (from: Date, to: Date, range: string) => {
      const startDate = startOfDay(from);
      const endDate = endOfDay(to);
      onDateSelect({ from: startDate, to: endDate });
      setSelectedRange(range);
      setMonth(from);
      setYear(from.getFullYear());
      closeOnSelect && setIsPopoverOpen(false);
    };

    const handleDateSelect = (range: DateRange | undefined) => {
      if (range) {
        const from = startOfDay(range.from as Date);
        const to = range.to ? endOfDay(range.to) : from;
        onDateSelect({ from, to });
      }
      setSelectedRange(null);
      setMonth(range?.from);
      setYear(range?.from?.getFullYear());
    };

    const handleMonthChange = (newMonthIndex: number) => {
      if (year !== undefined) {
        const newMonth = new Date(year, newMonthIndex, 1);
        const from = startOfMonth(newMonth);
        const to = endOfMonth(newMonth);
        selectDateRange(from, to, format(newMonth, "LLLL yyyy"));
      }
    };

    const handleYearChange = (newYear: number) => {
      setYear(newYear);
      const newMonth = month
        ? new Date(newYear, month.getMonth(), 1)
        : new Date(newYear, 0, 1);
      const from = startOfMonth(newMonth);
      const to = endOfMonth(newMonth);
      selectDateRange(from, to, format(newMonth, "LLLL yyyy"));
    };

    const today = new Date();

    const years = Array.from(
      { length: 11 },
      (_, i) => today.getFullYear() - 5 + i
    );

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
      {
        label: "This Month",
        start: startOfMonth(today),
        end: endOfMonth(today),
      },
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
            ref={ref}
            {...props}
            className={cn(
              "w-[250px] text-left",
              multiSelectVariants({ variant, className })
            )}
            onClick={handleTogglePopover}
            suppressHydrationWarning
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
            avoidCollisions={false}
            onInteractOutside={handleClose}
            onEscapeKeyDown={handleClose}
            style={{
              maxHeight: "var(--radix-popover-content-available-height)",
              overflowY: "auto",
            }}
          >
            <div className="flex">
              <div className="flex flex-col gap-1 pr-4 text-left border-r border-foreground/10">
                {dateRanges.map(({ label, start, end }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "justify-start hover:bg-primary/90 hover:text-background",
                      selectedRange === label &&
                        "bg-primary text-background hover:bg-primary/90 hover:text-background"
                    )}
                    onClick={() => {
                      selectDateRange(start, end, label);
                      setMonth(start);
                      setYear(start.getFullYear());
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-center ml-4">
                  <div className="flex gap-2 w-[250px]">
                    <Select
                      onValueChange={(value) =>
                        handleMonthChange(months.indexOf(value))
                      }
                      value={month ? months[month.getMonth()] : undefined}
                    >
                      <SelectTrigger className="w-[250px] focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, idx) => (
                          <SelectItem key={idx} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value) => handleYearChange(Number(value))}
                      value={year ? year.toString() : undefined}
                    >
                      <SelectTrigger className="w-[250px] focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year, idx) => (
                          <SelectItem key={idx} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:block"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </div>
                <div className="flex">
                  <Calendar
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
            </div>
          </PopoverContent>
        )}
      </Popover>
    );
  }
);

CalendarDatePicker.displayName = "CalendarDatePicker";
