export function normalizeString(value: string | undefined | null) {
  return value && value.trim().toLowerCase();
}
