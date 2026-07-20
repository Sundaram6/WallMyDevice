import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeviceFrame } from "./DeviceFrame";

describe("DeviceFrame", () => {
  it("renders children inside the frame", () => {
    render(
      <DeviceFrame frame="iphone" aspect={1179 / 2556}>
        <div data-testid="wallpaper" />
      </DeviceFrame>
    );
    expect(screen.getByTestId("wallpaper")).toBeInTheDocument();
  });

  it("applies the correct aspect ratio to the inner box", () => {
    const { container } = render(
      <DeviceFrame frame="desktop-monitor" aspect={16 / 9}>
        <div />
      </DeviceFrame>
    );
    const inner = container.querySelector("[data-aspect]") as HTMLElement;
    expect(inner).toBeTruthy();
    expect(inner.style.aspectRatio).toBe("1.7777777777777777 / 1");
  });
});
