import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { BottomSheet } from "./BottomSheet";

// JSDOM doesn't implement pointer capture — stub it so tests don't throw.
beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

describe("BottomSheet", () => {
  afterEach(cleanup);

  it("renders the handle with aria-label when in peek state", () => {
    render(
      <BottomSheet snap="peek" onSnap={() => {}}>
        <div data-testid="content" />
      </BottomSheet>
    );
    expect(screen.getByRole("button", { name: /Expand controls/i })).toBeInTheDocument();
  });

  it("renders children — content is always mounted regardless of snap state", () => {
    render(
      <BottomSheet snap="peek" onSnap={() => {}}>
        <div data-testid="content" />
      </BottomSheet>
    );
    // Children must be in the DOM even at peek (not conditionally rendered).
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("children are also present in control and full states", () => {
    const { rerender } = render(
      <BottomSheet snap="control" onSnap={() => {}}>
        <div data-testid="content" />
      </BottomSheet>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();

    rerender(
      <BottomSheet snap="full" onSnap={() => {}}>
        <div data-testid="content" />
      </BottomSheet>
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("data-snap attribute reflects the current snap state", () => {
    const { rerender } = render(
      <BottomSheet snap="peek" onSnap={() => {}}>
        <div />
      </BottomSheet>
    );
    expect(screen.getByTestId("bottom-sheet")).toHaveAttribute("data-snap", "peek");

    rerender(<BottomSheet snap="control" onSnap={() => {}}><div /></BottomSheet>);
    expect(screen.getByTestId("bottom-sheet")).toHaveAttribute("data-snap", "control");

    rerender(<BottomSheet snap="full" onSnap={() => {}}><div /></BottomSheet>);
    expect(screen.getByTestId("bottom-sheet")).toHaveAttribute("data-snap", "full");
  });

  it("tap on handle in peek state calls onSnap('control')", () => {
    const onSnap = vi.fn();
    render(
      <BottomSheet snap="peek" onSnap={onSnap}>
        <div />
      </BottomSheet>
    );
    const handle = screen.getByTestId("sheet-handle");
    // Simulate tap: pointerdown then pointerup without moving > 4px.
    fireEvent.pointerDown(handle, { clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(handle, { clientY: 100, pointerId: 1, timeStamp: 200 });
    expect(onSnap).toHaveBeenCalledWith("control");
  });

  it("aria-expanded is false in peek and true otherwise", () => {
    const { rerender } = render(
      <BottomSheet snap="peek" onSnap={() => {}}><div /></BottomSheet>
    );
    expect(screen.getByTestId("bottom-sheet")).toHaveAttribute("aria-expanded", "false");

    rerender(<BottomSheet snap="control" onSnap={() => {}}><div /></BottomSheet>);
    expect(screen.getByTestId("bottom-sheet")).toHaveAttribute("aria-expanded", "true");
  });

  it("keyboard Enter on handle in peek advances to control", () => {
    const onSnap = vi.fn();
    render(
      <BottomSheet snap="peek" onSnap={onSnap}><div /></BottomSheet>
    );
    fireEvent.keyDown(screen.getByTestId("sheet-handle"), { key: "Enter" });
    expect(onSnap).toHaveBeenCalledWith("control");
  });

  it("keyboard Escape collapses to peek from any state", () => {
    const onSnap = vi.fn();
    render(
      <BottomSheet snap="full" onSnap={onSnap}><div /></BottomSheet>
    );
    fireEvent.keyDown(screen.getByTestId("sheet-handle"), { key: "Escape" });
    expect(onSnap).toHaveBeenCalledWith("peek");
  });

  it("pointer capture API is called on drag start and end", () => {
    render(
      <BottomSheet snap="peek" onSnap={() => {}}><div /></BottomSheet>
    );
    const handle = screen.getByTestId("sheet-handle");

    fireEvent.pointerDown(handle, { clientY: 300, pointerId: 42 });
    // JSDOM does not propagate synthetic pointerId through to the handler,
    // so we verify the stub was called (real-browser contract is covered by the
    // Playwright recording spec which uses actual pointer events).
    expect(Element.prototype.setPointerCapture).toHaveBeenCalled();

    fireEvent.pointerUp(handle, { clientY: 300, pointerId: 42, timeStamp: 100 });
    expect(Element.prototype.releasePointerCapture).toHaveBeenCalled();
  });
});