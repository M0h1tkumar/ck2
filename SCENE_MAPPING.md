# Scene Mapping Notes

This file exists to prevent future cleanup work from accidentally changing the shipped experience.

## Rule

Preserve the current visible characters, district presentation, and animation behavior exactly unless product direction explicitly changes.

## Intentional Pairings

- `public/earth/*` currently ships with the presentational character asset at `/fire/character.webp`
- `public/fire/*` currently ships with the presentational character asset at `/earth/character.webp`
- `public/water/*` currently ships with `/water/character.webp`

These pairings are intentional for the current experience. Folder names may be cleaned up later, but visible output should remain unchanged.

## Cleanup Guidance

- Safe cleanup: move files, rename folders, improve docs, add comments, or introduce clearer internal aliases
- Unsafe cleanup: swapping character assets, changing animation timing, changing district copy semantics, or "correcting" scene identity based only on folder names
