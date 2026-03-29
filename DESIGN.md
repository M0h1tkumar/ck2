# Design System Specification: Imperial Resonance

## Overview

Creative north star: `The Sovereign's Decree`.

The current experience is meant to feel ceremonial, atmospheric, and weighty rather than app-like. The visual language should suggest an imperial manuscript, a sacred arena, and a mythic machine all at once.

This repo currently delivers that mood through:

- a dark red-black base palette
- restrained gold highlights
- serif-forward typography
- layered glows, fog, gradients, and depth
- a full-screen immersive 3D landing experience

## Active Implementation

The live site is not a sectioned React marketing page. The active experience is:

- Next.js app shell
- iframe wrapper in `components/home/ThreeDShowcase.tsx`
- main visual system in `public/3d/index.html`
- elemental sub-scenes in `public/earth`, `public/fire`, and `public/water`

When making design changes, optimize for the shipped static experience first.

## Color System

Primary palette:

- Background: `#1C1010`
- Surface high: `#342727`
- Surface highest: `#3F3131`
- Primary: `#FFB4A8`
- Primary container: `#8B0000`
- Secondary gold: `#E9C349`
- Secondary container: `#AF8D11`
- On background: `#F4DDDD`
- On surface variant: `#E3BEB8`

Usage rules:

- Avoid flat white backgrounds and generic light UI.
- Use gold as an accent, not as a base surface.
- Prefer tonal separation over harsh borders.
- Treat layers as atmospheric depth, not card stacks from a dashboard template.

## Typography

Primary UI font:

- `Noto Serif` for the Next shell and shared theme

Immersive scene fonts:

- `Cinzel` for ceremonial headings
- `Cormorant Garamond` for narrative and supporting text inside `public/3d/index.html`

Guidelines:

- Headings should feel formal and deliberate.
- Body text should remain readable against dark textured backgrounds.
- Favor uppercase labels sparingly for navigation and ritual-like prompts.

## Motion And Depth

- Use slow glows, pulse states, and deliberate reveals.
- Prefer large soft shadows and fog-like atmosphere over sharp drop shadows.
- Movement should feel ritualistic and intentional, not playful.

## Component Direction

For the active experience:

- The 3D shell is the primary interface.
- Elemental destinations should read as districts or realms within the main world.
- Overlay panels should feel like etched glass or ceremonial plaques.

Avoid:

- default SaaS layouts
- bright UI chrome
- generic rounded-pill-heavy styling
- dense icon-driven interfaces

## Maintenance Notes

- Keep naming consistent across docs and the 3D scene.
- If React sections are reintroduced later, they should inherit this system instead of replacing it with a generic marketing layout.
- Fix copy and visual consistency in `public/3d/index.html` before expanding the feature set.
