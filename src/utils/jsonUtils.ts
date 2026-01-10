/**
 * Attempts to extract valid JSON from a string with common malformed patterns.
 * Handles cases like:
 * - "key": {...} (missing outer braces)
 * - var x = {...} or const x = {...} (JS variable assignment)
 * - {...}, (trailing comma)
 * - json with line prefixes like > or |
 * @param input - The potentially malformed JSON string
 * @returns The cleaned JSON string or null if no pattern matched
 */
const tryExtractJson = (input: string): string | null => {
    const trimmed = input.trim();

    // Pattern 1: "key": {...} or "key": [...] - missing outer braces
    // This handles cases like: "request": { ... }
    const keyValuePattern = /^"([^"]+)"\s*:\s*(\{[\s\S]*\}|\[[\s\S]*\])$/;
    const keyValueMatch = trimmed.match(keyValuePattern);
    if (keyValueMatch) {
        const key = keyValueMatch[1];
        const value = keyValueMatch[2];
        return `{"${key}": ${value}}`;
    }

    // Pattern 2: key: {...} or key: [...] - unquoted key without outer braces
    const unquotedKeyPattern = /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*(\{[\s\S]*\}|\[[\s\S]*\])$/;
    const unquotedKeyMatch = trimmed.match(unquotedKeyPattern);
    if (unquotedKeyMatch) {
        const key = unquotedKeyMatch[1];
        const value = unquotedKeyMatch[2];
        return `{"${key}": ${value}}`;
    }

    // Pattern 3: var/let/const x = {...} - JavaScript variable assignment
    const varAssignPattern = /^(?:var|let|const)\s+\w+\s*=\s*(\{[\s\S]*\}|\[[\s\S]*\]);?$/;
    const varAssignMatch = trimmed.match(varAssignPattern);
    if (varAssignMatch) {
        return varAssignMatch[1];
    }

    // Pattern 4: x = {...} - Simple assignment
    const simpleAssignPattern = /^\w+\s*=\s*(\{[\s\S]*\}|\[[\s\S]*\]);?$/;
    const simpleAssignMatch = trimmed.match(simpleAssignPattern);
    if (simpleAssignMatch) {
        return simpleAssignMatch[1];
    }

    // Pattern 5: Remove trailing comma from object/array
    if ((trimmed.startsWith('{') && trimmed.endsWith('},')) ||
        (trimmed.startsWith('[') && trimmed.endsWith('],'))) {
        return trimmed.slice(0, -1);
    }

    // Pattern 6: JSON with log prefix like "> " or "| " on each line
    const lines = trimmed.split('\n');
    const prefixPattern = /^(?:[>|]\s*|\d+[:.]\s*)/;
    if (lines.length > 1 && lines.every(line => prefixPattern.test(line) || line.trim() === '')) {
        const cleanedLines = lines.map(line => line.replace(prefixPattern, ''));
        const cleaned = cleanedLines.join('\n').trim();
        if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
            return cleaned;
        }
    }

    // Pattern 7: Multiple "key": value pairs without outer braces
    // Like: "name": "John", "age": 30, "city": "Istanbul"
    const multiKeyPattern = /^"[^"]+"\s*:\s*(?:"[^"]*"|\d+(?:\.\d+)?|true|false|null|\{[\s\S]*?\}|\[[\s\S]*?\])(?:\s*,\s*"[^"]+"\s*:\s*(?:"[^"]*"|\d+(?:\.\d+)?|true|false|null|\{[\s\S]*?\}|\[[\s\S]*?\]))+$/;
    if (multiKeyPattern.test(trimmed)) {
        return `{${trimmed}}`;
    }

    return null;
};

/**
 * Safely parses JSON input, handling escaped strings, control characters,
 * double-encoded JSON strings, and common malformed patterns.
 * @param input - The JSON string to parse
 * @returns The parsed JSON value
 * @throws Error if the input cannot be parsed as valid JSON
 */
export const safeJsonParse = (input: string): unknown => {
    // First, try direct parsing
    try {
        const parsed = JSON.parse(input);

        // Handle double-encoded JSON strings
        if (typeof parsed === 'string') {
            try {
                const trimmed = parsed.trim();
                if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                    return JSON.parse(parsed);
                }
            } catch (e) {
                // Not double-encoded, return as-is
            }
        }
        return parsed;
    } catch (e) {
        // Direct parsing failed, try recovery strategies

        // Strategy 1: Try extracting JSON from common malformed patterns
        const extracted = tryExtractJson(input);
        if (extracted) {
            try {
                return JSON.parse(extracted);
            } catch (extractError) {
                // Extraction didn't help, continue with other strategies
            }
        }

        // Strategy 2: Handle quoted/escaped strings
        try {
            let cleaned = input.trim();

            // Wrapped in quotes - try to unescape
            if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
                try {
                    const unescaped = JSON.parse(cleaned);
                    if (typeof unescaped === 'string') {
                        if (unescaped.trim().startsWith('{') || unescaped.trim().startsWith('[')) {
                            return JSON.parse(unescaped);
                        }
                        return unescaped;
                    }
                    return unescaped;
                } catch (e2) {
                    // Continue with other strategies
                }
            }

            // Try cleaning escape sequences
            cleaned = cleaned
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\')
                .replace(/\\\//g, '/');

            // Handle control characters
            cleaned = cleaned.replace(/[\u0000-\u001F]+/g, (match) => {
                return match
                    .replace(/\b/g, '\\b')
                    .replace(/\f/g, '\\f')
                    .replace(/\n/g, '\\n')
                    .replace(/\r/g, '\\r')
                    .replace(/\t/g, '\\t');
            });

            return JSON.parse(cleaned);
        } catch (e3) {
            // Strategy 3: Try the extracted version with cleaning
            if (extracted) {
                try {
                    let cleaned = extracted
                        .replace(/\\"/g, '"')
                        .replace(/\\\\/g, '\\')
                        .replace(/\\\//g, '/');

                    cleaned = cleaned.replace(/[\u0000-\u001F]+/g, (match) => {
                        return match
                            .replace(/\b/g, '\\b')
                            .replace(/\f/g, '\\f')
                            .replace(/\n/g, '\\n')
                            .replace(/\r/g, '\\r')
                            .replace(/\t/g, '\\t');
                    });

                    return JSON.parse(cleaned);
                } catch (e4) {
                    // Final fallback - throw original error
                }
            }

            throw e;
        }
    }
};
