import { cn } from "@/utils/tw.utils";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ItemType {
  value: string;
  title: string;
  disabled?: boolean;
}

interface AppSelectProps {
  id: string;
  items: ItemType[];
  label?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
}

const AppSelect = ({
  id,
  items,
  label,
  description,
  placeholder = "선택하세요",
  value,
  onValueChange,
  defaultValue,
  disabled,
  className,
}: AppSelectProps) => {
  const hasItems = items.length > 0;

  const computedDisabled = disabled ?? !hasItems;
  const computedDefaultValue =
    defaultValue ?? (hasItems ? items[0].value : undefined);

  return (
    <FieldGroup className={cn("w-full max-w-xs gap-1", className)}>
      {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
      <Field>
        <Select
          value={value}
          onValueChange={onValueChange}
          defaultValue={value === undefined ? computedDefaultValue : undefined}
          disabled={computedDisabled}
        >
          <SelectTrigger id={id}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectGroup>
              {!hasItems ? (
                <SelectItem value="__empty" disabled>
                  항목이 없습니다
                </SelectItem>
              ) : (
                items.map((x) => (
                  <SelectItem
                    key={x.value}
                    value={x.value}
                    disabled={x.disabled}
                  >
                    {x.title}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </FieldGroup>
  );
};

export default AppSelect;
