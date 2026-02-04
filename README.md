# Inactivity Timeout & Auto-Logout

**Bulletproof client-side inactivity detection with warning modal and forced logout**

A lightweight, timestamp-based JavaScript module that:

- Detects real user inactivity (mouse, keyboard, touch, scroll)
- Shows a **non-blocking warning overlay** with countdown before logout
- Forces session destruction / logout after the countdown expires
- Works reliably even when the tab is backgrounded or the computer is asleep (using `Date.now()` instead of unreliable timers)

Perfect for banking apps, admin panels, healthcare portals, or any application where **security-sensitive sessions** should not remain open indefinitely.

## Features

- Configurable inactivity timeout (default: 5 minutes)
- Configurable warning countdown (default: 30 seconds)
- Clean modal overlay with "Stay Signed In" button
- Activity events: `mousemove`, `mousedown`, `keydown`, `scroll`, `touchstart`
- No dependencies — pure vanilla JavaScript
- Handles page visibility / background tabs correctly
- Prevents multiple overlapping warnings or logouts
- Easy to integrate with your existing logout flow


## Installation

### Via `<script>` tag (recommended for most projects)

```html
<script src="path/to/inactivity.js" defer></script>
