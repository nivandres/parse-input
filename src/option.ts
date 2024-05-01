type Option = string | number;

const defaultOptions = new Array(11).fill(0).map((_, i) => i);

export function getOption<T extends readonly Option[] | Option[]>(
  input?: string | number,
  options: T = defaultOptions as unknown as T
): T[number] | undefined {
  if (typeof options === "string") return getOption(input, [options]);
  input = ` ${input} `.replace(/[^0-9\w\pL]*\s+[^0-9\w\pL]*/gm, "  ");
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
    o == input || o.toString().match(new RegExp(`[^0-9\\w\\pL]*${input}[^0-9\\w\\pL]*`, "gi")) ? o : false
  );
  return input as T[number];
}

export const select = getOption;
export const option = getOption;
export const options = getOption;

