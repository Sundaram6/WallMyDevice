import { ensureRegistered, listGenerators } from "@/lib/generators";
import { useEditorStore } from "@/store/useEditorStore";

export function GeneratorPicker() {
  ensureRegistered();
  const generators = listGenerators();
  const active = useEditorStore(s => s.generatorId);
  const setGenerator = useEditorStore(s => s.setGenerator);

  return (
    <div className="grid grid-cols-2 gap-2">
      {generators.map(g => (
        <button
          key={g.id}
          type="button"
          onClick={() => setGenerator(g.id)}
          data-active={active === g.id}
          className={`rounded-md border px-3 py-2 text-left text-sm transition ${
            active === g.id
              ? "border-blue-500 bg-accent text-zinc-50"
              : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
          }`}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}
