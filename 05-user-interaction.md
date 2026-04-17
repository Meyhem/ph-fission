# 05-user-interaction.md

## Overview
Make products clickable. On click, clear scene, render new atom as main, its products.

## Steps
1. Add input.hitArea to product groups, on('pointerdown').
2. Recursively load chain, but since tree, show current + products.
3. Track currentIsotope state.
4. Back button to parent?