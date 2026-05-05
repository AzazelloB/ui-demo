import type { Accessor, JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Button, type ButtonProps } from "../Button";

export interface OptionItem {
  label: JSX.Element;
  value: string;
}

interface OptionProps {
  buttonProps?: Omit<
    ButtonProps,
    "children" | "value" | "variant" | "onClick" | "onChange"
  >;
  isFirst: Accessor<boolean>;
  isLast: Accessor<boolean>;
  isSelected: Accessor<boolean>;
  option: OptionItem;
  onSelect: (value: string) => void;
}

export function Option(props: OptionProps) {
  const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = () => {
    props.onSelect(props.option.value);
  };

  return (
    <Button
      {...props.buttonProps}
      aria-checked={props.isSelected()}
      class={twMerge(
        props.isFirst() && "rounded-r-none",
        props.isLast() && "rounded-l-none",
        !props.isFirst() && !props.isLast() && "rounded-none",
        props.buttonProps?.class,
      )}
      role="radio"
      type="button"
      value={props.option.value}
      variant={props.isSelected() ? "primary" : "secondary"}
      onClick={onClick}
    >
      {props.option.label}
    </Button>
  );
}
