import { useState, type ReactNode, type DragEvent } from "react";
import { parseRecipe } from "@/lib/recipe/validate";
import { applyRecipe } from "@/lib/recipe/apply";

export function DropZone({ children }: { children: ReactNode }) {
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (files.length !== 1) {
      setMessage({ text: "Please drop a single file", ok: false });
      autoDismiss();
      return;
    }

    const file = files[0];
    if (!file.name.endsWith(".json")) {
      setMessage({ text: "Only .json files are accepted", ok: false });
      autoDismiss();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const parsed = parseRecipe(text);
      if (!parsed.ok) {
        setMessage({ text: parsed.error, ok: false });
        autoDismiss();
        return;
      }
      const applied = applyRecipe(parsed.recipe);
      if (!applied.ok) {
        setMessage({ text: applied.error, ok: false });
        autoDismiss();
        return;
      }
      setMessage({ text: "Recipe imported!", ok: true });
      autoDismiss();
    };
    reader.readAsText(file);
  }

  function autoDismiss() {
    setTimeout(() => setMessage(null), 2000);
  }

  return (
    <div onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop} className="relative h-full">
      {children}
      {dragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm">
          <div className="rounded-lg border-2 border-dashed border-zinc-500 px-8 py-6 text-sm text-zinc-200">
            Drop recipe JSON to import
          </div>
        </div>
      )}
      {message && (
        <div className={`absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md px-4 py-2 text-xs font-medium ${message.ok ? "bg-green-900/80 text-green-200" : "bg-red-900/80 text-red-200"}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
