export function toString(x: any) {
    return x + '';
}

export function isString(x: any) {
    return typeof x === 'string';
}

export function isUndefined(x: any) {
    return x === undefined;
}

export function escapeAttributeValue(attributeValue: string) {
    return attributeValue.replace(/"/g, '&quot;');
}
