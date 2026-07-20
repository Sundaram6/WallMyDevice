import { GeneratorPicker } from "./GeneratorPicker";

export function ControlPanel() {
  return (
    <aside className="flex h-full w-80 flex-col gap-6 overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-4 text-zinc-100">
      <Section title="Generator">
        <GeneratorPicker />
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</h2>
      {children}
    </section>
  );
}
