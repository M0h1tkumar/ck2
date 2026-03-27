# Design System Specification: Imperial Resonance

## 1. Overview & Creative North Star
**Creative North Star: "The Sovereign’s Decree"**

This design system moves away from the bright, celebratory tones of the past and into an atmosphere of "Imperial Resonance." It is designed to evoke the weight of history, the gravity of a royal court at dusk, and the intensity of a sacred battlefield. We are not building a standard "app"; we are crafting a digital manuscript of power.

To break the "template" look, we move beyond the rigid, centered grid. We embrace **Intentional Asymmetry**—using large typographic offsets and overlapping surface layers to create a sense of depth and motion. Elements should feel like they are floating in a rich, atmospheric void of crimson and shadow.

## 2. Colors: The Blood and Gold Palette
The palette is dominated by deep, chromatic reds that provide a sense of "visual weight," punctuated by surgical strikes of gold.

### Core Tonal Roles
- **Primary & Containers:** `primary_container` (#8B0000) acts as our foundation for strength. Use `on_primary_container` (#FF907F) for text that needs to glow like dying embers.
- **The Accents:** `secondary` (#E9C349) and `tertiary` (#E9C400) represent the gold of the "Dharma." These are never used for large surfaces; they are reserved for the "Crown jewels" of the UI: icons, call-to-action highlights, and interactive states.
- **The Void (Neutrals):** Our `surface` (#1C1010) is a near-black burgundy. It provides the "sunset" backdrop against which all other elements resonate.

### Design Rules for Color
- **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. To separate content, use a background shift from `surface` to `surface_container_low` (#241918) or `surface_container_high` (#342727).
- **Surface Hierarchy & Nesting:** Treat the UI as physical layers. An article card (`surface_container_lowest`) should sit atop a section of `surface_container_low`, creating a "sunken" or "raised" effect through tonal contrast alone.
- **The "Glass & Gradient" Rule:** For floating navigation or modals, use `surface_variant` (#3F3131) at 80% opacity with a `backdrop-filter: blur(12px)`. 
- **Signature Textures:** Use a subtle linear gradient from `primary_container` (#8B0000) to `surface_container_highest` (#3F3131) for hero backgrounds to simulate the fading light of a battlefield sunset.

## 3. Typography: The Noto Serif Authority
We use **Noto Serif** exclusively. It is a typeface that carries the weight of scripture and the precision of a blade.

- **Display (The Epic Scale):** `display-lg` (3.5rem) should be used with tight letter-spacing and intentional "hanging" indents. Use this for titles that need to command the entire screen.
- **Headlines (The Proclamation):** `headline-lg` (2rem) and `headline-md` (1.75rem) should always be paired with high-contrast color shifts—use `primary` (#FFB4A8) for impact.
- **Body (The Narrative):** `body-lg` (1rem) must maintain a generous line-height to ensure the serif doesn't feel cluttered against the dark background. Use `on_surface_variant` (#E3BEB8) for secondary body text to reduce visual noise.

## 4. Elevation & Depth
In this system, depth is a matter of "Atmospheric Perspective" rather than shadows.

- **The Layering Principle:** Stack `surface-container` tiers. Place a `surface_container_highest` (#3F3131) element on a `surface` (#1C1010) background to create a natural, "physical" lift.
- **Ambient Shadows:** Standard shadows are forbidden. If a "floating" effect is required (e.g., a high-priority FAB), use a large, 40px blur shadow using a 6% opacity version of `#000000`. It should feel like an eclipse, not a drop-shadow.
- **The "Ghost Border" Fallback:** For accessibility in forms, use `outline_variant` (#5A403C) at 20% opacity. This creates a "glint" on the edge without creating a hard box.

## 5. Components: Forged in Crimson

### Buttons
- **Primary:** A solid fill of `secondary_container` (#AF8D11) with `on_secondary_container` text. The corners are sharp (`sm`: 0.125rem) to maintain a military precision.
- **Tertiary (The Ghost):** No background. Use `on_surface` text with a `secondary` (#E9C349) underline that expands on hover.

### Inputs
- **Text Fields:** Use a "Bottom-Line Only" approach with `outline` (#AA8984). On focus, the line transitions to `secondary` (Gold). The background should be a subtle `surface_container_lowest`.

### Cards & Lists
- **The Separation Rule:** Strictly forbid divider lines. Use `spacing-8` (2.75rem) to separate list items or shift the background color of alternating items to `surface_container_low`.

### Featured Component: The "Relic" Card
- A specialized container for high-value content. Uses a thin "Ghost Border" of 10% Gold, a backdrop-blur of 15px, and a subtle radial gradient of `primary_container` in the bottom-right corner to simulate a reflected glow.

## 6. Do's and Don'ts

### Do:
- **Use "Aggressive" White Space:** Use the `spacing-16` and `spacing-24` scales to let the typography breathe. 
- **Embrace Asymmetry:** Offset images and headlines so they don't align to a perfect center-stack.
- **Use Gold Sparingly:** Gold is a reward for the eye. If everything is gold, nothing is royal.

### Don't:
- **Don't use 100% White:** Never use #FFFFFF. Use `on_surface` (#F4DDDD) for the brightest text; it carries a hint of red that keeps the palette "warm."
- **Don't use Rounded Corners:** Avoid `xl` or `full` roundedness. Stick to `none`, `sm`, or `md` to keep the UI feeling sharp and authoritative.
- **Don't use Standard Icons:** Icons must be thin-stroke (Linear) and tinted with `secondary_fixed_dim` (#E9C349) to feel like golden etchings.