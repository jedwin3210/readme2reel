export function slugify(input, { separator = "-" } = {}) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), "");
}
