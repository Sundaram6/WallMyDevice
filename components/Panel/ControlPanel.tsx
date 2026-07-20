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
    <aside className="flex h-full w-80 flex-col gap-6 overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-4 text-zinc-100">
      <Section title="Generator"><GeneratorPicker /></Section>
      <Section title="Palette"><PalettePicker /></Section>
      <Section title="Mode"><ModeToggle /></Section>
      <Section title="Seed"><SeedBar /></Section>
      <Section title="Resolution"><ResolutionPicker /></Section>
      <Section title="Params"><ParamsForm /></Section>
      <Section title="Finish"><FinishControls /></Section>
      <Section title="Overlays"><OverlayControls /></Section>
      <Section title="Export"><ExportBar /><RecipeLoader /></Section>
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
