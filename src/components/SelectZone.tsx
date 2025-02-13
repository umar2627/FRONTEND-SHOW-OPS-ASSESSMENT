import React from "react";
import { Box } from "@radix-ui/themes";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import classnames from "classnames";
const timeZones = [
  { value: "UTC", label: "UTC" },
  { value: "GMT", label: "GMT" },
  { value: "PDT", label: "PDT" },
];
type SelectZoneProps = {
  timeZone: string;
  setTimeZone: (value: string) => void;
  formErrorTimeZone: string;
  setFormError: (value: object) => void;
};

const SelectZone: React.FC<SelectZoneProps> = ({
  timeZone,
  setTimeZone,
  formErrorTimeZone,
  setFormError,
}) => {
  return (
    <Box className={`event-form-select ${formErrorTimeZone && "event-error"}`}>
      <Select.Root
        value={timeZone}
        onValueChange={(value) => {
          setTimeZone(value);
          if (!value) {
            setFormError((prev) => ({
              ...prev,
              timeZone: "timeZone",
            }));
          } else {
            setFormError((prev) => ({ ...prev, timeZone: "" }));
          }
        }}
      >
        <Select.Trigger
          className="SelectTrigger event-form-select"
          aria-label="Time Zone"
        >
          <Select.Value placeholder="Select Time Zone…" />
          <Select.Icon className="SelectIcon">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="SelectContent">
            <Select.ScrollUpButton className="SelectScrollButton">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            <Select.Viewport className="SelectViewport">
              <Select.Group>
                {timeZones.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton className="SelectScrollButton">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </Box>
  );
};
type SelectItemProps = {
  children: React.ReactNode;
  className?: string;
  value: string;
};

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames("SelectItem", className)}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

SelectItem.displayName = "SelectItem";
export default SelectZone;
