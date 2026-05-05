import type { JSX } from "solid-js";
import { createMemo, createSignal, onCleanup, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";

interface SelectItem {
  label: JSX.Element;
  value: string;
}

interface SelectProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  options: [SelectItem, ...SelectItem[]];
  value: string;
  onChange: (value: string) => void;
}

const DRAG_THRESHOLD = 28;
const ANIMATION_DURATION = 160;

const labelLength = (label: JSX.Element, value: string) => {
  if (typeof label === "string" || typeof label === "number") {
    return String(label).length;
  }

  return value.length;
};

export function Select(props: SelectProps) {
  const [local, groupProps] = splitProps(props, [
    "class",
    "onChange",
    "options",
    "value",
  ]);
  let dragStartX: number | null = null;
  let animationTimer: ReturnType<typeof setTimeout> | null = null;
  let animationFrame: number | null = null;
  const [motion, setMotion] = createSignal<"prev" | "next" | null>(null);
  const [previewIndex, setPreviewIndex] = createSignal<number | null>(null);

  const selectedIndex = createMemo(() => {
    const index = local.options.findIndex(
      (option) => option.value === local.value,
    );

    if (index === -1) {
      throw new Error(
        `Select value "${local.value}" does not exist in options.`,
      );
    }

    return index;
  });
  const displayIndex = () => previewIndex() ?? selectedIndex();

  const optionAt = (index: number) => {
    if (index < 0 || index >= local.options.length) {
      throw new Error(`Select option index ${index} is out of range.`);
    }

    return local.options[index];
  };
  const hasPrev = () => displayIndex() > 0;
  const hasNext = () => displayIndex() < local.options.length - 1;
  const prevIndex = () => displayIndex() - 1;
  const nextIndex = () => displayIndex() + 1;
  const selectedOption = () => optionAt(displayIndex());
  const optionWidth = createMemo(() => {
    const maxLength = local.options.reduce(
      (max, option) => Math.max(max, labelLength(option.label, option.value)),
      0,
    );

    return `${maxLength}ch`;
  });

  const animate = (direction: "prev" | "next") => {
    if (animationTimer !== null) {
      window.clearTimeout(animationTimer);
      animationTimer = null;
    }

    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
    }

    setMotion(null);
    animationFrame = window.requestAnimationFrame(() => {
      setMotion(direction);
      animationFrame = null;
      animationTimer = window.setTimeout(() => {
        setMotion(null);
        animationTimer = null;
      }, ANIMATION_DURATION);
    });
  };

  const selectIndex = (index: number) => {
    if (index === selectedIndex()) {
      return;
    }

    animate(index > selectedIndex() ? "next" : "prev");
    local.onChange(optionAt(index).value);
  };

  const step = (count: number) => {
    const targetIndex = Math.min(
      Math.max(selectedIndex() + count, 0),
      local.options.length - 1,
    );

    selectIndex(targetIndex);
  };

  const selectPrev = () => {
    if (hasPrev()) {
      selectIndex(prevIndex());
    }
  };

  const selectNext = () => {
    if (hasNext()) {
      selectIndex(nextIndex());
    }
  };

  const onSelectedPointerDown: JSX.EventHandler<
    HTMLButtonElement,
    PointerEvent
  > = (event) => {
    dragStartX = event.clientX;
    setPreviewIndex(selectedIndex());
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onSelectedPointerMove: JSX.EventHandler<
    HTMLButtonElement,
    PointerEvent
  > = (event) => {
    if (dragStartX === null) {
      return;
    }

    const distance = event.clientX - dragStartX;
    const targetIndex = Math.min(
      Math.max(selectedIndex() + Math.round(-distance / DRAG_THRESHOLD), 0),
      local.options.length - 1,
    );

    if (targetIndex !== displayIndex()) {
      animate(targetIndex > displayIndex() ? "next" : "prev");
      setPreviewIndex(targetIndex);
    }
  };

  const onSelectedPointerUp: JSX.EventHandler<
    HTMLButtonElement,
    PointerEvent
  > = (event) => {
    if (dragStartX === null) {
      return;
    }

    const targetIndex = displayIndex();
    dragStartX = null;
    setPreviewIndex(null);

    if (targetIndex !== selectedIndex()) {
      selectIndex(targetIndex);
    }
  };

  const onSelectedPointerCancel = () => {
    dragStartX = null;
    setPreviewIndex(null);
  };

  const onSelectedKeyDown: JSX.EventHandler<
    HTMLButtonElement,
    KeyboardEvent
  > = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  };

  onCleanup(() => {
    if (animationTimer !== null) {
      window.clearTimeout(animationTimer);
    }

    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
    }
  });

  return (
    <div
      {...groupProps}
      data-motion={motion() ?? "idle"}
      class={twMerge(
        "select-track inline-grid grid-cols-[1fr_auto_1fr] items-center gap-1.5",
        local.class,
      )}
    >
      <span
        aria-disabled={!hasPrev()}
        class={twMerge(
          "group min-w-10 select-none px-2 text-right text-sm font-medium",
          hasPrev() ? "cursor-pointer" : "pointer-events-none",
        )}
        style={{ width: `max(2.5rem, ${optionWidth()})` }}
        onClick={selectPrev}
      >
        <span
          class={twMerge(
            "select-value block text-transparent transition-colors",
            "bg-linear-to-r from-transparent to-muted bg-clip-text",
            hasPrev() && "group-hover:to-foreground",
          )}
        >
          {hasPrev() ? optionAt(prevIndex()).label : ""}
        </span>
      </span>
      <Button
        aria-live="polite"
        class="z-10 cursor-grab select-none px-3 active:cursor-grabbing"
        type="button"
        variant="primary"
        onKeyDown={onSelectedKeyDown}
        onPointerCancel={onSelectedPointerCancel}
        onPointerDown={onSelectedPointerDown}
        onPointerMove={onSelectedPointerMove}
        onPointerUp={onSelectedPointerUp}
      >
        <div class="select-value text-center" style={{ width: optionWidth() }}>
          {selectedOption().label}
        </div>
      </Button>
      <span
        aria-disabled={!hasNext()}
        class={twMerge(
          "group min-w-10 select-none px-2 text-left text-sm font-medium",
          hasNext() ? "cursor-pointer" : "pointer-events-none",
        )}
        style={{ width: `max(2.5rem, ${optionWidth()})` }}
        onClick={selectNext}
      >
        <span
          class={twMerge(
            "select-value block text-transparent transition-colors",
            "bg-linear-to-r from-muted to-transparent bg-clip-text",
            hasNext() && "group-hover:from-foreground",
          )}
        >
          {hasNext() ? optionAt(nextIndex()).label : ""}
        </span>
      </span>
    </div>
  );
}
