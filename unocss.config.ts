import type { PreflightContext } from 'unocss'
import {
  defineConfig,
  entriesToCss,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { unocssToUniProcess } from 'vite-plugin-unocss-to-uni'

export default defineConfig({
  shortcuts: {
    'border-base': 'border-gray-200 dark:border-dark-200',
    'bg-base': 'bg-white dark:bg-dark-100',
    'color-base': 'text-gray-900 dark:text-gray-300',
    'color-fade': 'text-gray-900:50 dark:text-gray-300:50',
  },
  presets: [
    {
      ...presetUno(),
      preflights: [
        {
          layer: 'preflights',
          getCSS(ctx: PreflightContext<any>) {
            if (ctx.theme.preflightBase)
              return `page{${entriesToCss(Object.entries(ctx.theme.preflightBase))}}`
          },
        },
      ],
    },
    presetIcons({
      scale: 1.2,
      warn: true,
      // 其他选项
      prefix: 'i-',
      extraProperties: {
        display: 'inline-block',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  postprocess: (t) => {
    t.selector = unocssToUniProcess(t.selector)
    return t
  },
  rules: [
    ['p-safe', { padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)' }],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
})
