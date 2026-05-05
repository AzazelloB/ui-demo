import { splitProps } from "solid-js";
import type { JSX, ParentProps } from "solid-js";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends ParentProps<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>
> {
  variant: "primary" | "secondary";
}

export function Button(props: ButtonProps) {
  const [local, buttonProps] = splitProps(props, [
    "children",
    "class",
    "variant",
  ]);

  return (
    <button
      {...buttonProps}
      class={twMerge(
        "cursor-pointer overflow-hidden rounded-md px-5 py-1.5 text-foreground font-medium text-shadow-md transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        local.variant === "primary" &&
          "border border-foreground/15 bg-accent shadow-lg shadow-accent/25 hover:bg-accent-strong hover:shadow-xl hover:shadow-accent/40 active:shadow-3xl active:shadow-accent/60",
        local.variant === "secondary" &&
          "border border-transparent bg-transparent hover:bg-white/15 hover:shadow-xl hover:shadow-white/10 active:bg-white/20 active:shadow-3xl active:shadow-white/20",
        local.class,
      )}
    >
      {local.children}
    </button>
  );
}
