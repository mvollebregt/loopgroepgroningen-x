const nonWordChar = /[^0-9a-z]/gi;

export function normalizeString(value: string | undefined | null) {
  return value && value.trim().toLowerCase();
}

export function toTitleCase(value: string) {
  return value.toLowerCase()
    .split(nonWordChar)
    .filter(word => word !== '')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
