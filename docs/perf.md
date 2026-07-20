# Performance notes

## Targets
- Initial page load -> first wallpaper visible: < 1.5s
- Slider drag -> preview update: < 16ms per frame
- 4K PNG export: < 500ms
- Batch of 5 sizes: < 4s

## How to measure

### Initial load
1. `npm run build && npm run start`
2. Open DevTools -> Network -> Disable cache -> Reload
3. Note the `Load` event time. Should be < 1500ms on a mid-range laptop.

### Slider smoothness
1. Open DevTools -> Performance
2. Start recording, drag the Layers slider for 5 seconds
3. Stop recording
4. Check the FPS chart. No frame should exceed 20ms.

### Export
1. Set resolution to 4K
2. Open the Performance tab
3. Click Download
4. The time between click and download should be < 500ms

### Batch
1. Select 5 different sizes
2. Click Generate all
3. Time the full operation
4. Should be < 4s

## Optimizations in place
- Slider drags rAF-throttled
- Preview canvas size = device frame inner box * DPR (capped at 2x)
- ogl Program is reused across fluid-gradient renders
- Image-extract palette uses 64x64 downscale + k-means (5 iterations)
- No web worker, no WASM, no service worker
