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

type ControlPanelProps = {
  /**
   * "sidebar" (default) renders the fixed-width desktop panel.
   * "sheet" renders a compact, warm-styled single scroll list for mobile sheets.
   */
  variant?: "sidebar" | "sheet";
};

export function ControlPanel({ variant = "sidebar" }: ControlPanelProps) {
  const sections = (
    <>
      <Section title="Generator"><GeneratorPicker /></Section>

      <div className="grid gap-5 sm:gap-6">
        <Section title="Seed & Randomize"><SeedBar /></Section>
        <Section title="Device and Resolution"><ResolutionPicker /></Section>
        <Section title="Palette and Appearance"><PalettePicker /><ModeToggle /></Section>
      </div>

      <Section title="Generator Controls"><ParamsForm /></Section>
      <Section title="Frame and Overlays"><FinishControls /><OverlayControls /></Section>
      <Section title="Export and Recipe"><ExportBar /><RecipeLoader /></Section>
    </>
  );

  if (variant === "sheet") {
    return (
      <div className="flex flex-col gap-5 text-[#2B2A26] pb-6">
        {sections}
      </div>
    );
  }

  return (
    <aside className="hidden md:flex h-full w-full flex-col gap-6 overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-4 text-zinc-100">
      <div className="sticky top-0 z-10 bg-zinc-950 pt-2 pb-2">
        <h1 className="text-sm font-semibold tracking-wider">Editor</h1>
        <p className="text-xs text-zinc-500">Controls &amp; export</p>
      </div>

      {sections}
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#8A8579]">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
