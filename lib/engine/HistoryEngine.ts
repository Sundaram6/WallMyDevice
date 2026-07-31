/**
 * HistoryEngine — Provides undo/redo snapshot stack management,
 * state time-travel, and history bounds.
 */

export interface HistorySnapshot<T> {
  id: string;
  timestamp: number;
  label: string;
  state: T;
}

function safeClone<T>(state: T): T {
  try {
    return structuredClone(state);
  } catch {
    try {
      return JSON.parse(JSON.stringify(state));
    } catch {
      return state;
    }
  }
}

export class HistoryEngine<T> {
  private past: HistorySnapshot<T>[] = [];
  private future: HistorySnapshot<T>[] = [];
  private maxSteps: number;

  constructor(maxSteps: number = 50) {
    this.maxSteps = maxSteps;
  }

  public pushSnapshot(label: string, state: T): void {
    const snapshot: HistorySnapshot<T> = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      label,
      state: safeClone(state),
    };

    this.past.push(snapshot);
    if (this.past.length > this.maxSteps) {
      this.past.shift();
    }
    // Push clears future
    this.future = [];
  }

  public canUndo(): boolean {
    return this.past.length > 0;
  }

  public canRedo(): boolean {
    return this.future.length > 0;
  }

  public undo(currentState: T): T | null {
    if (!this.canUndo()) return null;
    const previous = this.past.pop()!;
    this.future.unshift({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      label: "Current State",
      state: safeClone(currentState),
    });
    return previous.state;
  }

  public redo(currentState: T): T | null {
    if (!this.canRedo()) return null;
    const next = this.future.shift()!;
    this.past.push({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      label: "Previous State",
      state: safeClone(currentState),
    });
    return next.state;
  }

  public clear(): void {
    this.past = [];
    this.future = [];
  }
}

