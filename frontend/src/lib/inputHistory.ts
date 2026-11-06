export interface InputSelection
{
  start: number;
  end: number;
  direction: 'forward' | 'backward' | 'none';
}

interface InputEdit
{
  text: string;
  selection: InputSelection;
}

// Only unfinished input lives here. No generated candidates or canonical turns.
export class InputHistory
{
  private past: InputEdit[] = [];
  private future: InputEdit[] = [];
  private current: InputEdit = this.entry('');

  get canUndo(): boolean
  {
    return this.past.length > 0;
  }

  get canRedo(): boolean
  {
    return this.future.length > 0;
  }

  private entry(text: string): InputEdit
  {
    return { text, selection: { start: text.length, end: text.length, direction: 'none' } };
  }

  select(selection: InputSelection): void
  {
    const start = Math.max(0, Math.min(selection.start, this.current.text.length));
    const end = Math.max(start, Math.min(selection.end, this.current.text.length));
    this.current.selection = { start, end, direction: selection.direction };
  }

  reset(text: string): void
  {
    this.past = [];
    this.future = [];
    this.current = this.entry(text);
  }

  edit(text: string, selection?: InputSelection, extend = false): void
  {
    if (text !== this.current.text)
    {
      if (!extend) this.past.push(this.current);
      this.future = [];
      this.current = this.entry(text);
      this.trim();
    }
    if (selection) this.select(selection);
  }

  undo(): InputEdit | null
  {
    const previous = this.past.pop();
    if (!previous) return null;
    this.future.push(this.current);
    this.current = previous;
    return structuredClone(this.current);
  }

  redo(): InputEdit | null
  {
    const next = this.future.pop();
    if (!next) return null;
    this.past.push(this.current);
    this.current = next;
    return structuredClone(this.current);
  }

  private trim(): void
  {
    // Bound both edit count and retained UTF-16 units (~1 MB of text).
    let units = this.current.text.length + this.past.reduce((total, edit) => total + edit.text.length, 0);
    while (this.past.length > 50 || (units > 500000 && this.past.length > 0))
    {
      units -= this.past.shift()!.text.length;
    }
  }
}
