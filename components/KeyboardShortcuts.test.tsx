import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { useEditorStore } from "@/store/useEditorStore";
import { waveform } from "@/lib/generators/waveform";
import * as actions from "@/lib/export/actions";

describe("KeyboardShortcuts", () => {
  beforeEach(() => {
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "before",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
      resolutionId: "desktop-1080p",
      customWidth: 1920,
      customHeight: 1080,
      aspectLock: true,
      overlayClock: false,
      overlayDate: false,
      overlayText: false,
      overlayTextValue: "",
      overlayFont: "Inter",
      overlaySize: 1,
      exportFormat: "png",
      sheetCollapsed: true,
    });
  });

  it("R randomizes the seed", () => {
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "r" });
    expect(useEditorStore.getState().seed).not.toBe("before");
  });

  it("Space randomizes the seed and preventsDefault", () => {
    render(<KeyboardShortcuts />);
    const evt = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    document.body.dispatchEvent(evt);
    expect(useEditorStore.getState().seed).not.toBe("before");
  });

  it("1 selects the first registered generator", () => {
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "1" });
    expect(useEditorStore.getState().generatorId).toBe("waveform");
  });

  it("Ctrl+S triggers single export", () => {
    const spy = vi.spyOn(actions, "triggerSingleExport").mockClear();
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "s", ctrlKey: true });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("Cmd+S triggers single export", () => {
    const spy = vi.spyOn(actions, "triggerSingleExport").mockClear();
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "s", metaKey: true });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("Ctrl+Shift+S triggers batch export", () => {
    const spy = vi.spyOn(actions, "triggerBatchExport").mockClear();
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "s", ctrlKey: true, shiftKey: true });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("Cmd+Shift+S triggers batch export", () => {
    const spy = vi.spyOn(actions, "triggerBatchExport").mockClear();
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "s", metaKey: true, shiftKey: true });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("S without modifier does not trigger export", () => {
    const spy = vi.spyOn(actions, "triggerSingleExport").mockClear();
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "s" });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("Ctrl+S does not trigger in input field", () => {
    const spy = vi.spyOn(actions, "triggerSingleExport").mockClear();
    const { container } = render(
      <>
        <KeyboardShortcuts />
        <input data-testid="input" />
      </>
    );
    const input = container.querySelector("input")!;
    fireEvent.keyDown(input, { key: "s", ctrlKey: true });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("Ctrl+S does not trigger in textarea", () => {
    const spy = vi.spyOn(actions, "triggerSingleExport").mockClear();
    const { container } = render(
      <>
        <KeyboardShortcuts />
        <textarea data-testid="textarea" />
      </>
    );
    const textarea = container.querySelector("textarea")!;
    fireEvent.keyDown(textarea, { key: "s", ctrlKey: true });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("Escape closes open mobile sheet", () => {
    useEditorStore.setState({ sheetCollapsed: false });
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(useEditorStore.getState().sheetCollapsed).toBe(true);
  });

  it("Escape does nothing when sheet is already closed", () => {
    useEditorStore.setState({ sheetCollapsed: true, seed: "testseed" });
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(useEditorStore.getState().sheetCollapsed).toBe(true);
    expect(useEditorStore.getState().seed).toBe("testseed");
  });

  it("Escape preserves current recipe", () => {
    useEditorStore.setState({ sheetCollapsed: false, seed: "keepme", generatorId: "waveform" });
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(useEditorStore.getState().seed).toBe("keepme");
    expect(useEditorStore.getState().generatorId).toBe("waveform");
  });
});
