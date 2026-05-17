<!-- description: TextField widget — IME-compatible text input via DOM textarea overlay -->
# TextField

> **Scope**: ceangal widget + runtime
> **Priority**: High — minimum viable interaction beyond read-only

## Current State

- IME textarea (`<textarea id="ime-input">`) exists in index.html
- Positioned absolutely, transparent, z-index 2
- Not connected to any View or state

## Design

```almide
v.text_field(cell, "placeholder")
  |> v.on_submit((text) => add_todo(text))
```

- `cell: Cell[String]` — reactive binding to input text
- GPU renders: background rect + cursor (blinking via animation)
- DOM: hidden textarea positioned over the field for IME input capture
- On input: textarea value → cell → rebuild → GPU re-render

## Implementation Plan

### Phase 1: Basic input
- Add `TEXT_FIELD` view kind
- Render as rect (bg) + text (current value) + cursor line
- Position textarea over the field on focus
- textarea `input` event → cell update → rebuild

### Phase 2: Selection + editing
- Click to position cursor
- Shift+click / drag to select range
- Copy/paste via textarea
- Keyboard: arrow keys, home/end, delete/backspace

### Phase 3: Polish
- Cursor blink animation
- Selection highlight (GPU rect with alpha)
- Focus ring (border color change)
- Placeholder text (gray when empty)

## Exit Criteria

- Type text, see it rendered in GPU
- IME (Japanese/Chinese) input works
- Submit on Enter triggers callback
- Todo app uses TextField for adding items (replaces keyboard shortcut)
