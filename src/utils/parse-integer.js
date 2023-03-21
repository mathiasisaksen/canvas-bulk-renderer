
export default function parseInteger(value) {
  return isNaN(value) || value === "" ? undefined : parseInt(value);
}