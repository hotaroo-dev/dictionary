const fontMapping: {
  [index: string]: string
} = {
  Serif: 'font-serif',
  'Sans serif': 'font-sans',
  Monospace: 'font-mono'
}

export default function getFont(font: string) {
  return fontMapping[font]
}
