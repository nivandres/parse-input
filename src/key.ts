export function key(input?: string | number, key?: string | number) {
  key = key?.toString().trim() || "A";
  const r = `^([^\\w\\pL]|${key})*${key}([^\\w\\pL]|${key})*$`;
  const match = input?.toString().trim().match(new RegExp(r, "gi"));
  return Boolean(match);
}

export const press = key;
export const command = key;
export const action = key;
