<!-- description: Ceangal v2 foundation — GPU rendering, layout, scroll, todo app demo -->
# v2 Foundation (Phase 1)

**Completed: 2026-05-18**

## Delivered

- View type + modifier chain (padding, bg, grow, gap, absolute, w_pct, justify, align, etc.)
- Yoga-compatible Flexbox layout engine (74 Yoga-aligned tests)
- GPU compute shader rendering (SDF rounded rects, alpha compositing)
- render.almd: View → layout.Node → RenderItem[] pipeline (struct spread workaround for WASM)
- DOM overlay text (selectable, scroll wrapper with CSS transform)
- Virtual list with GPU visible filter (upload_visible: on-screen items only)
- Scroll physics: wheel + momentum + bounce + deceleration
- Scrollbar: GPU-rendered Cupertino-style, drag via unified animator
- Click handling: math-based position calculation (avoids var-in-loop WASM bug)
- Keyboard: Enter to add
- Mouse light: fragment-only glow effect (no compute re-run)
- Theme tokens: glass_card, heading, caption, button_primary, spacing scale
- Pixel-level AABB reject in compute shader
- Negative dt fix in ScrollAnimator
- GitHub Pages deployment
- org rename: dubhlux → almide-graphics

## Almide WASM bugs discovered

| Bug | Workaround | Fixed in |
|-----|-----------|----------|
| sf/rebuild 30+ params broken | struct spread | — |
| 8-byte list header (to_bytes, for-in) | — | e6664c5d |
| IndexAssign offset 4→8 | — | 4f9ac624 |
| list.push realloc cap=0 overflow | items + [x] | f9de5a85 |
| var assignment in for-loop if-block | math-based calculation | — |
| Closure tail call type error | for loops instead of list.map | — |

## Key metrics

- Layout tests: 74/74 pass
- WASM binary: ~146KB
- Rebuild time: ~0.6ms
- Scroll: 60fps with 100+ items
- GPU items per frame: ~15 (visible only, not all)
