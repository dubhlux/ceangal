<!-- description: GPU tile-based item dispatch — eliminate per-pixel all-items loop -->
# Tile-based Item Dispatch

> **Scope**: snaidhm compute shader + ceangal upload pipeline
> **Priority**: High — current per-pixel loop limits to ~50 items at 60fps

## Problem

Current compute shader (`raster.wgsl` `fine` function):
```wgsl
for (var ri = 0u; ri < min(ri_count, 256u); ri++) {
    // loads 3 vec4 per item, checks bounds, runs SDF
}
```

Every pixel iterates ALL items. With N items and W×H pixels:
- Cost: O(N × W × H) per frame
- At 2x DPR, 500×950 viewport = 1.9M pixels
- 50 items × 1.9M = 95M iterations → starts dropping frames
- 200 items = 380M iterations → unusable

## Solution

Tile-based dispatch (same approach snaidhm already uses for path segments):

1. **CPU/WASM side**: For each item, compute which 16×16 tiles it overlaps
2. **Upload**: Per-tile item lists (tile_item_counts + tile_item_ids)
3. **Shader**: Each workgroup reads only its tile's item list

```
Current:  pixel → loop ALL items → SDF test
Proposed: pixel → lookup tile → loop TILE's items → SDF test
```

With 16×16 tiles, a typical item (56px tall, full width) spans ~4 tiles vertically.
Each tile has ~5-10 items. Per-pixel cost drops from O(N) to O(~10) regardless of total N.

## Implementation Plan

### Phase 1: Item → Tile assignment (ceangal side)
- In `upload_visible`, compute tile overlap for each item
- Build `tile_item_counts[tile_id]` and `tile_item_ids[tile_id * MAX_ITEMS_PER_TILE + i]`
- Upload as storage buffers alongside items_buf

### Phase 2: Shader modification (snaidhm side)
- Add tile lookup buffers to compute bind group
- Replace all-items loop with tile-local loop
- Workgroup = tile, so `wg.xy` directly maps to tile ID

### Phase 3: Dynamic tile sizing
- Large items (full-width) → register in multiple tiles
- Small items (icons) → register in 1 tile
- Overlapping items handled naturally (item appears in multiple tile lists)

## Constraints

- MAX_ITEMS_PER_TILE: 32 should suffice (most tiles have <10 items)
- Tile size: 16×16 matches existing workgroup size
- Buffer size: viewport_tiles × 32 × 4 bytes = ~120KB for 1080p
- Must handle scroll offset (items shift tiles as scroll_y changes)

## Exit Criteria

- 500 items at 60fps on integrated GPU
- No visual regression from current rendering
- Scrollbar drag remains smooth
