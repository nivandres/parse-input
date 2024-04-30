export const text = (txt: string = "") => {
  let text = txt.trim().replace(/\s+/g, " ");
  text = text
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return text;
};
