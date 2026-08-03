import { describe, it, expect, beforeEach } from "vitest";
import { parseShareParams, buildShareQueryString, buildShareUrl } from "@/lib/share/shareUrl";
import { useEditorStore } from "@/store/useEditorStore";

describe("Growth & Sharing Utilities & Store Actions", () => {
  beforeEach(() => {
    useEditorStore.setState({
      generatorId: "waveform",
      seed: "initialseed",
      palette: ["#0f172a", "#f59e0b"],
      deviceType: "desktop",
      seedLocked: false,
      paletteLocked: false,
    });
  });

  describe("URL Parameter Encoding & Decoding", () => {
    it("builds query string correctly", () => {
      const query = buildShareQueryString({
        generatorId: "starfield-nebula",
        seed: "testseed123",
        palette: ["#000000", "#1e1b4b", "#db2777"],
        deviceType: "phone",
      });
      expect(query).toBe("g=starfield-nebula&s=testseed123&p=000000-1e1b4b-db2777&d=phone");
    });

    it("builds full shareable URL", () => {
      const url = buildShareUrl(
        {
          generatorId: "geometric",
          seed: "k3p9x2a7",
          palette: ["#ff0000", "#00ff00"],
          deviceType: "desktop",
        },
        "http://localhost:3000/studio"
      );
      expect(url).toBe("http://localhost:3000/studio?g=geometric&s=k3p9x2a7&p=ff0000-00ff00&d=desktop");
    });

    it("parses query parameters into valid share state", () => {
      const parsed = parseShareParams("?g=geometric&s=myseed42&p=123456-abcdef&d=tablet");
      expect(parsed.g).toBe("geometric");
      expect(parsed.s).toBe("myseed42");
      expect(parsed.p).toEqual(["#123456", "#abcdef"]);
      expect(parsed.d).toBe("tablet");
    });

    it("handles invalid or missing parameters gracefully", () => {
      const parsed = parseShareParams("?g=unknown_gen_id&s=invalid_seed_with_symbols!!!&p=not_a_hex");
      expect(parsed.g).toBeUndefined();
      expect(parsed.s).toBeUndefined();
      expect(parsed.p).toBeUndefined();
    });
  });

  describe("Remix vs Surprise Me Store Behavior", () => {
    it("remix() strictly preserves generatorId across 10 consecutive invocations", () => {
      useEditorStore.setState({ generatorId: "metaballs", seed: "originalseed", palette: ["#111111", "#222222"] });

      for (let i = 0; i < 10; i++) {
        useEditorStore.getState().remix();
        expect(useEditorStore.getState().generatorId).toBe("metaballs");
      }
    });

    it("remix() randomizes seed and palette", () => {
      const initialSeed = useEditorStore.getState().seed;
      const initialPalette = [...useEditorStore.getState().palette];

      useEditorStore.getState().remix();

      const newSeed = useEditorStore.getState().seed;
      const newPalette = useEditorStore.getState().palette;

      expect(newSeed).not.toBe(initialSeed);
      expect(newPalette).not.toEqual(initialPalette);
    });

    it("surpriseMe() performs a full reroll including seed and palette", () => {
      const initialSeed = useEditorStore.getState().seed;
      useEditorStore.getState().surpriseMe();

      const newSeed = useEditorStore.getState().seed;
      const newGenId = useEditorStore.getState().generatorId;

      expect(newSeed).not.toBe(initialSeed);
      expect(typeof newGenId).toBe("string");
    });
  });
});
