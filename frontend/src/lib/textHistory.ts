export interface TextSelection
{
  start: number;
  end: number;
  direction: 'forward' | 'backward' | 'none';
}

interface Entry
{
  text: string;
  selection: TextSelection;
}

// Only the open passage editor owns these temporary values. Nothing is persisted.
export class TextHistory
{
  private entries: Entry[];
  private position = 0;

  constructor(text: string)
  {
    this.entries = [{ text, selection: { start: 0, end: 0, direction: 'none' } }];
  }

  get canUndo(): boolean { return this.position > 0; }
  get canRedo(): boolean { return this.position < this.entries.length - 1; }

  select(selection: TextSelection): void
  {
    const entry = this.entries[this.position];
    entry.selection = {
      start: Math.max(0, Math.min(selection.start, entry.text.length)),
      end: Math.max(0, Math.min(selection.end, entry.text.length)),
      direction: selection.direction
    };
  }

  record(text: string, selection: TextSelection): void
  {
    if (this.entries[this.position].text === text)
    {
      this.select(selection);
      return;
    }
    this.entries.splice(this.position + 1);
    this.entries.push({ text, selection: { ...selection } });
    this.position++;
    this.select(selection);

    let retained = this.entries.reduce((size, entry) => size + entry.text.length, 0);
    while (this.entries.length > 1 && (this.entries.length > 51 || retained > 500000))
    {
      retained -= this.entries.shift()!.text.length;
      this.position--;
    }
  }

  move(direction: 'undo' | 'redo'): Entry | null
  {
    if (direction === 'undo' ? !this.canUndo : !this.canRedo) return null;
    this.position += direction === 'undo' ? -1 : 1;
    const entry = this.entries[this.position];
    return { text: entry.text, selection: { ...entry.selection } };
  }
}
