/**
 * Convert a string to snake case
 * @param text
 * @returns example: "hello_world"
 */
export const convertToSnakeCase = (text: string) => {
  return text.toLowerCase().replace(/\s+/g, '_');
};
