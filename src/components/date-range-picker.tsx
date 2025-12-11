"use client";

import * as React from "react";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { DateRange } from "@/hooks/use-trades";

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [openFrom, setOpenFrom] = React.useState(false);
  const [openTo, setOpenTo] = React.useState(false);
  const [fromMonth, setFromMonth] = React.useState<Date | undefined>(dateRange.from || undefined);
  const [toMonth, setToMonth] = React.useState<Date | undefined>(dateRange.to || undefined);
  const [fromValue, setFromValue] = React.useState(formatDate(dateRange.from));
  const [toValue, setToValue] = React.useState(formatDate(dateRange.to));

  const handleFromChange = (date: Date | undefined) => {
    const newDate = date || null;
    onDateRangeChange({ from: newDate, to: dateRange.to });
    setFromValue(formatDate(newDate));
    setFromMonth(newDate || undefined);
    setOpenFrom(false);
  };

  const handleToChange = (date: Date | undefined) => {
    const newDate = date || null;
    onDateRangeChange({ from: dateRange.from, to: newDate });
    setToValue(formatDate(newDate));
    setToMonth(newDate || undefined);
    setOpenTo(false);
  };

  const handleClear = () => {
    onDateRangeChange({ from: null, to: null });
    setFromValue("");
    setToValue("");
  };

  return (
    <div className="flex items-center gap-2">
      {/* From Date */}
      <div className="relative">
        <Input
          id="from-date"
          value={fromValue}
          placeholder="From date"
          className="bg-background pr-8 w-[140px] h-9 text-sm"
          onChange={(e) => {
            const date = new Date(e.target.value);
            setFromValue(e.target.value);
            if (isValidDate(date)) {
              onDateRangeChange({ from: date, to: dateRange.to });
              setFromMonth(date);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpenFrom(true);
            }
          }}
        />
        <Popover open={openFrom} onOpenChange={setOpenFrom}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1/2 right-1 size-6 -translate-y-1/2 hover:bg-transparent"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select from date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="start"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={dateRange.from || undefined}
              captionLayout="dropdown"
              month={fromMonth}
              onMonthChange={setFromMonth}
              onSelect={handleFromChange}
              disabled={(date) => {
                if (dateRange.to) {
                  return date > dateRange.to;
                }
                return false;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <span className="text-sm text-muted-foreground">-</span>

      {/* To Date */}
      <div className="relative">
        <Input
          id="to-date"
          value={toValue}
          placeholder="To date"
          className="bg-background pr-8 w-[140px] h-9 text-sm"
          onChange={(e) => {
            const date = new Date(e.target.value);
            setToValue(e.target.value);
            if (isValidDate(date)) {
              onDateRangeChange({ from: dateRange.from, to: date });
              setToMonth(date);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpenTo(true);
            }
          }}
        />
        <Popover open={openTo} onOpenChange={setOpenTo}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1/2 right-1 size-6 -translate-y-1/2 hover:bg-transparent"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select to date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="start"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={dateRange.to || undefined}
              captionLayout="dropdown"
              month={toMonth}
              onMonthChange={setToMonth}
              onSelect={handleToChange}
              disabled={(date) => {
                if (dateRange.from) {
                  return date < dateRange.from;
                }
                return false;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Clear Button - only show when filter is active */}
      {(dateRange.from || dateRange.to) && (
        <Button
          onClick={handleClear}
          variant="ghost"
          size="sm"
          className="h-9 px-2 hover:bg-destructive/10"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Clear date filter</span>
        </Button>
      )}
    </div>
  );
}
