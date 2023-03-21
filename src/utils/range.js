
export default function range(a, b) {
  return Array(b - a + 1).fill().map((_, i) => a + i);
}