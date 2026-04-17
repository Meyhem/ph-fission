# 03-implement-atom-rendering.md

## Overview
In Phaser scene, parse isotope (e.g. U235 -> U=92p, 235-92=143n). Render grid of balls: red protons, blue neutrons.

## Steps
1. Create `src/scenes/AtomScene.ts` extending Phaser.Scene.
2. Load decay-data.json.
3. Function renderNucleus(isotope: string): group of circles in hexagonal/grid layout.
4. Start with U235.
5. Position balls randomly jittered for simulation feel.
6. Scale based on total nucleons.