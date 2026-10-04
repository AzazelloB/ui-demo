import { createEffect, createSignal, onCleanup, splitProps } from "solid-js";
import type { JSX, ParentProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Button, type ButtonProps } from "./Button";

export interface SidePanelProps extends ParentProps<
  Omit<JSX.HTMLAttributes<HTMLElement>, "title">
> {
  id: string;
  hash: string;
  title: string;
  trigger?: JSX.Element;
  buttonProps?: Omit<ButtonProps, "children" | "onClick" | "aria-expanded" | "aria-controls">;
}

export function SidePanel(props: SidePanelProps) {
  const [local, panelProps] = splitProps(props, [
    "hash",
    "title",
    "trigger",
    "buttonProps",
    "children",
    "class",
  ]);
  const [hash, setHash] = createSignal(window.location.hash);
  const open = () => hash() === `#${local.hash}`;
  const syncHash = () => setHash(window.location.hash);
  let panel: HTMLElement | undefined;

  const setOpen = (value: boolean) => {
    const url = new URL(window.location.href);
    url.hash = value ? local.hash : "";

    if (url.hash !== window.location.hash) {
      window.history.pushState(null, "", url);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  };
  const close = () => setOpen(false);

  window.addEventListener("hashchange", syncHash);
  window.addEventListener("popstate", syncHash);
  onCleanup(() => {
    window.removeEventListener("hashchange", syncHash);
    window.removeEventListener("popstate", syncHash);
  });

  createEffect(() => {
    if (!open()) {
      return;
    }

    const previousFocus = document.activeElement;
    panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      document.removeEventListener("keydown", onKeyDown);

      if (
        panel?.contains(document.activeElement) &&
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus();
      }
    });
  });

  return (
    <>
      <Button
        variant="primary"
        {...local.buttonProps}
        aria-expanded={open()}
        aria-controls={panelProps.id}
        onClick={() => setOpen(!open())}
      >
        {local.trigger ?? local.title}
      </Button>
      <aside
        {...panelProps}
        ref={panel}
        tabindex="-1"
        aria-label={local.title}
        aria-hidden={!open()}
        inert={!open()}
        data-open={open()}
        class={twMerge(
          "side-panel fixed inset-y-0 right-0 z-30 flex w-96 max-w-full flex-col border-l border-border bg-surface shadow-2xl outline-none",
          local.class,
        )}
      >
        <header class="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
          <h2 class="text-2xl font-semibold">{local.title}</h2>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
        </header>
        <div class="min-h-0 flex-1 overflow-y-auto p-6">
          {local.children}
        </div>
      </aside>
    </>
  );
}
