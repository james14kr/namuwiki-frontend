import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format as DateFormat } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Field, FieldLabel } from "../ui/field";

interface DatePickerProps {
  id: string;
  value?: Date;
  label?: string;
  defaultValue?: Date;
  format?: string;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

const DatePicker = ({
  id,
  value,
  label,
  defaultValue,
  format = "yyyy-MM-dd",
  onChange,
  placeholder = "Pick a date",
  disabled,
}: DatePickerProps) => {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    defaultValue
  );

  const isControlled = value !== undefined;
  const date = isControlled ? value : internalDate;

  const handleSelect = (d: Date | undefined) => {
    if (!isControlled) setInternalDate(d);
    onChange?.(d);
  };

  return (
    <Field className="mx-auto w-60 gap-0">
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            disabled={disabled}
            variant="outline"
            data-empty={!date}
            className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
          >
            {date ? DateFormat(date, format) : <span>{placeholder}</span>}
            <ChevronDownIcon className="size-4 opacity-30" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            defaultMonth={date}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
};

export default DatePicker;
