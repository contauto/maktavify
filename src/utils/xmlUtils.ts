/**
 * XML Utility Functions for Maktavify
 * - XML parsing and beautifying
 * - XML to JSON conversion
 * - JSON to XML conversion
 */

/**
 * Beautify XML string with proper indentation
 */
export function beautifyXml(xml: string, indentSize: number = 2): string {
    const PADDING = ' '.repeat(indentSize);
    let formatted = '';
    let indent = 0;

    // Remove existing whitespace between tags
    const cleanXml = xml.replace(/>\s*</g, '><').trim();

    // Handle XML declaration separately
    const xmlDeclMatch = cleanXml.match(/^<\?xml[^?]*\?>/);
    let remaining = cleanXml;

    if (xmlDeclMatch) {
        formatted = xmlDeclMatch[0] + '\n';
        remaining = cleanXml.substring(xmlDeclMatch[0].length);
    }

    // Tokenize the XML
    const tokens = remaining.match(/<[^>]+>|[^<]+/g) || [];

    tokens.forEach((token) => {
        if (token.match(/^<\/\w/)) {
            // Closing tag
            indent--;
            formatted += PADDING.repeat(indent) + token + '\n';
        } else if (token.match(/^<\w[^>]*[^\/]>$/)) {
            // Opening tag (not self-closing)
            formatted += PADDING.repeat(indent) + token + '\n';
            indent++;
        } else if (token.match(/^<\w[^>]*\/>$/)) {
            // Self-closing tag
            formatted += PADDING.repeat(indent) + token + '\n';
        } else if (token.match(/^<\?/)) {
            // Processing instruction
            formatted += token + '\n';
        } else if (token.match(/^<!--/)) {
            // Comment
            formatted += PADDING.repeat(indent) + token + '\n';
        } else if (token.trim()) {
            // Text content
            formatted += PADDING.repeat(indent) + token.trim() + '\n';
        }
    });

    return formatted.trim();
}

/**
 * Parse XML string and validate it
 * @throws Error if XML is invalid
 */
export function parseXml(xml: string): Document {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
        throw new Error(parseError.textContent || 'Invalid XML format');
    }

    return doc;
}

/**
 * Convert XML string to JSON object
 */
export function xmlToJson(xml: string): unknown {
    const doc = parseXml(xml);
    return nodeToJson(doc.documentElement);
}

/**
 * Helper: Convert XML node to JSON object
 */
function nodeToJson(node: Element): unknown {
    const result: Record<string, unknown> = {};

    // Handle attributes
    if (node.attributes.length > 0) {
        result['@attributes'] = {};
        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            (result['@attributes'] as Record<string, string>)[attr.name] = attr.value;
        }
    }

    // Handle child nodes
    const children = Array.from(node.childNodes);
    const hasOnlyTextContent = children.length === 1 && children[0].nodeType === Node.TEXT_NODE;

    if (hasOnlyTextContent) {
        const text = node.textContent?.trim() || '';
        if (Object.keys(result).length === 0) {
            return text;
        }
        result['#text'] = text;
    } else {
        children.forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const childElement = child as Element;
                const childName = childElement.tagName;
                const childValue = nodeToJson(childElement);

                if (result[childName] !== undefined) {
                    // Multiple elements with same name -> array
                    if (!Array.isArray(result[childName])) {
                        result[childName] = [result[childName]];
                    }
                    (result[childName] as unknown[]).push(childValue);
                } else {
                    result[childName] = childValue;
                }
            } else if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent?.trim();
                if (text) {
                    result['#text'] = text;
                }
            }
        });
    }

    return Object.keys(result).length === 0 ? '' : result;
}

/**
 * Convert JSON object to XML string
 */
export function jsonToXml(json: unknown, rootName: string = 'root'): string {
    if (typeof json !== 'object' || json === null) {
        return `<${rootName}>${escapeXml(String(json))}</${rootName}>`;
    }

    if (Array.isArray(json)) {
        return json.map((item) => jsonToXml(item, rootName)).join('\n');
    }

    let xml = '';
    const obj = json as Record<string, unknown>;
    const keys = Object.keys(obj);

    // Check if this is a wrapped object (single key that should be root)
    if (keys.length === 1 && typeof obj[keys[0]] === 'object' && !Array.isArray(obj[keys[0]])) {
        const actualRoot = keys[0];
        return jsonToXml(obj[actualRoot], actualRoot);
    }

    // Handle attributes
    let attributes = '';
    if (obj['@attributes'] && typeof obj['@attributes'] === 'object') {
        const attrs = obj['@attributes'] as Record<string, string>;
        attributes = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${escapeXml(String(value))}"`)
            .join('');
    }

    // Handle text content
    const textContent = obj['#text'] !== undefined ? escapeXml(String(obj['#text'])) : '';

    // Handle child elements
    const childXml = keys
        .filter((key) => key !== '@attributes' && key !== '#text')
        .map((key) => {
            const value = obj[key];
            if (Array.isArray(value)) {
                return value.map((item) => jsonToXml(item, key)).join('\n');
            }
            return jsonToXml(value, key);
        })
        .join('\n');

    if (childXml || textContent) {
        xml = `<${rootName}${attributes}>${textContent}${childXml}</${rootName}>`;
    } else {
        xml = `<${rootName}${attributes} />`;
    }

    return xml;
}

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Safe XML parse - returns parsed object or throws descriptive error
 */
export function safeXmlParse(input: string): unknown {
    const trimmed = input.trim();

    if (!trimmed) {
        throw new Error('Empty XML input');
    }

    if (!trimmed.startsWith('<')) {
        throw new Error('Invalid XML: must start with <');
    }

    return xmlToJson(trimmed);
}
