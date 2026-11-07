import type { Snapshot } from './library.ts';

export interface TextNode { type: 'text'; text: string }
export interface HardBreak { type: 'hard_break' }
export interface Paragraph { type: 'paragraph'; content: (TextNode | HardBreak)[] }
export interface PassageDocument { schemaVersion: 1; type: 'doc'; content: Paragraph[] }
export interface Passage { id: string; source: 'authored' | 'generated'; body: PassageDocument }
// This slice defines the envelope boundary, but supports no world-effect types.
// Reads retain unknown events so replay can fail closed without hiding readable prose.
export interface EventEnvelope {
  schemaVersion: number;
  id: string;
  order: number;
  source: { turnId: string; passageId: string; origin: 'authored' | 'generated' };
  domainOwner: string;
  type: string;
  payload: unknown;
}
export interface Turn { schemaVersion: 1; id: string; order: number; passages: Passage[]; events: unknown[] }
export interface Projection {
  epoch: string; adventureId: string; version: number; passages: Passage[];
  blocked: boolean; error: string;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function isID(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(value);
}
function exactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
}
export function readDocument(value: unknown): PassageDocument {
  const invalid = () => { throw new Error('invalid_passage_document'); };
  if (!isObject(value) || !exactKeys(value, ['schemaVersion', 'type', 'content']) || value.schemaVersion !== 1 || value.type !== 'doc' || !Array.isArray(value.content) || value.content.length === 0 || value.content.length > 1000) return invalid();
  let nodeCount = 0;
  let text = '';
  for (const paragraph of value.content) {
    if (!isObject(paragraph) || !exactKeys(paragraph, ['type', 'content']) || paragraph.type !== 'paragraph' || !Array.isArray(paragraph.content)) return invalid();
    for (const node of paragraph.content) {
      if (++nodeCount > 2000 || !isObject(node)) return invalid();
      if (node.type === 'text' && exactKeys(node, ['type', 'text']) && typeof node.text === 'string' && node.text.length > 0 && !/[\r\n]/.test(node.text) && node.text.isWellFormed()) text += node.text;
      else if (node.type === 'hard_break' && exactKeys(node, ['type'])) text += '\n';
      else return invalid();
    }
    text += '\n\n';
  }
  if (!text.trim() || [...text.slice(0, -2)].length > 20000) return invalid();
  return value as unknown as PassageDocument;
}

export function plainTextToDocument(text: string): PassageDocument {
  if (typeof text !== 'string' || !text.isWellFormed()) throw new Error('invalid_passage_document');
  const normalized = text.replace(/\r\n?/g, '\n');
  const content: Paragraph[] = normalized.split('\n\n').map(paragraph => {
    const nodes: (TextNode | HardBreak)[] = [];
    paragraph.split('\n').forEach((line, index) => {
      if (index > 0) nodes.push({ type: 'hard_break' });
      if (line) nodes.push({ type: 'text', text: line });
    });
    return { type: 'paragraph', content: nodes };
  });
  return readDocument({ schemaVersion: 1, type: 'doc', content });
}
export function documentToText(document: PassageDocument): string {
  readDocument(document);
  return document.content.map(paragraph => paragraph.content.map(node => node.type === 'text' ? node.text : '\n').join('')).join('\n\n');
}

export function readTurns(value: unknown, version: number): Turn[] {
  if (!Array.isArray(value) || !Number.isSafeInteger(version) || value.length > version) throw new Error('unsupported_story_history');
  const ids = new Set<string>();
  const add = (id: unknown) => {
    if (!isID(id) || ids.has(id)) throw new Error('unsupported_story_history');
    ids.add(id);
  };
  value.forEach((turn, index) => {
    if (!isObject(turn) || !exactKeys(turn, ['schemaVersion', 'id', 'order', 'passages', 'events']) || turn.schemaVersion !== 1 || turn.order !== index + 1 || !Array.isArray(turn.passages) || turn.passages.length !== 2 || !Array.isArray(turn.events)) throw new Error('unsupported_story_history');
    add(turn.id);
    turn.passages.forEach((passage, position) => {
      if (!isObject(passage) || !exactKeys(passage, ['id', 'source', 'body']) || passage.source !== (position === 0 ? 'authored' : 'generated')) throw new Error('unsupported_story_history');
      add(passage.id);
      readDocument(passage.body);
    });
  });
  return value as Turn[];
}

export function reconstruct(snapshot: Snapshot): Projection {
  const turns = readTurns(snapshot.turns, snapshot.adventure.version);
  const unsupported = turns.find(turn => turn.events.length > 0);
  return {
    epoch: snapshot.epoch, adventureId: snapshot.adventure.id, version: snapshot.adventure.version,
    passages: turns.flatMap(turn => turn.passages), blocked: Boolean(unsupported),
    error: unsupported ? `This adventure contains story effects this version cannot read (turn ${unsupported.order}). Your saved prose is available read-only. Use a compatible version of Lorebound to continue.` : ''
  };
}
