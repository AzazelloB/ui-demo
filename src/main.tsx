import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { Button, DangerousButton, Options, Toggle } from "./ui";
import "./styles.css";

function App() {
  const [activated, setActivated] = createSignal(false);
  const [enabled, setEnabled] = createSignal(false);
  const [size, setSize] = createSignal("medium");
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
    </main>
  );
}

render(() => <App />, document.getElementById("root") as HTMLElement);
