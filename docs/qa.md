# Manual QA checklist

## Per generator
For each of `waveform`, `geometric`, `typography`, `fluid-gradient`:
- [ ] Renders without errors at default settings
- [ ] Each slider in ParamsForm changes the output
- [ ] Slider drag is smooth (no jank)
- [ ] Switching to a generator preserves the recipe seed
- [ ] SVG export works for `geometric` and `typography` only
- [ ] Renders at desktop-1080p, iphone-15-pro, and custom 4000x6000

## Per palette
For each curated palette:
- [ ] Selecting a palette in dark mode uses the palette's first color as background
- [ ] Selecting a palette in light mode uses the palette's first color as background
- [ ] Custom hex color picker updates the preview
- [ ] Image-extract palette produces 5 valid hex colors

## Mode
- [ ] Light/Dark/Auto toggle changes the preview immediately
- [ ] Auto mode picks light for 9am local time, dark for 9pm local time

## Seed
- [ ] Randomize button changes the seed
- [ ] R key changes the seed
- [ ] Space key changes the seed
- [ ] Typing an invalid seed (e.g. `!!!`) keeps the previous seed
- [ ] Copying the share link produces a URL that hydrates to the same state

## Overlays
- [ ] Clock shows current local time, centered
- [ ] Date shows current local date, centered
- [ ] Custom text shows the typed text
- [ ] Font picker changes the overlay font
- [ ] Size slider scales the overlay

## Devices
- [ ] Each of 9 presets shows the right dimensions
- [ ] Custom W/H validates min 320
- [ ] Aspect lock keeps ratio when changing one dimension
- [ ] iPhone/Android safe-zone dashed lines appear in preview

## Mobile (<768px)
- [ ] Layout shows the bottom sheet
- [ ] Bottom sheet snaps to collapsed/half/full
- [ ] Desktop frame presets are hidden in the picker
- [ ] Image-extract palette is hidden (not in the mobile bottom sheet)

## Cross-browser
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest
