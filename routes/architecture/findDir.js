const { join } = require("path");

const validate = (value) => {
  if (value && value.constructor !== RegExp)
    throw new Error(
      `${JSON.stringify(
        value
      )} must be regex for a file pattern or null for any pattern`
    );
};

/**
 * @typedef {{ [k: string]: O | null }} O
 * @param {O} o
 * @param {string} dirname
 *
 * @returns {null | import("../router/useRouters").FullPath}
 */
const findDir = (o, dirname, path = "") => {
  for (const key in o) {
    if (key === dirname) {
      validate(o[key]);
      return { path: join(path, key), regex: o[key] || /.*/ };
    }

    const found = findDir(o[key], dirname, join(path, key));
    if (found) return found;
  }

  return null;
};

/**
 * @param {O} o
 * @param {string} dirname
 *
 * @returns {import("../router/useRouters").FullPath}
 */
exports.safeFindDir = (o, dirname) => {
  const result = findDir(o, dirname);
  if (result === null)
    throw new Error(`\x1b[2mCouldn't find the \x1b[0m\x1b[1m"${dirname}"\x1b[0m\x1b[2m directory in this architecture:\x1b[0m\x1b[1m\x1b[31m

${JSON.stringify(o, null, 2)}
\x1b[0m`);

  return result;
};
