# 01-initialize-solution.md

## Overview
Initialize npm, install Phaser 3 with TypeScript support using Vite, scaffold basic project structure, init git, and push to GitHub.

## Steps
1. `npm init -y`
2. Install deps: `npm i vite @vitejs/plugin-legacy phaser typescript @types/node`
3. Dev deps: `npm i -D @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint`
4. Create `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.ts` with Phaser Game setup.
5. `npm run dev` to test.
6. `git init`, add .gitignore, commit, `git remote add origin https://github.com/Meyhem/ph-fission.git`, `git push -u origin main`