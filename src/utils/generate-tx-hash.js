import createRNG from "@/utils/create-rng";

export default function generateTxHash(seed) {
  const rng = createRNG(seed);
  return "0x" + Array(64).fill().map(_ => Math.floor(16*rng()).toString(16)).join("");
}