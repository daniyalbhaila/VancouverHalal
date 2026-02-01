# Implementation Plan: Snappiness Improvements

This plan tracks the performance-focused changes needed to make Halal Maps feel closer to native iOS/Android. Each item includes the rationale and a checkbox so we can mark progress.

## Goals
- Reduce main-thread work during scrolling, filtering, and swiping.
- Smooth page transitions between tabs.
- Show content immediately while location and data finalize.
- Improve repeat-load speed with lightweight offline caching.

## Plan Checklist

- [x] Add a Web Worker for distance, filtering, sorting, and closest-N lookup
  - Why: move heavy list and bounds computations off the main thread.
  - Outcome: fewer long tasks; smoother scrolling and gestures.

- [x] Update list rendering to use the worker (optimistic render)
  - Why: stop blocking the list while location resolves.
  - Outcome: list renders instantly; distance-based rank updates once location arrives.

- [x] Move map bounds calculation off the main thread
  - Why: avoid distance sorting on visibility changes.
  - Outcome: map fits to nearest restaurants without blocking frames.

- [x] Add View Transitions API wrappers for navigation
  - Why: reduce flashes and layout shifts during tab navigation.
  - Outcome: smoother cross-page transitions with GPU compositing.

- [x] Improve swipe gesture composition
  - Why: keep cards on the GPU and reduce paint work.
  - Outcome: more "stuck-to-finger" feel during drag.

- [x] Stream data under a persistent shell
  - Why: allow shell UI to paint before server data finishes.
  - Outcome: faster perceived startup on slow networks.

- [x] Add a basic service worker for caching
  - Why: speed repeat visits and improve offline behavior.
  - Outcome: faster reloads and better resilience on weak connections.

## Notes
- We are intentionally skipping SWR for now to keep dependency and refactor scope minimal.
- Worker implementation will be plain JavaScript in `public/` for reliability and simplicity.
