export const createRandomNumber = (max) => Math.floor(Math.random() * max);

export const prefixHex = (color) => {
  if (!color) return
  return `#${color}`
}

