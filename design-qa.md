# Design QA — mobile

## Comparison target

- Source visual truth:
  - `/Users/felipescherer/Documents/New project/mobile-audit-cosmolab/02-mobile-map.png`
  - `/Users/felipescherer/Documents/New project/mobile-audit-cosmolab/03-mobile-matter.png`
  - `/Users/felipescherer/Documents/New project/mobile-audit-cosmolab/05-mobile-cockpit.png`
  - `/Users/felipescherer/Documents/New project/mobile-audit-cosmolab/06-tablet-cockpit.png`
- Browser-rendered implementation:
  - `qa/mobile/01-map-viewport-final.jpg`
  - `qa/mobile/02-matter-top.jpg`
  - `qa/mobile/02-matter-panel.jpg`
  - `qa/mobile/03-cosmic-top.jpg`
  - `qa/mobile/04-cockpit-phone.jpg`
  - `qa/mobile/05-cockpit-tablet.jpg`
  - `qa/mobile/06-cockpit-landscape-final.jpg`
- Full-view comparison evidence: `qa/mobile/comparison-board.jpg`
- Focused cockpit comparison: `qa/mobile/comparison-cockpit.jpg`
- Viewports: 390 × 844 phone portrait, 844 × 390 phone landscape, and 820 × 1180 tablet portrait.
- State: returning Explorer profile, map, Matter Lab, Cosmic Sandbox, and cockpit before assisted flight.

## Findings

- No actionable P0, P1, or P2 findings remain.
- Typography: the existing Geist hierarchy, weights, line-height, and scientific labels are preserved. Mobile navigation labels remain visible instead of being reduced to icons only.
- Spacing and layout: 18 px page gutters, existing radii, surface cards, and vertical rhythm remain consistent. The bottom navigation, quick-flight card, and cockpit controls do not overlap content.
- Colors and tokens: existing paper, teal, orange, mint, yellow, and navy tokens are reused without introducing a parallel visual system.
- Image quality: the existing first-person cockpit art remains sharp and correctly cropped in portrait, landscape, and tablet states. No source imagery was replaced.
- Copy and content: Portuguese scientific copy is preserved. New copy only explains gestures, destinations, route assistance, and section order.
- Touch/accessibility: primary phone controls are at least 44 px; periodic-table cells are 44 × 58 px; the six main destinations have persistent text labels; the page has no horizontal overflow at 390 px.
- Responsive behavior: the periodic table keeps its scientific 18-column structure inside an explicit horizontal exploration area; the Sandbox has sticky step shortcuts; the cockpit separates navigation assistance, steering controls, and instructions.

## Primary interactions tested

- Opened every bottom-navigation destination from a 390 px viewport.
- Opened the cockpit from the new mobile flight launcher.
- Selected Matter Lab and inspected the 118-element table and touch-cell dimensions.
- Selected Cosmic Sandbox and inspected parameter, simulation, and result shortcuts.
- Opened first-person cockpit at phone portrait, phone landscape, and tablet portrait sizes.
- Verified route-assistance and steering controls do not overlap.
- Checked browser-rendered DOM, page width, element measurements, and development-server output. No client-side crash occurred; the deprecated Three.js clock warning was removed. The local-only progress API still reports its known missing D1 development table, while the UI falls back to local persistence; production API health is verified separately after deployment.

## Comparison history

1. Initial audit: P1 — phone navigation was a clipped horizontal strip with hidden labels; the flight entry was hard to discover. Fix: introduced a six-item bottom dock with labels and a mobile flight launcher with three quick destinations. Post-fix evidence: `qa/mobile/01-map-viewport-final.jpg`.
2. Initial audit: P1 — periodic-table cells were about 32 px wide and the sideways interaction had no explanation. Fix: added a persistent gesture hint and 44 × 58 px cells while preserving the 18-column table. Post-fix evidence: `qa/mobile/02-matter-panel.jpg`.
3. First implementation comparison: P1 — the bottom dock appeared at the top because the parent header's backdrop filter created a containing block. Fix: disabled that parent filter at phone width and kept blur on the dock itself. Post-fix evidence: `qa/mobile/01-map-viewport-final.jpg`.
4. First cockpit comparison: P2 — route assistance competed with steering controls in portrait. Fix: made the route card full-width above a centered control row and added a short touch instruction. Post-fix evidence: `qa/mobile/comparison-cockpit.jpg`.
5. Landscape check: P2 — the crew communicator overlapped the steering row at 844 × 390. Fix: added a compact low-height landscape arrangement with an 82 px top bar and collapsed communicator copy. Post-fix evidence: `qa/mobile/06-cockpit-landscape-final.jpg`.

Focused region comparison was required for the dense cockpit controls and is recorded in `qa/mobile/comparison-cockpit.jpg`. The paired board compares source and implementation at the same 390 × 844 viewport.

final result: passed
