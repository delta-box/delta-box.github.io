# DeltaBox website

Single-page site for [delta-box.github.io](https://delta-box.github.io/).

```sh
npm install
npm run dev
npm run build
```

The site uses footage and stills from the DeltaBox Lite promotional film in the parent project. The deployment workflow publishes `dist/` to GitHub Pages on pushes to `main`.

The page supports Chinese (`?lang=zh`) and English (`?lang=en`). The language switch keeps the current section anchor and remembers the selection in local storage. The film has Chinese audio in both versions.
