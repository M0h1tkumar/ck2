# QA Checklist

Use this checklist before shipping changes to the immersive experience.

## Core Flow

- Open `/` and confirm the loader, intro animation, and enter button all appear in sequence.
- Enter the 3D scene and confirm all four district buttons are visible and clickable.
- Open each district from the 3D hub and confirm the correct panel loads.
- Use the back button from both the district view and the center hub and confirm camera navigation returns to the expected state.
- Use each panel close button and confirm the scene resets to overview cleanly.

## Earth District

- Open at least three clubs and confirm the popup opens and background blur/focus states behave correctly.
- Open an event detail modal and confirm the title, date, location, prize, contact, and register link populate.
- Click outside the event modal and confirm it closes.
- Close the event modal and then the club popup and confirm focus state clears fully.

## Mobile And Responsiveness

- Test `/` at one desktop width and one mobile width.
- In mobile layout, open all district pages and confirm content is readable without clipped controls.
- Confirm the earth club popup and event modal remain usable on narrow screens.

## Sanity Checks

- Run `npm run lint`.
- Run `npm run build`.
- If you changed files under `public/`, manually test the affected flow in a browser because lint/build do not validate most inline/static runtime behavior.
