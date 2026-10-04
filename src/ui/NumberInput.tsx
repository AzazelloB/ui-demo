import { createSignal, Show, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Button, type ButtonProps } from "./Button";

export interface NumberInputProps extends Omit<
  ButtonProps,
  | "children"
  | "value"
  | "onChange"
  | "onDblClick"
  | "onKeyDown"
  | "onPointerDown"
  | "onPointerMove"
  | "onPointerUp"
  | "onLostPointerCapture"
> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

const DRAG_THRESHOLD = 4;

export function NumberInput(props: NumberInputProps) {
  const [local, buttonProps] = splitProps(props, [
    "value",
    "onChange",
    "min",
    "max",
    "step",
    "prefix",
    "suffix",
  ]);
  const [editing, setEditing] = createSignal(false);
  const [draft, setDraft] = createSignal("");
  const [dragging, setDragging] = createSignal(false);
  const [editingWidth, setEditingWidth] = createSignal(0);
  const [editingLength, setEditingLength] = createSignal(0);
  let drag: { id: number; x: number; value: number } | null = null;

  const step = () => local.step && local.step > 0 ? local.step : 1;
  const normalize = (value: number) =>
    Math.min(
      local.max ?? Infinity,
      Math.max(local.min ?? -Infinity, Number(value.toFixed(10))),
    );

  const beginEditing: JSX.EventHandler<
    HTMLButtonElement,
    MouseEvent | KeyboardEvent
  > = (event) => {
    setEditingWidth(event.currentTarget.getBoundingClientRect().width);
    setEditingLength(String(local.value).length);
    setDraft(String(local.value));
    setEditing(true);
  };

  const commit = () => {
    if (!editing()) {
      return;
    }

    const value = Number(draft());

    if (draft().trim() && Number.isFinite(value)) {
      local.onChange(normalize(value));
    }

    setEditing(false);
  };

  const onPointerDown: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (
    event,
  ) => {
    if (event.button !== 0 || buttonProps.disabled) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    drag = { id: event.pointerId, x: event.clientX, value: local.value };
  };

  const onPointerMove: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (
    event,
  ) => {
    if (drag === null || drag.id !== event.pointerId) {
      return;
    }

    const distance = event.clientX - drag.x;

    if (!dragging() && Math.abs(distance) < DRAG_THRESHOLD) {
      return;
    }

    setDragging(true);
    local.onChange(
      normalize(drag.value + Math.trunc(distance / DRAG_THRESHOLD) * step()),
    );
  };

  const onPointerUp: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (
    event,
  ) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onLostPointerCapture = () => {
    drag = null;
    setDragging(false);
  };

  const onKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (
    event,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      beginEditing(event);
      return;
    }

    if (["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      const direction = ["ArrowRight", "ArrowUp"].includes(event.key) ? 1 : -1;
      local.onChange(normalize(local.value + direction * step()));
    }
  };

  const onInputKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (
    event,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setEditing(false);
    }
  };

  return (
    <Show
      when={editing()}
      fallback={
        <Button
          {...buttonProps}
          class={twMerge(
            "cursor-ew-resize select-none touch-none tabular-nums text-center",
            dragging() && "bg-accent-strong",
            buttonProps.class,
          )}
          role="spinbutton"
          aria-valuenow={local.value}
          aria-valuemin={local.min}
          aria-valuemax={local.max}
          aria-valuetext={`${local.prefix ?? ""}${local.value}${local.suffix ?? ""}`}
          onDblClick={beginEditing}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onLostPointerCapture={onLostPointerCapture}
          onKeyDown={onKeyDown}
        >
          {local.prefix}
          <span
            class="inline-block"
            style={{ width: `${String(local.value).length}ch` }}
          >
            {local.value}
          </span>
          {local.suffix}
        </Button>
      }
    >
      <input
        ref={(input) => queueMicrotask(() => {
          input.focus();
          input.select();
        })}
        type="text"
        inputmode="decimal"
        aria-label={buttonProps["aria-label"]}
        aria-labelledby={buttonProps["aria-labelledby"]}
        disabled={buttonProps.disabled}
        class={twMerge(
          "rounded-md border border-foreground/15 bg-accent px-5 py-1.5 font-medium text-foreground tabular-nums text-center outline-2 outline-offset-2 outline-accent",
          buttonProps.class,
        )}
        style={{
          width: `calc(${editingWidth()}px + ${Math.max(0, draft().length - editingLength())}ch)`,
        }}
        value={draft()}
        onInput={(event) => setDraft(event.currentTarget.value)}
        onBlur={commit}
        onKeyDown={onInputKeyDown}
      />
    </Show>
  );
}
