import { describe, it, expect, afterEach } from "vitest";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import { BottomSheet } from "./BottomSheet";

describe("BottomSheet", () => {
  afterEach(cleanup);

  it("renders the title in the collapsed handle", () => {
    render(<BottomSheet title="Generator" collapsed={true} onSnap={() => {}}><div data-testid="content" /></BottomSheet>);
    expect(screen.getByText("Generator")).toBeInTheDocument();
  });

  it("renders children when expanded", () => {
    render(<BottomSheet title="Generator" collapsed={false} onSnap={() => {}}><div data-testid="content" /></BottomSheet>);
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("clicking the handle calls onSnap", () => {
    const onSnap = vi.fn();
    render(<BottomSheet title="Generator" collapsed={true} onSnap={onSnap}><div /></BottomSheet>);
    fireEvent.click(screen.getByText("Generator"));
    expect(onSnap).toHaveBeenCalled();
  });
});

import { vi } from "vitest";