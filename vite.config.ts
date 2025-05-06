import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import prefixer from 'postcss-prefix-selector'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    // vueDevTools(),
    quasar()
  ],

  css: {
    postcss: {
      plugins: [
        prefixer({
          prefix: '.myPrefix',
          transform(prefix: any, selector: string, prefixedSelector: any, filePath: string ) {
            // 僅對以下來源進行 prefix
            const shouldPrefix = filePath.includes('jspreadsheet-ce') || filePath.includes('jsuites');

            if (!shouldPrefix) {
              return selector; // 不處理其他樣式
            }

            // 避免 html 和 body 選擇器被破壞
            if (/^(html|body)/.test(selector)) {
              return selector.replace(/^([^\s]*)/, `$1 ${prefix}`);
            }

            return prefixedSelector;
          },
        }),
      ],
    }
  },

  base: '/Sheets/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
