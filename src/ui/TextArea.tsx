import { splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { textFieldClass } from "../constants/textField";

export interface TextAreaProps extends Omit<
  JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onInput" | "onChange"
> {
  value: string;
  onChange: (value: string) => void;
}

export function TextArea(props: TextAreaProps) {
  const [local, textareaProps] = splitProps(props, [
    "class",
    "value",
    "onChange",
  ]);

  const onInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = (event) => {
    local.onChange(event.currentTarget.value);
  };

  return (
    <textarea
      {...textareaProps}
      class={twMerge(textFieldClass, local.class)}
      value={local.value}
      onInput={onInput}
    />
  );
}
