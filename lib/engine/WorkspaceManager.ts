/**
 * WorkspaceManager — Coordinates 3-pane layout, panel collapse states,
 * active tabs, mobile bottom sheet, and responsive breakpoints.
 */

export type WorkspaceMode = "full-editor" | "inline-embed" | "preview-only";
export type SidebarTab = "templates" | "generators" | "palettes" | "devices" | "layers" | "export";
export type MobileTab = "style" | "device" | "export";

export interface WorkspaceState {
  mode: WorkspaceMode;
  sidebarOpen: boolean;
  activeSidebarTab: SidebarTab;
  activeMobileTab: MobileTab;
  bottomSheetCollapsed: boolean;
  isMobileViewport: boolean;
}

export class WorkspaceManager {
  private static instance: WorkspaceManager;

  private constructor() {}

  public static getInstance(): WorkspaceManager {
    if (!WorkspaceManager.instance) {
      WorkspaceManager.instance = new WorkspaceManager();
    }
    return WorkspaceManager.instance;
  }

  public detectMobileViewport(windowWidth: number): boolean {
    return windowWidth < 768;
  }

  public getInitialState(): WorkspaceState {
    return {
      mode: "full-editor",
      sidebarOpen: true,
      activeSidebarTab: "generators",
      activeMobileTab: "style",
      bottomSheetCollapsed: true,
      isMobileViewport: typeof window !== "undefined" ? this.detectMobileViewport(window.innerWidth) : false,
    };
  }
}

export const workspaceManager = WorkspaceManager.getInstance();
