# Accessibility Pass Notes

Milestone 12 includes a lightweight accessibility checklist for manual QA.

## Current Standards

- Buttons use real `button` or `Link` elements.
- Inputs have visible labels through the shared `Field` component.
- Dark UI uses high-contrast neon accents.
- Host-only disabled controls remain visible and explain why guests cannot act.

## Manual Checks

1. Navigate login, room creation, lobby, team setup, gameplay, and final winner with keyboard only.
2. Confirm focus states are visible on inputs and buttons.
3. Confirm disabled host-only actions are understandable from nearby text.
4. Confirm mobile bottom nav does not overlap primary buttons.
5. Confirm countdown text is readable on mobile.
6. Confirm final winner text does not wrap awkwardly on small screens.
