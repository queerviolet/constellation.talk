// SpaceKit colors from https://space-kit.netlify.app/

//-- Brand colors --//
const rgb = (r: number, g: number, b: number, a = 1.0) => ({
  a(a: number) { return rgb(r, g, b, a) },
  toString() {
    return `rgba(${r}, ${g}, ${b}, ${a})`
  },
})

export const pink = {
  darkest: rgb(102, 31, 78),
  darker: rgb(131, 35, 99),
  dark: rgb(196, 57, 151),
  base: rgb(242, 92, 193),
  light: rgb(255, 163, 224),
  lighter: rgb(255, 212, 241),
  lightest: rgb(255, 230, 247),
}

export const teal = {
  darkest: rgb(31, 102, 100),
  darker: rgb(29, 123, 120),
  dark: rgb(38, 162, 157),
  base: rgb(65, 217, 211),
  light: rgb(139, 246, 242),
  lighter: rgb(198, 255, 253),
  lightest: rgb(230, 255, 254),
}
export const indigo = {
  darkest: rgb(45, 31, 102),
  darker: rgb(49, 28, 135),
  dark: rgb(63, 32, 186),
  base: rgb(113, 86, 217),
  light: rgb(173, 155, 246),
  lighter: rgb(217, 207, 255),
  lightest: rgb(235, 230, 255),
}

//-- Neutrals --//
export const black = {
  darker: rgb(18, 21, 26),
  dark: rgb(20, 23, 28),
  base: rgb(25, 28, 35),
  light: rgb(34, 38, 46),
  lighter: rgb(47, 53, 63),
}

export const grey = {
  darker: rgb(66, 72, 85),
  dark: rgb(90, 98, 112),
  base: rgb(119, 127, 142),
  light: rgb(149, 157, 170),
  lighter: rgb(178, 185, 195),
}

export const silver = {
  darker: rgb(202, 208, 216),
  dark: rgb(222, 226, 231),
  base: rgb(235, 238, 240),
  light: rgb(244, 246, 248),
  lighter: rgb(252, 253, 255),
}

//-- Interface Colors --//
export const red = {
  darkest: rgb(102, 31, 31),
  darker: rgb(120, 28, 28),
  dark: rgb(156, 35, 35),
  base: rgb(209, 59, 59),
  light: rgb(241, 134, 134),
  lighter: rgb(255, 195, 195),
  lightest: rgb(255, 230, 230),
}
export const green = {
  darkest: rgb(20, 94, 51),
  darker: rgb(19, 108, 56),
  dark: rgb(28, 132, 72),
  base: rgb(54, 173, 104),
  light: rgb(126, 217, 164),
  lighter: rgb(190, 244, 213),
  lightest: rgb(230, 255, 240),
}

export const blue = {
  darkest: rgb(22, 60, 102),
  darker: rgb(15, 65, 122),
  dark: rgb(16, 83, 160),
  base: rgb(32, 117, 214),
  light: rgb(116, 176, 244),
  lighter: rgb(187, 219, 255),
  lightest: rgb(240, 247, 255),
}

//-- Alternate Colors --//
export const orange = {
  darkest: rgb(102, 63, 31),
  darker: rgb(136, 76, 30),
  dark: rgb(180, 102, 38),
  base: rgb(245, 145, 64),
  light: rgb(255, 193, 143),
  lighter: rgb(255, 226, 202),
  lightest: rgb(255, 241, 230),
}

export const yellow = {
  darkest: rgb(102, 80, 31),
  darker: rgb(132, 103, 29),
  dark: rgb(180, 143, 37),
  base: rgb(244, 208, 63),
  light: rgb(255, 232, 142),
  lighter: rgb(255, 244, 202),
  lightest: rgb(255, 250, 230),
}

export const purple = {
  darkest: rgb(66, 22, 102),
  darker: rgb(82, 21, 132),
  dark: rgb(113, 30, 180),
  base: rgb(162, 61, 245),
  light: rgb(205, 143, 255),
  lighter: rgb(232, 204, 255),
  lightest: rgb(244, 230, 255),
}

export const blilet = {
  darkest: rgb(27, 34, 64),
  darker: rgb(37, 46, 80),
  dark: rgb(60, 74, 133),
  base: rgb(81, 104, 194),
  light: rgb(122, 146, 240),
  lighter: rgb(176, 190, 247),
  lightest: rgb(230, 235, 255),
}

export const midnight = {
  darkest: rgb(6, 15, 47),
  darker: rgb(27, 34, 64),
  dark: rgb(56, 61, 91),
  base: rgb(61, 75, 106),
  light: rgb(86, 105, 146),
  lighter: rgb(121, 143, 187),
  lightest: rgb(180, 195, 219),
}