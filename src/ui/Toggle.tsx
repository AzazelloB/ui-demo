import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Button, type ButtonProps } from "./Button";

interface ToggleProps extends Omit<
  ButtonProps,
  "value" | "variant" | "onClick" | "onChange"
> {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle(props: ToggleProps) {
  const [local, buttonProps] = splitProps(props, ["value", "onChange"]);

  const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = () => {
    local.onChange(!local.value);
  };

  return (
    <Button
      {...buttonProps}
      aria-pressed={local.value}
      variant={local.value ? "primary" : "secondary"}
      onClick={onClick}
    />
  );
}
