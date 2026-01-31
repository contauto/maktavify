/**
 * Centralized type definitions for Maktavify
 */

/** Theme options for the application */
export type Theme = 'dark' | 'light';

/** Operating mode for the application */
export type Mode = 'format' | 'compare';

/** Active tab for format mode */
export type ActiveTab = 'json' | 'graphql' | 'xml';

/** Conversion mode for XML/JSON transformations */
export type ConversionMode = 'none' | 'xmlToJson' | 'jsonToXml';

/** View mode for JSON output display */
export type ViewMode = 'tree' | 'table' | 'raw';

/** Compare tab type - JSON, GraphQL, or XML comparison */
export type CompareTab = 'json' | 'graphql' | 'xml';

/** Output state for format mode */
export interface FormatOutput {
    type: 'json' | 'graphql' | 'xml';
    data: unknown;
}

/** Output state for compare mode */
export interface CompareOutput {
    compareType: 'json' | 'graphql' | 'xml';
    data1: unknown;
    data2: unknown;
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
