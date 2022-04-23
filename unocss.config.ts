import {
  defineConfig,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { unocssToUniProcess } from 'vite-plugin-unocss-to-uni'

export default defineConfig({
  shortcuts: [],
  presets: [
    presetUno(),
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
})
