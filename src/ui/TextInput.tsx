import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { textFieldClass } from "../constants/textField";

export interface TextInputProps extends Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onInput" | "onChange"
> {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput(props: TextInputProps) {
  const [local, inputProps] = splitProps(props, [
    "class",
    "value",
    "onChange",
  ]);

  const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    local.onChange(event.currentTarget.value);
  };

  return (
    <input
      type="text"
      {...inputProps}
      class={twMerge(textFieldClass, local.class)}
      value={local.value}
      onInput={onInput}
    />
  );
}
