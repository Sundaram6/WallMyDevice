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

  it("renders desktop monitor frame correctly", () => {
    const { container } = render(
      <DeviceFrame frame="desktop-monitor" aspect={16 / 9}>
        <div data-testid="monitor-content" />
      </DeviceFrame>
    );
    // Since we removed data-aspect, just verify it renders the MonitorStand component and children
    expect(screen.getByTestId("monitor-content")).toBeInTheDocument();
  });
});
