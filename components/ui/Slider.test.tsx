import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("renders the current value", () => {
    const { getByDisplayValue } = render(<Slider value={0.5} min={0} max={1} step={0.01} onChange={() => {}} />);
    expect((getByDisplayValue("0.5") as HTMLInputElement)).toBeTruthy();
  });

  it("calls onChange with a number when input changes", () => {
    const onChange = vi.fn();
    const { container } = render(<Slider value={0.5} min={0} max={1} step={0.01} onChange={onChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "0.75" } });
    expect(onChange).toHaveBeenCalledWith(0.75);
  });
});
