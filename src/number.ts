interface NumberFormatOptions {
  noNegative?: boolean;
  noDecimal?: boolean;
  defaultValue?: number;
}

export function number(
  input?: string,
  options: NumberFormatOptions = {}
): number {
  input = input?.replace(/[^0-9\.,\- ]+/gi, "_");
  input = input
    ?.replace(/(_ _| _ )+/gi, "~")
    .split("~")
    .find((x) => x.match(/\d+/g));
  if (!input) return options.defaultValue ?? NaN;
  input = input.replace(/(_| )+/gi, "_");
  let prefix = "";
  if (input.includes("-")) {
    if (!options.noNegative && input.match(/^[^\d]*-/g)) prefix = "-";
    input = input.replace(/_*\-+_*/g, "_");
  }
  if (input.includes(",")) input = input.replace(/_*,{1,2}_*/g, ",");
  if (input.includes(".")) input = input.replace(/_*\.{1,2}_*/g, ".");
  input.replace(/_+/g, "_");
  const c = [...input].find((x) => [",", "."].includes(x)) ?? ".";
  if (input.split(c).length === 2) {
    input = input.replace(new RegExp(`_|${c == "." ? "," : "\\."}`, "g"), "");
    input = input.replace(/,/g, ".");
  } else if (input.split(c == "." ? "," : ".").length === 2) {
    input = input.replace(new RegExp(`_|${c == "." ? "\\." : c}`), "");
    input = input.replace(/,/g, ".");
  } else {
    input = input.replace(/\.|,/g, "_");
    input.replace(/_+/g, "_");
    const split = input.split("_").filter((a) => a);
    if (split.every((n, i, a) => n === (i == 0 ? n : a[i - 1]))) {
      input = split[0];
    } else if (
      !options.noDecimal &&
      ((split[0].length <= 3 &&
        split.length > 2 &&
        split
          .filter((_, i) => i !== 0 && i !== split.length - 1)
          .every((n) => n.length === 3) &&
        split[split.length - 1].length !== 3) ||
        (split.length == 2 &&
          ((split[0].length > 2 &&
            (split[0].length !== 3 || split[1].length !== 3)) ||
            (split[0].length == 2 && split[1].length > 1) ||
            split[1].length > 3)))
    ) {
      const suffix = `.${split.pop()}`;
      input = split.join("") + suffix;
    } else {
      input = split.join("");
    }
  }
  input = prefix + input;
  return options?.noDecimal ? parseInt(input) : parseFloat(input);
}

export const num = number;

export function integer(input?: string, noNegative?: boolean): number {
  return number(input, { noDecimal: true, noNegative });
}

export const float = number;

export function natural(input?: string, noDecimal: boolean = true): number {
  return number(input, { noDecimal, noNegative: true });
}

export const quantity = natural;

export function positive(input?: string, noDecimal?: boolean): number {
  return number(input, { noDecimal, noNegative: true });
}

export const pos = positive;
export const absolute = positive;
export const abs = positive;
