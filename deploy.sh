#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# 🔧 先刪除舊的 .git（防止重複 init 問題）
# rm -rf .git

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# if you are deploying to https://shuming-yu.github.io
# git push -f git@github.com:shuming-yu/shuming-yu.github.io.git main

# if you are deploying to https://shuming-yu.github.io/Sheets
git push -f https://github.com/shuming-yu/Sheets.git main:gh-pages


cd -
