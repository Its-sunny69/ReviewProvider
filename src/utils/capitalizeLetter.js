export function capitalizeFirstLetter(str) {
  if (typeof str !== "string") return "str is not a string"; // Ensure str is a string
  if (!str.length) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
