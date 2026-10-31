# Website 03 — Bromine Arcade

A self-contained, responsive retro arcade gift for Day 03 of the 19-day birthday countdown. It uses plain HTML, CSS and JavaScript. The two games, navigation, secrets, countdown and birthday mode work without external libraries or an internet connection. Google Fonts are an optional visual enhancement; the site falls back to system fonts offline.

## A. Files included

| File / folder | What it does |
|---|---|
| `index.html` | All three screens, modals, game areas, countdown, letter and audio elements |
| `style.css` | Responsive pixel-arcade design, cabinet illustration, animations and mobile layouts |
| `script.js` | Game mechanics, navigation, audio controls, countdown and editable messages |
| `README.md` | This guide |
| `assets/images/` | Your optional image files |
| `assets/audio/` | Your optional MP3 music and sound effects |

The ZIP also includes empty asset folders. `.gitkeep` files keep those folders present until you add your own assets.

## B. Images to add

All image paths are relative to the folder containing `index.html`. Use these exact names and lowercase extensions.

| File | What to put there |
|---|---|
| `shinchan.png` | Your Shin-chan sticker image |
| `shinchan_fallback.png` | Optional fallback image |
| `arcade_background.png` | Optional arcade background |
| `arcade_icon.png` | Optional arcade icon |

Details:

| Exact filename | Exact folder | Suggested format / dimensions | Required? |
|---|---|---|---|
| `shinchan.png` | `assets/images/shinchan.png` | PNG with transparent background; square, around 500 × 500 px | Optional |
| `shinchan_fallback.png` | `assets/images/shinchan_fallback.png` | PNG; square, around 500 × 500 px | Optional |
| `arcade_background.png` | `assets/images/arcade_background.png` | PNG or JPG; around 1920 × 1080 px | Optional |
| `arcade_icon.png` | `assets/images/arcade_icon.png` | PNG; square, 256 × 256 px | Optional |

The page currently uses `shinchan.png` for the sticker cameo. If it is missing or fails to load, a built-in CSS/text sticker appears automatically. The other three image names are reserved optional assets; the site does not depend on them. No official character art is bundled.

To add an image, copy it into `assets/images/` and rename it to the exact filename above. Do not put it beside `index.html`.

## C. Audio files to add

| File | Purpose |
|---|---|
| `arcade-music.mp3` | Optional looping background music |
| `pop-sound.mp3` | Optional sound when Shin-chan is tapped |
| `spin-sound.mp3` | Optional slot reel sound |
| `win-sound.mp3` | Optional reward / jackpot sound |

Put each file in `assets/audio/` with the exact lowercase name:

- `assets/audio/arcade-music.mp3`
- `assets/audio/pop-sound.mp3`
- `assets/audio/spin-sound.mp3`
- `assets/audio/win-sound.mp3`

Use MP3 files. The music toggle starts playback only after a click. Volume is set to 23%, and the track loops. If an audio file is absent or the browser cannot play it, the games and navigation continue working silently. Browsers may require another click if playback is blocked.

## D. Edit the personal messages

Open `script.js`. At the very top, find:

```js
// ====================================
// EDIT YOUR PERSONAL MESSAGES HERE
// ====================================
const PERSONAL = {
```

Change the text between the backticks or quotation marks. This one section contains:

- `intro` — welcome message on the entry page
- `letterGreeting` — greeting on the daily letter
- `letterBody` — main letter
- `letterSignoff` — sign-off
- `everydaySecret` — ordinary secret-button reveal
- `popRewardTitle` and `popRewardMessage` — Shin-chan Pop reward
- `slotRewardTitle` and `slotRewardMessage` — Lucky Slot reward
- `birthdayTitle` and `birthdayMessage` — birthday overlay
- `birthdaySecret` — birthday-only secret

Keep the commas between properties. If a message needs multiple lines, use backticks (`` `like this` ``). Avoid deleting the surrounding quotation marks/backticks.

### Preview birthday mode (test-only)

In the same `PERSONAL` section, the `birthdayTestNow` setting is normally `null`. To preview birthday mode, temporarily change it to:

```js
birthdayTestNow: "2026-11-20T12:00:00+05:30"
```

Reload the page. This simulates midday on November 20 in IST, so the birthday overlay appears. When finished testing, restore it to `null`. The real date calculation always uses the India Standard Time calendar, not the visitor's timezone. Do not leave the test value enabled when publishing.

## E. Run the website

1. Download and extract `Website_03_Bromine_Arcade.zip`.
2. Open the extracted `Website_03_Bromine_Arcade` folder.
3. Add your optional images to `assets/images/` and audio to `assets/audio/`.
4. Double-click `index.html` to open it in a browser. The games and countdown work as a local website.
5. For a smoother development workflow, open the folder in VS Code, install/use the **Live Server** extension, right-click `index.html`, then choose **Open with Live Server**.
6. Test the layout at a phone-sized viewport and on a laptop/desktop. You can use browser developer tools to emulate a mobile screen.

No build step, package manager, server backend or game-related internet connection is required.

## F. Troubleshooting

### Images don't appear
- Check the exact spelling and capitalization: `shinchan.png`.
- Confirm it is inside `Website_03_Bromine_Arcade/assets/images/`, not the project root.
- Make sure it is a real PNG file, not a JPG renamed to `.png`.
- Refresh the page. If `shinchan.png` is missing, the built-in fallback sticker should appear.

### Music doesn't play
- Add `arcade-music.mp3` under `assets/audio/`.
- Click **MUSIC OFF** to turn music on. Browsers do not allow reliable autoplay before a user gesture.
- Check the browser tab/site volume and your device volume.
- Confirm the file is a playable MP3. Missing audio is optional and should not prevent gameplay.

### A game doesn't start
- Make sure JavaScript is enabled.
- Open the browser developer console (F12 → Console) and check for errors.
- Reload `index.html`. If you edited `script.js`, check that commas and quotation marks in the `PERSONAL` object remain valid.
- For local development, try VS Code Live Server.

### The countdown looks wrong
- The target is November 20 at 12:00 AM India Standard Time (UTC+05:30).
- Check that `birthdayTestNow` is set to `null` after testing.
- The countdown targets the next November 20 if this year's date has already passed in IST.
- It hides during the entire November 20 IST day and the birthday overlay is shown instead.

### A file is not being found
- Keep the original folder structure intact.
- Check the exact relative path and lowercase filename.
- Do not move `index.html` away from `style.css`, `script.js` or the `assets` folder.
- Use Live Server if your browser has restrictions opening local files.

## Game rules at a glance

- **Shin-chan Pop:** 3 × 3 holes, one active target at a time, only tapping the active target adds a point, 30-second round, restart available.
- **Bromine's Lucky Slot:** three animated reels and exactly five spins per round. Three matching symbols are a jackpot; a pair gets a smaller message. The spin button locks while a spin is resolving and after the fifth spin.
- Completing either game opens its own reward popup. Close it to return to the arcade and play the other game.

Have fun, arcade technician.
