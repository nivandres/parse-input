// old

type Capitalization =
  | "lowercase"
  | "uppercase"
  | "default"
  | "random"
  | "inverse"
  | true;
const symbols = {
  common: ".,?:;!¡¿\"'()",
  words: "A-Za-z",
  numbers: "0123456789",
  math: "\\[\\]\\(\\)\\+\\-\\_\\*\\/&\\\\^%#\\~\\|\\<\\>\\{\\}",
  lang: "ñáéíóúÁÉÍÓÚüÿäëïÜ`¨",
  extra: "@$€£¥₹₽₿°",
  none: "",
} as const;
type Symbols = keyof typeof symbols;

export interface FormatSettings {
  trim?: boolean;
  removeSpace?: boolean | "strict" | string;
  removeSymbol?:
    | "unknown"
    | "strict"
    | boolean
    | {
        symbol?: Symbols | RegExp | string | (Symbols | string)[];
        includes?: boolean;
        replace?: string;
      };
  filterSpanish?: boolean;
  capitalize?:
    | Capitalization
    | false
    | {
        firstCharPerWord?: Capitalization;
        firstCharAfterPoint?: Capitalization;
        lastCharPerWord?: Capitalization;
        wordChars?: Capitalization;
      };
  repeatSymbol?: boolean;
  allowLineBreak?: boolean;
  autoDot?: boolean;
}

export function format(input: string, settings?: FormatSettings) {
  const trim = settings?.trim ?? true;
  const filterSpanish = settings?.filterSpanish ?? false;
  const removeSpace = settings?.removeSpace ?? true;
  const allowLineBreak = settings?.allowLineBreak ?? false;
  const removeSymbol = settings?.removeSymbol ?? false;
  const capitalize = settings?.capitalize;
  const repeatSymbol = settings?.repeatSymbol ?? false;
  const autoDot = settings?.autoDot ?? allowLineBreak;

  const space = removeSpace === "strict" ? "" : typeof removeSpace === "string" ? removeSpace : " ";

  let text = input;

  if (trim) {
    text = text.trim();
  }
  if (filterSpanish) {
    text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  if (removeSpace) {
    if (allowLineBreak) {
      text = text.replace(/\n/, "∴");
    } else {
      text = text
        .split("\n")
        .map((v) => v.trim())
        .join("\n");
      text = text.replace(/. *\n/, ". ");
      text = text.replace(/ *\n/, ". ");
    }
    text = text.replace(/\s+/g, space);
    if (allowLineBreak) {
      text = text.replaceAll("∴", "\n");
    }
  }
  if (removeSymbol) {
    if (typeof removeSymbol === "string") {
      if (removeSymbol === "strict") {
        text = text.replace(/[^a-zA-Z0-9\s+]/g, "");
      } else {
        text = text.replace(
          new RegExp(`[^\\s+${Object.values(symbols).join("")}]`, "g"),
          ""
        );
      }
    } else if (typeof removeSymbol === "boolean") {
      text = text.replace(
        new RegExp(`^${symbols.common + symbols.words + symbols.numbers}`),
        ""
      );
    } else {
      const { includes, replace } = removeSymbol;
      let { symbol } = removeSymbol;
      if (symbol && symbol instanceof RegExp) {
        if (!includes) {
          text = text.replace(symbol, replace || "");
        } else {
          const r = symbol;
          text = text
            .split("")
            .map((v: string) => {
              if (v.match(r)) {
                return v;
              }
              return replace || "";
            })
            .join("");
        }
      } else if (symbol) {
        if (!Array.isArray(symbol)) {
          symbol = [symbol] as (Symbols | string)[];
        }
        symbol = symbol.map((v) => {
          if (Object.keys(symbols).includes(v)) {
            return symbols[v as Symbols] as string;
          }
          return v;
        });
        symbol = Array.from(new Set(symbol)).join("");
        text = text.replace(
          new RegExp(`[${includes ? "^\\s+" : ""}${symbol}]`, "gi"),
          replace || ""
        );
      } else {
        text = text.replace(/[^a-zA-Z0-9]/g, "");
      }
    }
  }
  if (typeof capitalize !== "undefined") {
    const manageCapitalize = (
      t: string,
      cap: Capitalization,
      isWord?: boolean
    ) => {
      switch (cap) {
        case true:
          t = t.toUpperCase();
          break;
        case "lowercase":
          t = t.toLowerCase();
          break;
        case "inverse":
          t = t.toLocaleUpperCase() === t ? t.toLowerCase() : t;
          break;
        case "uppercase":
          t = t.toUpperCase();
          break;
        case "random":
          t = t
            .split(isWord ? space : "")
            .map((v) =>
              Math.random() > 0.5 ? v.toLowerCase() : v.toUpperCase()
            )
            .join(isWord ? space : "");
          break;
        default:
          break;
      }
      return t;
    };

    if (typeof capitalize === "boolean") {
      text = capitalize ? text.toUpperCase() : text.toLowerCase();
    } else if (typeof capitalize === "string") {
      text = manageCapitalize(text, capitalize, true);
    } else {
      const {
        firstCharPerWord,
        firstCharAfterPoint,
        lastCharPerWord,
        wordChars,
      } = capitalize;

      text = text
        .split(space)
        .map((word, i, words) =>
          word
            .split("")
            .map((char, j) => {
              if (j === 0 || (word[j - 1] || "@").match(/[^A-Za-z]/gi)) {
                if (
                  i === 0 ||
                  (word[j - 1] || "@").match(/\[\].!;:?¿¡()\n]/g) ||
                  words[i - 1][words[i - 1].length - 1].match(
                    /\[\].!;:?¿¡()\n]/g
                  )
                ) {
                  return manageCapitalize(
                    char,
                    firstCharAfterPoint ||
                      firstCharPerWord ||
                      wordChars ||
                      "default"
                  );
                }
                return manageCapitalize(
                  char,
                  firstCharPerWord || wordChars || "default"
                );
              }
              if (j === word.length - 1) {
                return manageCapitalize(
                  char,
                  lastCharPerWord || wordChars || "default"
                );
              }
              return manageCapitalize(char, wordChars || "default");
            })
            .join("")
        )
        .join(space);
    }
  }
  if (!repeatSymbol) {
    // dont repeat symbols
    text = text.replaceAll("...", "∴");
    text = text.replace(/([^0-9A-Za-z])\1+/g, "$1");
    text = text.replaceAll("∴", "...");
    text = text.replaceAll("....", "...").trim();
  }
  if (autoDot) {
    let t = text.split("\n");
    t = t.map((l) => {
      const last = l[l.length - 1];
      if (
        last &&
        t.length > 1 &&
        l.length > 1 &&
        !last.match(/[.!?\]);>"'_]/gi)
      ) {
        if (
          last.match(
            new RegExp(
              `[${symbols.words + symbols.numbers + symbols.lang}]`,
              "gi"
            )
          )
        ) {
          return `${l}.`;
        }
        if ((l[l.length - 2] + last).match(/\p{Extended_Pictographic}/gu)) {
          return l;
        }
        return `${l.slice(0, -1)}.`;
      }
      return l;
    });
    text = t.join("\n");
  }
  if (!repeatSymbol) {
    // dont repeat symbols
    text = text.replaceAll("...", "∴");
    text = text.replace(/([^0-9A-Za-z])\1+/g, "$1");
    text = text.replaceAll("∴", "...");
    text = text.replaceAll("....", "...");
  }
  return text;
}

const capitalization = (l: string) => {
  if (l === "A") return "uppercase";
  if (l === "a") return "lowercase";
  if (typeof l == "string") l.toLowerCase();
  if (l === "r") return "random";
  if (l === "i") return "inverse";
  return "default";
};

export default function formatPattern(pattern: string) {
  let input = pattern;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const configuration: any = {
    capitalize: {},
  };
  const symbol = [];
  const symbol_match = input.match(/\[(?<content>.{1,})\]/im);
  if (symbol_match) {
    symbol.push(symbol_match.groups?.content);
    input = input.replace(/\[(?<content>.{1,})\]/im, "");
  }
  let replace: string = "";
  const replace_match = input.match(/{(?<content>.{1,})}/im);
  if (replace_match) {
    replace = replace_match.groups?.content ?? "";
    input = input.replace(/{(?<content>.{1,})}/im, "");
  }
  const CapAp = input.match(/[. ][aird]/gim);
  if (CapAp) {
    console.log(CapAp);
    configuration.capitalize.firstCharAfterPoint = capitalization(CapAp[0][1]);
    input = input.replace(/[. ][aird]/i, "");
  }
  const Cap = input.match(/[aird]/gim);
  if (Cap) {
    console.log(Cap);
    configuration.capitalize.firstCharPerWord = capitalization(
      Cap[0] || (CapAp?.[0] || [])[1]
    );
    configuration.capitalize.wordChars = capitalization(Cap[1] || Cap[0]);
    configuration.capitalize.lastCharPerWord = capitalization(
      Cap[2] || Cap[1] || Cap[0]
    );
    configuration.capitalize.firstCharAfterPoint ??=
      configuration.capitalize.firstCharPerWord;
    // input = input.replace(/[aird]/i, '');
  }
  configuration.trim = input.includes(" ");
  configuration.repeatSymbol = !input.includes("+");
  configuration.allowLineBreak = input.includes("\n");
  configuration.filterSpanish = input.includes("n");
  configuration.removeSpace = input.includes("_*")
    ? "strict"
    : input.includes("_");
  configuration.autoDot = !input.includes(".!");
  configuration.removeSymbol = input.includes("?")
    ? "unknown"
    : input.includes("-*") || input.includes("-!*")
    ? "strict"
    : input.includes("-");
  if (input.includes("z")) symbol.push("words");
  if (input.includes(",")) symbol.push("common");
  if (input.includes("9")) symbol.push("numbers");
  if (input.includes("^")) symbol.push("math");
  if (input.includes("ñ")) symbol.push("lang");
  if (input.includes("@")) symbol.push("extra");
  if (input.includes("0")) symbol.push("none");
  if (replace || symbol.length > 0) {
    if (input.includes("?"))
      symbol.push("words", "numbers", "math", "lang", "common");
    if (input.includes("-*") || input.includes("-!*"))
      symbol.push("words", "numbers");
    configuration.removeSymbol = {
      symbol,
      includes: !(input.includes("-!") || input.includes("-*!")),
      replace,
    };
  }

  return configuration as FormatSettings;
}
