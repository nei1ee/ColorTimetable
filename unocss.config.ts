import {
  defineConfig,
  presetIcons,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

// https://github.com/zguolee/unocss-preset-uni
import { presetUni } from 'unocss-preset-uni'

export default defineConfig({
  shortcuts: {
    'border-base': 'border-gray-200 dark:border-dark-200',
    'bg-base': 'bg-white dark:bg-dark-100/50',
    'bg-base-soft': 'bg-gray-100 dark:bg-dark-100',
    'color-base': 'text-gray-800 dark:text-gray-300',
    'color-fade': 'text-gray-800:50 dark:text-gray-300:50',
  },
  presets: [
    presetUni() as any,
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
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  rules: [
    ['p-safe', { padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)' }],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
})
