# A Gift for Precious 💗

A romantic, tap-to-open gift card for **Precious** — good-luck wishes for her
final exams, written by **Jaden**.

The page opens as a wax-sealed envelope. She taps the seal, the flap lifts, the
letter slides out and the full card unfolds line by line in gold and rose.

## What it does

- **Sealed envelope** with a wax seal monogrammed `P` — she has to tap it to open
- **Real opening animation**: the flap folds back, the letter rises, hearts and
  confetti burst out, then the card fades in
- **The message reveals line by line**, like it is being written for her
- **Read it again**, **Send love ❤** (another burst) and **Seal it back**
- Works beautifully on a phone — full-screen, no zooming, no external requests
- Respects `prefers-reduced-motion` for anyone who prefers a calmer version
- Fonts are self-hosted and subset, so it loads instantly on mobile data

## Changing the words

Everything she reads lives in one file: **`src/react-app/message.ts`**

```ts
export const card: GiftCard = {
	recipient: "Precious",
	sealLetter: "P",
	sender: "Jaden",
	headline: "Congratulations, Precious",
	paragraphs: [
		"The long nights, the early mornings…",
		// add or edit paragraphs here — the card animates any number of them
	],
	signature: "Forever yours, Jaden",
};
```

Edit a line, save, and the card updates instantly in the browser. Nothing else
needs to change — the layout adapts to however many paragraphs you write.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
```

## Putting it online

```bash
npm run build
npm run deploy   # deploys to Cloudflare Workers
```

Once deployed, share the link with her — she can open it on her phone, and it
stays online as a little keepsake.

## Structure

```
index.html                    page shell, title and colours
public/fonts/                 self-hosted subsets (Great Vibes, Cormorant Garamond)
src/react-app/
  message.ts                  ✍️  every word of the card
  App.tsx                     envelope scene, opening animation, card
  art.tsx                     SVG hearts, petals, sparkles, cap, confetti
  App.css                     the theme, envelope and card styling
  index.css                   background, colour palette, @font-face
```
