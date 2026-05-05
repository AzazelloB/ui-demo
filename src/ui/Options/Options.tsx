import { For, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import type { ButtonProps } from "../Button";
import { Option, type OptionItem } from "./Option";

interface OptionsProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  options: OptionItem[];
  value: string;
  onChange: (value: string) => void;
  buttonProps?: Omit<
    ButtonProps,
    "children" | "value" | "variant" | "onClick" | "onChange"
  >;
}

export function Options(props: OptionsProps) {
  const [local, groupProps] = splitProps(props, [
    "buttonProps",
    "class",
    "onChange",
    "options",
    "value",
  ]);

  return (
    <div
      {...groupProps}
      role="radiogroup"
      class={twMerge("inline-flex isolate", local.class)}
    >
      <For each={local.options}>
        {(option, index) => (
          <Option
            buttonProps={local.buttonProps}
            isFirst={() => index() === 0}
            isLast={() => index() === local.options.length - 1}
            isSelected={() => option.value === local.value}
            option={option}
            onSelect={local.onChange}
          />
        )}
      </For>
    </div>
  );
}
