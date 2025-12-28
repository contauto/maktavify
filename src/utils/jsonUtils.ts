/**
 * Safely parses JSON input, handling escaped strings, control characters,
 * and double-encoded JSON strings.
 * @param input - The JSON string to parse
 * @returns The parsed JSON value
 * @throws Error if the input cannot be parsed as valid JSON
 */
export const safeJsonParse = (input: string): unknown => {
    try {
        const parsed = JSON.parse(input);

        if (typeof parsed === 'string') {
            try {
                const trimmed = parsed.trim();
                if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                    return JSON.parse(parsed);
                }
            } catch (e) {
            }
        }
        return parsed;
    } catch (e) {
        try {
            let cleaned = input.trim();

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
                }
            }

            cleaned = cleaned
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
        } catch (e3) {
            throw e;
        }
    }
};
