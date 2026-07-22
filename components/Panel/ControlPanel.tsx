import { GeneratorPicker } from "./GeneratorPicker";
import { PalettePicker } from "./PalettePicker";
import { ModeToggle } from "./ModeToggle";
import { SeedBar } from "./SeedBar";
import { ResolutionPicker } from "./ResolutionPicker";
import { ParamsForm } from "./ParamsForm";
import { FinishControls } from "./FinishControls";
import { OverlayControls } from "./OverlayControls";
import { ExportBar } from "./ExportBar";
import { RecipeLoader } from "./RecipeLoader";

export function ControlPanel() {
  return (
    <aside className="flex h-full w-96 min-w-[280px] flex-col gap-6 overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-4 text-zinc-100">
      <div className="sticky top-0 z-10 bg-zinc-950 pt-4 pb-2">
        <h1 className="text-sm font-semibold tracking-wider">Editor</h1>
        <p className="text-xs text-zinc-500">Controls & export</p>
      </div>

      <Section title="Generator"><GeneratorPicker /></Section>

      <div className="grid gap-6">
        <Section title="Device and Resolution"><ResolutionPicker /></Section>
        <Section title="Palette and Appearance"><PalettePicker /><ModeToggle /></Section>
      </div>

      <Section title="Generator Controls"><ParamsForm /></Section>
      <Section title="Frame and Overlays"><FinishControls /><OverlayControls /></Section>
      <Section title="Export and Recipe"><ExportBar /><RecipeLoader /></Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
