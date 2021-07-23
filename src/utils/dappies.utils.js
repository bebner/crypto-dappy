import faker from "faker"
import Please from "pleasejs"
import { COMMON, DAPPY_RARITY_DISTRIBUTION, DEFAULT_DAPPIES, RARE, ULTRARARE } from "../config/dappies.config";
import { prefixHex, createRandomNumber } from "./utils"

export const parseDNA = (dna) => dna.split(".")

export const calculatePrice = (dna) => {
  if (dna >= 31) {
    return 21.0
  } else if (dna >= 25) {
    return 14.0
  } else {
    return 7.0
  }
}

export const createRandomHexColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const generateStripeColors = (dna) => {
  const stripes = dna.split(".")
  stripes.pop()
  let colors = []
  for (let index = 0; index < stripes.length; index++) {
    const color = prefixHex(stripes[index]);
    colors.push(color)
  }
  return colors
}

export const generateEyeColor = (dna) => {
  const dnaArray = dna.split(".")
  const index = dnaArray[dnaArray.length - 1]
  return prefixHex(dnaArray[index]) || prefixHex(index)
}

export const createRandomDNA = (rarity = 3, customEyes) => {
  let dna = ""
  for (let index = 0; index < rarity; index++) {
    dna += createRandomHexColor() + "."
  }
  if (customEyes) {
    dna += createRandomHexColor()
  } else {
    dna += createRandomNumber(rarity)
  }
  return dna
}

export const createRandomDappies = (number = 1, options) => {
  let dappies = [];
  let { customRarity, theme, baseColor, fullRandom = false } = options
  for (let i = 0; i < number; i++) {
    console.log(i)
    let rarity = customRarity || DAPPY_RARITY_DISTRIBUTION[createRandomNumber(DAPPY_RARITY_DISTRIBUTION.length)]
    let newborn = {
      name: `${faker.name.firstName()} Dappy`,
      dna: theme ? createThemedDNA(rarity, baseColor, fullRandom, theme) : createRandomDNA(rarity),
      templateID: i + 1
    }
    dappies.push(newborn)
  }
  return dappies;
}

// Themes: mono, complement, split, double, ana, tri
export const createThemedDNA = (rarity, base_color, full_random, theme) => {
  const options = base_color ? { format: "hsv", full_random, base_color } : { format: "hsv", full_random }
  let startingColor = Please.make_color(options)
  let scheme;
  let customTheme = typeof theme === "string"

  switch (rarity) {
    case COMMON.stripes:
      scheme = Please.make_scheme(...startingColor, { scheme_type: customTheme ? theme : "split" })
      console.log("cOMMON", scheme)
      break;
    case RARE.stripes:
      scheme = Please.make_scheme(...startingColor, { scheme_type: customTheme ? theme : "double" })
      console.log("4", scheme)
      break;
    case ULTRARARE.stripes:
      scheme = Please.make_scheme(...startingColor, { scheme_type: customTheme ? theme : "mono" })
      console.log("c5", scheme)
      break;
    default:
      scheme = Please.make_scheme(...startingColor, { scheme_type: customTheme ? theme : "mono" })
      break;
  }

  let dna = ""

  for (let index = 0; index < rarity; index++) {
    let colorToAdd = scheme[index] ? scheme[index] : scheme[createRandomNumber(scheme.length)]
    dna += colorToAdd?.replace("#", "") + "."
  }

  dna += createRandomNumber(rarity)

  return dna
}

export const generateDappies = (dappies = DEFAULT_DAPPIES) => {
  const generatedDappies = dappies.map(d => {
    return {
      templateID: d?.templateID,
      dna: d?.dna,
      name: d?.name,
      price: calculatePrice(d?.dna?.length)
    }
  })
  return generatedDappies
}

// export const RANDOM_DAPPIES = createRandomDappies(12, { theme: true, baseColor: "red", customRarity: 5 })