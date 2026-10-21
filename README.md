# DeltaBox website

Single-page site for [delta-box.github.io](https://delta-box.github.io/).

```sh
npm install
npm run dev
npm run build
```

The site uses footage and stills from the DeltaBox Lite promotional film in the parent project. The deployment workflow publishes `dist/` to GitHub Pages on pushes to `main`.

The page supports Chinese (`?lang=zh`) and English (`?lang=en`). The language switch keeps the current section anchor and remembers the selection in local storage. The film, poster, and hero still follow the selected language: Chinese uses `deltabox-lite-v5-clean.mp4`, and English uses `deltabox-lite-v6-en-clean.mp4`. Media assets are copied from `promo/output/` into `public/media/`.

Both videos are rendered without burned-in subtitles. The player loads the matching WebVTT track (`captions.zh-CN.vtt` or `captions.en.vtt`), enabled by default; viewers can turn subtitles off in the native controls. Earlier burned-in videos remain in `public/media/`.

The hero renders a beveled metal Δ with Three.js. WRITE, DIFF, and DECIDE sit on its three edges. Scrolling rolls the logo toward the viewer while the labels and then the object fade out; scrolling back restores it. Rendering runs only on scroll or resize. Reduced-motion mode keeps the logo still and fades it, and WebGL-unavailable browsers retain the text hero. The Windows tag tilts clockwise at rest and responds in the opposite direction to horizontal pointer movement.
