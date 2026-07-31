/**
 * EditorCore — Central Facade System for WallMyDevice Editor v2.0 Architecture.
 * Coordinates ThemeEngine, ConfigurationEngine, DeviceEngine, CanvasEngine,
 * WorkspaceManager, SelectionEngine, TransformEngine, LayerEngine,
 * HistoryEngine, ExportEngine, PluginAPI, and RenderingEngine.
 */

import { themeEngine, ThemeEngine } from "./ThemeEngine";
import { configurationEngine, ConfigurationEngine } from "./ConfigurationEngine";
import { deviceEngine, DeviceEngine } from "./DeviceEngine";
import { canvasEngine, CanvasEngine } from "./CanvasEngine";
import { workspaceManager, WorkspaceManager } from "./WorkspaceManager";
import { selectionEngine, SelectionEngine } from "./SelectionEngine";
import { transformEngine, TransformEngine } from "./TransformEngine";
import { layerEngine, LayerEngine } from "./LayerEngine";
import { HistoryEngine } from "./HistoryEngine";
import { exportEngine, ExportEngine } from "./ExportEngine";
import { pluginAPI, PluginAPI } from "./PluginAPI";
import { renderingEngine, RenderingEngine } from "./RenderingEngine";

export class EditorCore {
  private static instance: EditorCore;

  public readonly theme: ThemeEngine = themeEngine;
  public readonly config: ConfigurationEngine = configurationEngine;
  public readonly device: DeviceEngine = deviceEngine;
  public readonly canvas: CanvasEngine = canvasEngine;
  public readonly workspace: WorkspaceManager = workspaceManager;
  public readonly selection: SelectionEngine = selectionEngine;
  public readonly transform: TransformEngine = transformEngine;
  public readonly layer: LayerEngine = layerEngine;
  public readonly history: HistoryEngine<any> = new HistoryEngine(50);
  public readonly export: ExportEngine = exportEngine;
  public readonly plugin: PluginAPI = pluginAPI;
  public readonly rendering: RenderingEngine = renderingEngine;

  private constructor() {}

  public static getInstance(): EditorCore {
    if (!EditorCore.instance) {
      EditorCore.instance = new EditorCore();
    }
    return EditorCore.instance;
  }
}

export const editorCore = EditorCore.getInstance();
