# ceangal

**UI framework for Almide** — layout, widget, and interaction layer on top of [snaidhm](https://github.com/dubhlux/snaidhm).

> *ceangal* (Irish: /ˈcaŋɡəl/) — binding, bond, connection.
> snaidhm ties the knots; ceangal binds them into a UI.

## Stack

```
Apps (nendo, ...)
  └─ ceangal  ← layout, widget, interaction
       └─ snaidhm  ← GPU path renderer, SDF text, images
            └─ lumen  ← vec, mat, color, quat
                 └─ almide  ← language, WASM/WGSL codegen
```

## Status

Early development. Interaction layer prototyped in snaidhm demo, being extracted here.

## Planned Scope

- **Layout engine** — Flexbox subset (Row, Column, Padding, Spacer)
- **Widget system** — Button, TextField, Label, Card, List
- **DOM overlay** — text selection, copy, accessibility (ARIA)
- **Text input** — IME-compatible textarea overlay
- **Text shaping** — harfbuzzjs integration for CJK, ligatures, BiDi
- **Hit testing** — canvas click → element identification
- **Routing** — History API
- **State management** — unidirectional data flow
- **Theming** — design tokens

## License

MIT
