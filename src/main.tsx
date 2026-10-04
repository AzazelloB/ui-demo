import { createSignal, onCleanup } from "solid-js";
import { render } from "solid-js/web";
import { Button, DangerousButton, NumberInput, Options, Select, SidePanel, TextArea, TextInput, Toggle } from "./ui";
import "./styles.css";

const inlineControlClass =
  "align-baseline rounded-none border-0 bg-transparent p-0 font-normal leading-[inherit] text-left text-shadow-none shadow-none underline decoration-foreground/35 underline-offset-4 [&>span]:[text-decoration:inherit] hover:bg-transparent hover:shadow-none hover:decoration-foreground active:bg-transparent active:shadow-none outline-none focus-visible:outline-none focus-visible:decoration-accent focus-visible:decoration-2";

function App() {
  const [activated, setActivated] = createSignal(false);
  const [enabled, setEnabled] = createSignal(false);
  const [size, setSize] = createSignal("medium");
  const [language, setLanguage] = createSignal("english");
  const [page, setPage] = createSignal("1");
  const [quantity, setQuantity] = createSignal(42);
  const [price, setPrice] = createSignal(25);
  const [pixels, setPixels] = createSignal(16);
  const [name, setName] = createSignal("Alex");
  const [notes, setNotes] = createSignal("First line\nSecond line");
  const [projectName, setProjectName] = createSignal("UI demo");
  const [notifications, setNotifications] = createSignal(true);
  const [spacing, setSpacing] = createSignal(16);
  const [vsync, setVsync] = createSignal(true);
  const [frameLimit, setFrameLimit] = createSignal(144);
  const [saved, setSaved] = createSignal(false);
  const [copyStatus, setCopyStatus] = createSignal("Copy");
  let copyTimer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;
  const message = "Try the display settings before changing the project settings.";

  const copyMessage = async () => {
    let status: string;

    try {
      await navigator.clipboard.writeText(message);
      status = "Copied";
    } catch {
      status = "Copy failed";
    }

    if (disposed) {
      return;
    }

    if (copyTimer !== null) {
      window.clearTimeout(copyTimer);
    }

    setCopyStatus(status);
    copyTimer = window.setTimeout(() => {
      setCopyStatus("Copy");
      copyTimer = null;
    }, 3000);
  };

  onCleanup(() => {
    disposed = true;

    if (copyTimer !== null) {
      window.clearTimeout(copyTimer);
    }
  });
  let indicatorTimer: ReturnType<typeof setTimeout> | null = null;

  const pulseIndicator = () => {
    if (indicatorTimer !== null) {
      window.clearTimeout(indicatorTimer);
    }

    setActivated(true);
    indicatorTimer = window.setTimeout(() => {
      setActivated(false);
      indicatorTimer = null;
    }, 500);
  };

  return (
    <main class="flex flex-col w-5xl mx-auto px-6 py-8 space-y-10">
      <section>
        <div class="flex items-baseline gap-3">
          <h1 class="text-4xl font-semibold">Buttons</h1>
          <span class="relative top-[-0.2em] size-3 rounded-full bg-white/35">
            {activated() && (
              <div class="size-full rounded-full bg-green-400 animate-ping" />
            )}
          </span>
        </div>
        <div class="mt-6 flex flex-wrap gap-3">
          <Button variant="primary" onClick={pulseIndicator}>
            Primary
          </Button>
          <Button variant="secondary" onClick={pulseIndicator}>
            Secondary
          </Button>
          <DangerousButton variant="primary" onActivate={pulseIndicator}>
            Dangerous
          </DangerousButton>
          <DangerousButton variant="secondary" onActivate={pulseIndicator}>
            Dangerous
          </DangerousButton>
        </div>
      </section>
      <section>
        <h1 class="text-4xl font-semibold">Few Values</h1>
        <div class="mt-6 flex flex-wrap gap-8">
          <div class="space-x-4">
            <span class="text-xl font-semibold">Crosshair</span>
            <Toggle value={enabled()} onChange={setEnabled}>
              On
            </Toggle>
          </div>
          <div class="space-x-4">
            <span class="text-xl font-semibold">Size</span>
            <Options
              value={size()}
              onChange={setSize}
              options={[
                { label: "Small", value: "small" },
                { label: "Medium", value: "medium" },
                { label: "Large", value: "large" },
              ]}
            />
          </div>
        </div>
      </section>
      <section>
        <h1 class="text-4xl font-semibold">Many Values</h1>
        <div class="mt-6 flex flex-wrap items-center gap-8">
          <Select
            value={language()}
            onChange={setLanguage}
            options={[
              { label: "English", value: "english" },
              { label: "Spanish", value: "spanish" },
              { label: "French", value: "french" },
              { label: "German", value: "german" },
              { label: "Italian", value: "italian" },
              { label: "Portuguese", value: "portuguese" },
              { label: "Polish", value: "polish" },
              { label: "Ukrainian", value: "ukrainian" },
              { label: "Japanese", value: "japanese" },
              { label: "Korean", value: "korean" },
            ]}
          />
          <Select
            value={page()}
            onChange={setPage}
            options={[
              { label: "1", value: "1" },
              { label: "2", value: "2" },
              { label: "3", value: "3" },
              { label: "4", value: "4" },
              { label: "5", value: "5" },
              { label: "6", value: "6" },
              { label: "7", value: "7" },
              { label: "8", value: "8" },
              { label: "9", value: "9" },
              { label: "10", value: "10" },
            ]}
          />
        </div>
      </section>
      <section>
        <h1 class="text-4xl font-semibold">Numerical Values</h1>
        <div class="mt-6 flex flex-wrap gap-3">
          <NumberInput
            variant="primary"
            aria-label="Number"
            title="Drag left or right to adjust. Double-click to type."
            value={quantity()}
            onChange={setQuantity}
          />
          <NumberInput
            variant="primary"
            aria-label="Price in dollars"
            prefix="$"
            min={0}
            value={price()}
            onChange={setPrice}
          />
          <NumberInput
            variant="primary"
            aria-label="Size in pixels"
            suffix=" px"
            min={0}
            max={999}
            value={pixels()}
            onChange={setPixels}
          />
        </div>
      </section>
      <section>
        <h1 class="text-4xl font-semibold">Text Values</h1>
        <div class="mt-6 flex flex-wrap items-center gap-4">
          <label for="name" class="text-xl font-semibold">Name</label>
          <TextInput
            id="name"
            autocomplete="name"
            placeholder="Enter a name"
            value={name()}
            onChange={setName}
          />
        </div>
        <div class="mt-6 flex flex-wrap items-start gap-4">
          <label for="notes" class="py-1.5 text-xl font-semibold">Notes</label>
          <TextArea
            id="notes"
            placeholder="Enter notes"
            value={notes()}
            onChange={setNotes}
          />
        </div>
      </section>
      <section>
        <h1 class="text-4xl font-semibold">Hidden UI</h1>
        <div class="mt-6 flex flex-wrap gap-3">
          <SidePanel
            id="settings-panel"
            hash="settings"
            title="Project settings"
          >
            <div class="space-y-5 leading-loose">
              <p>
                <label for="project-name">Project name is</label>{" "}
                <TextInput
                  id="project-name"
                  class={inlineControlClass}
                  placeholder="Enter a name"
                  value={projectName()}
                  onChange={setProjectName}
                />
              </p>
              <p>
                Notifications are{" "}
                <Toggle
                  aria-label="Notifications"
                  class={inlineControlClass}
                  value={notifications()}
                  onChange={setNotifications}
                >
                  {notifications() ? "enabled" : "disabled"}
                </Toggle>
              </p>
              <p>
                Spacing is{" "}
                <NumberInput
                  variant="primary"
                  class={inlineControlClass}
                  aria-label="Spacing in pixels"
                  suffix=" px"
                  min={0}
                  value={spacing()}
                  onChange={setSpacing}
                />
              </p>
            </div>
          </SidePanel>
          <SidePanel
            id="display-panel"
            hash="display"
            title="Display settings"
          >
            <div class="space-y-5 leading-loose">
              <p>
                VSync is{" "}
                <Toggle
                  aria-label="VSync"
                  class={inlineControlClass}
                  value={vsync()}
                  onChange={setVsync}
                >
                  {vsync() ? "enabled" : "disabled"}
                </Toggle>
              </p>
              <p>
                Frame limit is{" "}
                <NumberInput
                  variant="primary"
                  aria-label="Frame limit in frames per second"
                  class={inlineControlClass}
                  suffix=" fps"
                  min={1}
                  value={frameLimit()}
                  onChange={setFrameLimit}
                />
              </p>
            </div>
          </SidePanel>
        </div>
      </section>
      <section>
        <h1 class="text-4xl font-semibold">Contextual UI</h1>
        <article
          tabindex="0"
          aria-label="Message with secondary actions"
          class="contextual-example mt-6 inline-block max-w-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <p class="rounded-md bg-surface-soft px-5 py-3">{message}</p>
          <footer class="contextual-actions flex flex-wrap items-center justify-end gap-3 pt-2 text-sm transition-opacity motion-reduce:transition-none">
            <time datetime="10:30" class="text-muted">10:30</time>
            <Toggle
              aria-label="Save message"
              class="px-2 py-1"
              value={saved()}
              onChange={setSaved}
            >
              {saved() ? "Saved" : "Save"}
            </Toggle>
            <Button variant="secondary" class="inline-grid px-2 py-1" onClick={copyMessage}>
              <span aria-hidden="true" class="invisible col-start-1 row-start-1">Copy failed</span>
              <span aria-live="polite" class="col-start-1 row-start-1">{copyStatus()}</span>
            </Button>
          </footer>
        </article>
      </section>
    </main>
  );
}

render(() => <App />, document.getElementById("root") as HTMLElement);
