import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Toggle } from "./Toggle";
import { Select } from "./Select";
import { ColorInput } from "./ColorInput";
import { Button } from "./Button";

describe("Toggle", () => {
  it("fires onChange with the toggled value", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Toggle checked={false} onChange={onChange} ariaLabel="t" />);
    fireEvent.click(getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Select", () => {
  it("calls onChange with the picked value", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Select
        value="a"
        options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]}
        onChange={onChange}
      />
    );
    const select = container.querySelector("select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "b" } });
    expect(onChange).toHaveBeenCalledWith("b");
  });
});

describe("ColorInput", () => {
  it("fires onChange with the picked color", () => {
    const onChange = vi.fn();
    const { container } = render(<ColorInput value="#000000" onChange={onChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "#ff00ff" } });
    expect(onChange).toHaveBeenCalledWith("#ff00ff");
  });
});

describe("Button", () => {
  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { getByText } = render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(getByText("Go"));
    expect(onClick).toHaveBeenCalled();
  });
});
