import { createSignal, onCleanup, splitProps } from "solid-js";
import type { JSX } from "solid-js";
import { Button, type ButtonProps } from "./Button";
import { twMerge } from "tailwind-merge";

interface DangerousButtonProps extends Omit<
  ButtonProps,
  | "onClick"
  | "onKeyDown"
  | "onKeyUp"
  | "onPointerCancel"
  | "onPointerDown"
  | "onPointerLeave"
  | "onPointerUp"
> {
  onActivate?: () => void;
}

const N_STEPS = 3;
const HOLD_DURATION = 750;
const CLICK_DURATION = 180;
const RESET_DELAY = 500;

const nextStepProgress = (progress: number) =>
  Math.min((Math.floor(progress * N_STEPS) + 1) / N_STEPS, 1);

export function DangerousButton(props: DangerousButtonProps) {
  const [local, buttonProps] = splitProps(props, ["onActivate", "children"]);
  const [progress, setProgress] = createSignal(0);
  let pressStartedAt: number | null = null;
  let lastFrameAt: number | null = null;
  let resetTimer: ReturnType<typeof setTimeout> | null = null;
  let frame: number | null = null;

  const clearHold = () => {
    if (frame !== null) {
      window.cancelAnimationFrame(frame);
      frame = null;
    }

    pressStartedAt = null;
    lastFrameAt = null;
  };

  const clearReset = () => {
    if (resetTimer !== null) {
      window.clearTimeout(resetTimer);
      resetTimer = null;
    }
  };

  const updateProgress = (nextProgress: number, event: Event) => {
    const clampedProgress = Math.min(nextProgress, 1);
    setProgress(clampedProgress);

    if (clampedProgress >= 1) {
      local.onActivate?.();
    }
  };

  const hold = (time: number, event: Event) => {
    if (progress() >= 1 || pressStartedAt === null) {
      return;
    }

    if (lastFrameAt !== null) {
      const elapsed = time - lastFrameAt;
      updateProgress(progress() + elapsed / HOLD_DURATION, event);
    }

    lastFrameAt = time;

    frame = window.requestAnimationFrame((nextTime) => hold(nextTime, event));
  };

  const press = (time: number, event: Event) => {
    clearHold();
    clearReset();
    pressStartedAt = time;
    frame = window.requestAnimationFrame((frameTime) => hold(frameTime, event));
  };

  const release = (event: PointerEvent | KeyboardEvent) => {
    if (pressStartedAt === null) {
      return;
    }

    const elapsed = event.timeStamp - pressStartedAt;

    if (progress() < 1 && elapsed <= CLICK_DURATION) {
      updateProgress(nextStepProgress(progress()), event);
    }

    clearHold();
    clearReset();
    resetTimer = window.setTimeout(() => setProgress(0), RESET_DELAY);
  };

  const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    event.preventDefault();
  };

  const onPointerDown: JSX.EventHandler<HTMLButtonElement, PointerEvent> = (
    event,
  ) => {
    if (event.button !== 0) {
      return;
    }

    press(event.timeStamp, event);
  };

  const isActivationKey = (key: string) => key === " " || key === "Enter";

  const onKeyDown: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (
    event,
  ) => {
    if (!isActivationKey(event.key) || event.repeat) {
      return;
    }

    event.preventDefault();
    press(event.timeStamp, event);
  };

  const onKeyUp: JSX.EventHandler<HTMLButtonElement, KeyboardEvent> = (
    event,
  ) => {
    if (!isActivationKey(event.key)) {
      return;
    }

    event.preventDefault();
    release(event);
  };

  onCleanup(() => {
    clearHold();
    clearReset();
  });

  return (
    <Button
      {...buttonProps}
      class={twMerge("relative", buttonProps.class)}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onPointerDown={onPointerDown}
      onPointerCancel={release}
      onPointerLeave={release}
      onPointerUp={release}
    >
      <span
        class="absolute inset-y-0 left-0 bg-white/25 transition-[width] duration-200 ease-out"
        style={{ width: `${progress() * 100}%` }}
      />

      {local.children}
    </Button>
  );
}
