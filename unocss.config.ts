import type { Preset, SourceCodeTransformer } from 'unocss'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import {
  presetApplet,
  presetRemToRpx,
  transformerApplet,
  transformerAttributify,
} from 'unocss-applet'

const presets: Preset[] = []
const transformers: SourceCodeTransformer[] = []

if (process.env.UNI_PLATFORM === 'h5') {
  presets.push(presetUno())
  // presets.push(presetAttributify())
}
else {
  presets.push(presetApplet())
  presets.push(presetRemToRpx())

  transformers.push(transformerAttributify())
  transformers.push(transformerApplet())
}

export default defineConfig({
  shortcuts: {
    'bg-base': 'bg-gray-100 dark:bg-dark',
    'bg-base-second': 'bg-white dark:bg-dark-100',
    'color-base': 'text-gray-700 dark:text-gray-200/50',
    'color-base-second': 'text-gray-400 dark:text-gray-500/50',
    'border-base': 'border border-gray-200 dark:border-gray/50',
    'bg-primary': 'bg-light-blue-500 dark:bg-light-blue-600',
  },
  presets: [
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'Noto Sans',
        serif: 'Noto Serif',
        mono: 'Noto Sans Mono',
      },
    }),
    // add here to enable unocss attributify mode prompt although preset is not working
    presetAttributify(),
    ...presets,
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    ...transformers,
  ],
  rules: [
    ['p-safe', { padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)' }],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
})
