/**
 * SelectionEngine — Handles active selection, target objects,
 * multi-selection sets, and focus bounds.
 */

export interface SelectionTarget {
  id: string;
  type: "layer" | "generator" | "overlay" | "text";
  name: string;
  bounds?: { x: number; y: number; width: number; height: number };
}

export class SelectionEngine {
  private static instance: SelectionEngine;
  private selectedIds: Set<string> = new Set();
  private primaryTarget: SelectionTarget | null = null;

  private constructor() {}

  public static getInstance(): SelectionEngine {
    if (!SelectionEngine.instance) {
      SelectionEngine.instance = new SelectionEngine();
    }
    return SelectionEngine.instance;
  }

  public select(target: SelectionTarget, multiSelect: boolean = false): void {
    if (!multiSelect) {
      this.selectedIds.clear();
    }
    this.selectedIds.add(target.id);
    this.primaryTarget = target;
  }

  public deselect(id?: string): void {
    if (id) {
      this.selectedIds.delete(id);
      if (this.primaryTarget?.id === id) {
        this.primaryTarget = null;
      }
    } else {
      this.selectedIds.clear();
      this.primaryTarget = null;
    }
  }

  public getSelectedIds(): string[] {
    return Array.from(this.selectedIds);
  }

  public getPrimaryTarget(): SelectionTarget | null {
    return this.primaryTarget;
  }

  public isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }
}

export const selectionEngine = SelectionEngine.getInstance();
