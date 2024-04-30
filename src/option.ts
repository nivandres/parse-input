type Option = string | number;

const defaultOptions = new Array(11).fill(0).map((_, i) => i);

export function option<T extends readonly Option[] | Option[]>(
  input?: string | number,
  options: T = defaultOptions as unknown as T
): T[number] | undefined {
  input = ` ${input} `.replace(/[^0-9\w\pL]{0,}\s+[^0-9\w\pL]{0,}/gm, "  ");
  let option = [...options];
  option = option.sort(
    (a, b) => b.toString().length - a.toString().length
  ) as Option[];
  const r = ` ?(${option.join("|")}) ?`;
  input = input
    ?.match(new RegExp(r, "gi"))
    ?.sort(
      (a, b) =>
        b.split(" ").length - a.split(" ").length ||
        Number(option.includes(b.trim() as T[number])) -
          Number(option.includes(a.trim() as T[number]))
    )[0]
    .trim();
  input = option.find((o) =>
    o == input || o.toString().match(new RegExp(`[^0-9\w\pL]{0,}${input}[^0-9\w\pL]{0,}`, "gi")) ? o : false
  );
  return input as T[number];
}

export const select = option;
export const options = option;
