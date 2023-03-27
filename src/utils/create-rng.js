
export default function createRNG(seed) {
  return function (min, max) {
    if (min === undefined)[min, max] = [0, 1];
    var t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    const v = ((t ^ t >>> 14) >>> 0) / 4294967296;
    return min + (max - min) * v;
  }
}