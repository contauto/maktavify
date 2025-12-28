/**
 * Centralized type definitions for Maktavify
 */

/** Theme options for the application */
export type Theme = 'dark' | 'light';

/** Operating mode for the application */
export type Mode = 'format' | 'compare';

/** Active tab for format mode */
export type ActiveTab = 'json' | 'graphql';

/** View mode for JSON output display */
export type ViewMode = 'tree' | 'table' | 'raw';

/** Output state for format mode */
export interface FormatOutput {
    type: 'json' | 'graphql';
    data: unknown;
}

/** Output state for compare mode */
export interface CompareOutput {
    json1: unknown;
    json2: unknown;
}

/** Combined output type */
export type OutputState = FormatOutput | CompareOutput | null;

/** Status of the current operation */
export type ProcessStatus = 'idle' | 'success' | 'error';

/** Diff item for JSON comparison */
export interface DiffItem {
    path: string;
    value?: unknown;
    old?: unknown;
    new?: unknown;
}

/** Diff result from JSON comparison */
export interface DiffResult {
    added: DiffItem[];
    removed: DiffItem[];
    modified: DiffItem[];
}

/** Confetti options type for animations */
export interface ConfettiOptions {
    spread?: number;
    startVelocity?: number;
    decay?: number;
    scalar?: number;
}
