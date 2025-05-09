## Handsontable & Jspreadsheet 測試

- [Demo連結](https://shuming-yu.github.io/Sheets/#/)

- [x] Handsontable: https://handsontable.com/docs/12.0/

- [x] Jspreadsheet: https://bossanova.uk/jspreadsheet/docs/getting-started

```sh
npm init vite Sheets -- --template vue
npm install --save quasar @quasar/extras
npm install --save-dev @quasar/vite-plugin sass-embedded@^1.80.2

npm install handsontable @handsontable/vue3
# npm install @jspreadsheet-ce/vue@5
npm install jspreadsheet-ce@4

npm install axios
npm install dayjs
npm install --save vue-i18n
npm install --save-dev @intlify/unplugin-vue-i18n

npm install postcss-prefix-selector
```

## 部署 Vite 專案至 GitHub Pages

1. 在 vite.config.js 加入 base
```
base: '/Sheets/',
```
2. deploy.sh 部署至 GitHub Pages
```
& "C:\Program Files\Git\bin/sh.exe" deploy.sh
```
3. 查看專案 gh-pages 分支

### 參考

- deploy.sh 部署(v3版本): https://v3.vitejs.dev/guide/static-deploy.html#github-pages

- GitHub Actions 部署(v4版本以上): https://cn.vite.dev/guide/static-deploy#github-pages

  - 使用 GitHub Actions 部署到 GitHub Pages: https://tzuhui.io/2020/12/11/Vue/Vue-deploy-github-actions/

  - GitHub Token: https://docs.github.com/zh/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens