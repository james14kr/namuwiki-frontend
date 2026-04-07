"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format as DateFormat } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

interface RangeDatePickerProps {
  id: string,
  label?: string,
  value?: DateRange;
  defaultValue?: DateRange;
  format?: string;
  onChange?: (date: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function RangeDatePicker({
  id,
  label,
  value,
  defaultValue = {
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  },
  format = "yyyy-MM-dd",
  onChange,
  placeholder = "Pick a date",
  disabled,
}: RangeDatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    defaultValue
  );

  const isControlled = value !== undefined;
  const date = isControlled ? value : internalDate;

  const handleSelect = (d: DateRange | undefined) => {
    if (!isControlled) setInternalDate(d);
    onChange?.(d);
  };

  return (
    <Field className="mx-auto w-60 gap-1">
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            id={id}
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {DateFormat(date.from, format)} -{" "}
                  {DateFormat(date.to, format)}
                </>
              ) : (
                DateFormat(date.from, format)
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
