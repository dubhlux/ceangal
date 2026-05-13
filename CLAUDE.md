# ceangal

**UI framework for Almide.** Layout, widget, and interaction layer on top of snaidhm (renderer).

## Architecture

ceangal is the "Flutter" to snaidhm's "Skia/Impeller":
- snaidhm: renders pixels (paths, text, images, shadows, gradients)
- ceangal: manages what to render and how users interact with it

```
ceangal scope:
  Layout ──── Row, Column, Padding, Spacer, constraint solving
  Widget ──── Button, TextField, Label, Card, List
  Interaction ── DOM overlay, text selection, copy, accessibility
  Input ──── IME textarea, keyboard, pointer events, hit testing
  App ──── routing, state management, theming
```

## Tech Stack

- Language: Almide (.almd) compiled to WASM
- Renderer dependency: snaidhm (GPU path renderer)
- Web interaction: DOM overlay pattern (Figma/Flutter Web style)
- Text shaping: harfbuzzjs (WASM)
- Math: lumen

## Key Design Decisions

- DOM overlay for text interactivity (selection, copy, IME) — canvas alone can't do this
- Layout engine runs in Almide/WASM, outputs NDC coordinates consumed by both snaidhm (GPU) and DOM overlay
- Accessibility via semantic HTML in DOM overlay (h1-h6, aria-label, roles)
- textarea as IME input surface, positioned over active text field

## Naming

ceangal (Irish: binding, bond) — binds snaidhm's knots into a UI.
