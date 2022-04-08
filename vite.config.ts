import path from 'path'
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnocssToUni from 'vite-plugin-unocss-to-uni'

// https://vitejs.dev/config/
export default defineConfig({
  root: process.cwd(),
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
      '#/': `${path.resolve(__dirname, 'types')}/`,
    },
  },
  plugins: [
    uni(),
    Unocss(),
    UnocssToUni(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
      ],
      dts: 'src/auto-imports.d.ts',
    }),
  ],
})
