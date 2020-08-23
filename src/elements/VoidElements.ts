export const voidElementNames = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
];

export function isVoidElement(elementName: string) {
    return voidElementNames.indexOf(elementName) !== -1;
}
