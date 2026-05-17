# Ceangal Grand Plan

> 「GPU compute-first の UI framework を、Almide で LLM が最も正確に書ける形で作る」

---

## Phase 1: Foundation ← **DONE**

宣言的 View + GPU rendering + scroll が 60fps で動く。

- [x] View type + modifier chain (`v.col`, `v.text`, `|> v.padding`)
- [x] Yoga-compatible Flexbox layout engine (74 tests)
- [x] GPU compute shader rendering (SDF rounded rects)
- [x] DOM overlay text (selectable, scroll wrapper, IME textarea)
- [x] Virtual list with GPU visible filter (100+ items 60fps)
- [x] Scroll physics (momentum, bounce, deceleration)
- [x] Scrollbar (GPU-rendered, drag via animator)
- [x] Click / keyboard event handling
- [x] Mouse light effect (fragment-only re-render)
- [x] Theme tokens (glass, typography, spacing, colors, radius)
- [x] Todo app demo (GitHub Pages deployed)

**Exit criteria**: Todo app が add/toggle/scroll/resize 全動作。達成。

## Phase 2: Interaction Primitives

入力とジェスチャーを一般化する。「Todo app 以上のものが作れる」状態にする。

- [ ] **[TextField](active/text-field.md)** — IME textarea overlay → state → rebuild pipe
- [ ] **Gesture system** — `v.on_tap`, `v.on_long_press`, `v.on_swipe`, `v.on_pan`
- [ ] **Focus management** — tab order, focus ring, keyboard navigation
- [ ] **Animation primitives** — `Animated[T]` + interpolation + easing (scroll physics を一般化)
- [ ] **Transition** — View diff → animated property change

**Exit criteria**: TextField + gesture + animation が Todo app に統合され、swipe-to-delete が動く。

## Phase 3: Widget Library

Flutter/SwiftUI 級の widget set。LLM が名前だけで正しく使えることを重視。

- [ ] **Core**: Button, TextField, Switch, Checkbox, Slider, ProgressBar
- [ ] **Layout**: Stack, Grid, Spacer, Divider, ScrollView (horizontal)
- [ ] **Navigation**: TabBar, NavigationStack, Sheet, Dialog, Drawer
- [ ] **Data**: Image, Avatar, Badge, Chip, Tag
- [ ] **Feedback**: Toast, Snackbar, Tooltip
- [ ] **Composite**: SearchBar, BottomSheet, ActionSheet, DatePicker

**Exit criteria**: 20+ widget で 3 つのデモアプリ (Todo, Chat, Settings) が作れる。

## Phase 4: GPU Rendering Evolution

per-pixel item loop を排除し、1000+ widget の UI を 60fps で描画する。

- [ ] **[Tile-based item dispatch](active/tile-based-dispatch.md)** — snaidhm 側: item → tile assignment, per-tile item list
- [ ] **SDF text rendering** — font parser → glyph outlines → GPU path (DOM overlay 依存削減)
- [ ] **Glass morphism blur** — fragment shader box blur (mip chain)
- [ ] **Gradient fill** — linear / radial / mesh gradient per item
- [ ] **Shadow** — per-item drop shadow (SDF offset + blur)
- [ ] **Image rendering** — texture atlas, async load, aspect-fit/fill

**Exit criteria**: 1000 widget の画面が 60fps。SDF text で DOM overlay が補助的になる。

## Phase 5: App Framework

routing, state, persistence でアプリケーションフレームワークになる。

- [ ] **Routing** — URL-based, NavigationStack, deep link
- [ ] **State management** — Cell → Store (Redux-like) or Observable (SwiftUI-like)
- [ ] **Persistence** — local storage, IndexedDB integration
- [ ] **Network** — fetch, WebSocket, SSE
- [ ] **Accessibility** — ARIA roles on DOM overlay, screen reader support
- [ ] **i18n** — string catalog, RTL layout

**Exit criteria**: 実用的な SPA が ceangal だけで作れる。

## Phase 6: Platform Expansion

Web を超える。

- [ ] **Native rendering** — wgpu backend (macOS / Windows / Linux)
- [ ] **Mobile** — iOS (Metal) / Android (Vulkan) via wgpu
- [ ] **Hot reload** — file watch → incremental rebuild → UI update
- [ ] **DevTools** — widget inspector, layout debugger, performance profiler
- [ ] **Package ecosystem** — ceangal widget packages on almide registry

---

## やらないことリスト (今は)

| 項目 | 理由 |
|---|---|
| CSS 互換 | GPU-native で CSS の制約を継承する必要なし |
| DOM rendering mode | GPU compute-first が差別化。DOM fallback は作らない |
| Server-side rendering | クライアント UI に集中。SSR は Phase 5 以降 |
| 独自フォントエンジン | harfbuzzjs で十分。SDF text は Phase 4 |
| React 互換 API | SwiftUI/Flutter の宣言的スタイルに寄せる |

---

## 3 つの最重要命令

1. **Phase 2 を速く回せ** — TextField + gesture で「フレームワーク」の最低ラインを超える
2. **GPU を tile-based にしろ** — per-pixel loop は 50 items で限界。1000 items を目指す
3. **LLM writability を維持しろ** — API は name-only で正しく使える設計。modifier chain を崩すな
