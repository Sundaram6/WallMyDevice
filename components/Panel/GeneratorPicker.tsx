import { ensureRegistered, listGenerators } from "@/lib/generators";
import { useEditorStore } from "@/store/useEditorStore";

export function GeneratorPicker() {
  ensureRegistered();
  const generators = listGenerators();
  const active = useEditorStore(s => s.generatorId);
  const setGenerator = useEditorStore(s => s.setGenerator);

  return (
    <div className="grid grid-cols-2 gap-3">
      {generators.map(g => (
        <button
          key={g.id}
          type="button"
          onClick={() => setGenerator(g.id)}
          aria-pressed={active === g.id}
          data-active={active === g.id}
          className={`h-12 text-left rounded-md border px-3 py-2 text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            active === g.id
              ? "border-blue-500 bg-blue-600 text-zinc-50 shadow"
              : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
          }`}
        >
          <div className="font-medium">{g.label}</div>
          <div className="text-xs text-zinc-400">{g.description ?? ''}</div>
        </button>
      ))}
    </div>
  );
}
