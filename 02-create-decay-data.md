# 02-create-decay-data.md

## Overview
Create `public/decay-data.json` with isotope decays. Key: isotope like \"U235\". Value: object with protons, decays array [{type: \"alpha\"|\"beta\"|\"gamma\", product: \"Th231\"}].

## Examples
- U235: alpha -> Th231
- Th231: beta -> Pa231
- Include Uranium-238 chain examples.

## Steps
1. Create `public/decay-data.json`.
2. Add atomic numbers map or per isotope.
3. Load in Phaser via this.load.json().