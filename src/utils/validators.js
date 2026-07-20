export function isValidEmail(value) {
  return /.+@.+\..+/.test(value || '');
}

export function isNonEmpty(value) {
  return String(value || '').trim().length > 0;
}
