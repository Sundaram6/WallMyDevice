import { useEffect } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { ensureRegistered, listGenerators } from "@/lib/generators";

export function KeyboardShortcuts() {
  useEffect(() => {
    ensureRegistered();
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;

      const s = useEditorStore.getState();
      if (e.key === "r" || e.key === "R" || e.key === " " || e.code === "Space") {
        s.randomizeSeed();
        if (e.code === "Space") e.preventDefault();
        return;
      }
      if (e.key === "Escape") {
        s.hydrate({});
        return;
      }
      if (e.key >= "1" && e.key <= "4") {
        const gens = listGenerators();
        const idx = Number(e.key) - 1;
        if (idx < gens.length) s.setGenerator(gens[idx].id);
        return;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
