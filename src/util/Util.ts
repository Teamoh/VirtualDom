export function toString(x: any, defaultValue?: any) {
    return (!x && !isUndefined(defaultValue)) ? defaultValue : (x + '');
}

export function isString(x: any) {
    return typeof x === 'string';
}

export function isUndefined(x: any) {
    return x === undefined;
}

export function isNull(x: any) {
    return x === null;
}

export function isNullOrUndefined(x: any) {
    return isNull(x) || isUndefined(x);
}

export function isFunction(x: any) {
    return typeof x === 'function';
}

export function isArray(x: any) {
    return Object.prototype.toString.call(x) === '[object Array]';
}

export function escapeAttributeValue(attributeValue: string) {
    return attributeValue.replace(/"/g, '&quot;');
}

/**
 * Checks if the haystack starts with the needle
 * @param haystack - The haystack string to check
 * @param needle - The needle string
 */
export function startsWith(haystack: string, needle: string) {
    return haystack.lastIndexOf(needle, 0) === 0;
}

/**
 * Checks if the haystack ends with the needle
 * @param haystack - The haystack string to check
 * @param needle - The needle string
 */
export function endsWith(haystack: string, needle: string) {
    const index = Math.max(0, haystack.length - needle.length);
    return haystack.indexOf(needle, index) === index;
}

/**
 * Camelcases the given input string
 * @param str - The string to camelcase
 * @param seperators - The separators for camelcasing
 */
export function camelCase(str: string, seperators = ['-', '_']) {
    let resultStr = str;

    seperators.forEach(separator => {
        let separatorIndex = resultStr.indexOf(separator);

        while (separatorIndex > -1) {
            const part1 = resultStr.substring(0, separatorIndex);
            const part2 = resultStr.substring(separatorIndex + 1);
            const upperCaseChar = part2.charAt(0).toUpperCase();

            resultStr = part1 + upperCaseChar + part2.substring(1);
            separatorIndex = resultStr.indexOf(separator);
        }
    });

    return resultStr;
}

/**
 * Uncamelcases the given input string
 * @param str - The string to uncamelcase
 * @param seperators - The separators to use after uncamelcasing
 */
export function unCamelCase(str: string, separator = '-') {
    let resultStr = str;

    for (let i = 0, iLen = resultStr.length; i < iLen; i++) {
        const currentChar = resultStr[i];

        // if the current char has a lower-case/upper-case version and is in upper-case
        if (currentChar.toLowerCase() !== currentChar.toUpperCase() && currentChar === currentChar.toUpperCase()) {
            // cut the part before the char
            const lowerCaseCurrentChar = currentChar.toLowerCase();
            const beforePart = resultStr.substring(0, i);
            const afterPart = resultStr.substring(i + 1);

            if (beforePart[beforePart.length - 1] !== separator && afterPart[0] !== separator) {
                resultStr = beforePart + separator + lowerCaseCurrentChar + afterPart;
            }
        }
    }

    return resultStr;
}

export function iterableToArray(iterable: any): Array<any> {
    return [...iterable];
}

export function toBoolean(x: any) {
    return !!x;
}

export function trim(x: string): string {
    if (!x || !isString(x)) {
        return '';
    }

    return x.trim();
}

export const generateId = (() => {
    const ids = new Set();
    const defaultCharset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ0123456789';

    function generate(len: number, charset: string) {
        let id = '';

        for (let i = 0; i < len; i++) {
            id += charset[Math.floor(Math.random() * charset.length)];
        }

        return id;
    }

    return (len: number, charset?: string) => {
        len = len || 20;

        let id: string;

        do {
            id = generate(len, charset || defaultCharset);
        } while (ids.has(id));

        ids.add(id);
        return id;
    };
})();
