# Callbook — agent instructions

You are reading this because a human said something like: **"Using this URL,
make me a dodgeball play where …"**. Follow these steps and give them back an
animated, shareable play. Everything you need is fetchable from here.

## What this is

DBN (Dodgeball Notation) is a chess-style plain-text notation for dodgeball
plays. Written DBN compiles to an animated overhead court diagram. Your job:
turn the human's description into valid DBN and hand back links.

## Steps

1. **Fetch the spec** (the single source of truth — do not work from memory):
   https://iamnotsam.com/dodgeball-play-notation/NOTATION.md

2. **Fetch one or two examples** to anchor the style:
   - https://iamnotsam.com/dodgeball-play-notation/examples/home.dbn (defensive counter)
   - https://iamnotsam.com/dodgeball-play-notation/examples/insides.dbn (set offense)
   - https://iamnotsam.com/dodgeball-play-notation/examples/pitch-back.dbn (opening rush)

3. **Write the play in DBN.** Ground rules:
   - Start with `[Play "Name"]`; add `[Balls "U:45 T:246"]` when anyone starts loaded.
   - Numbered beats; every beat gets a short `{label}` written the way a coach talks.
   - Prefer named formations (`huddle`, `line`, `mid`, `deep`, `back`) over coordinates.
   - Only the players the human mentions act; everyone else stays put.
   - If the description is ambiguous, pick the most conventional reading — don't interrogate the human.

4. **Validate it** (free, no key, machine check by the real parser):

   ```
   POST https://callbook.klerb.io/validate
   Content-Type: application/json

   {"dbn": "[Play \"...\"]\n..."}
   ```

   Success returns `{"valid": true, "name", "beats", "view"}` where `view` is a
   ready-made animated link. Failure returns `{"valid": false, "error"}` — fix
   and re-validate. Send a real `User-Agent` header (bare library defaults like
   `Python-urllib` get bounced at the edge). If you cannot reach the endpoint,
   self-check against the spec's grammar section instead.

5. **Reply to the human with all three of these:**
   - **The animated play link** — the `view` URL from validation, or build it
     yourself: `https://iamnotsam.com/dodgeball-play-notation/?dbn=` + the
     URL-encoded DBN text. This link opens the play, animated, no install.
   - **The raw DBN** in a code block, so they can edit it.
   - **The embed snippet**, if they want it on their own page:

     ```html
     <div data-db-play-dbn='
     [Play "..."]
     ...your DBN, with any single quotes escaped as &#39;...
     '></div>
     <script src="https://iamnotsam.com/dodgeball-play-notation/vendor/play-animator.js"></script>
     <script src="https://iamnotsam.com/dodgeball-play-notation/vendor/dbn.js"></script>
     ```

## More surfaces

- Glossary of dodgeball terms: https://iamnotsam.com/dodgeball-play-notation/GLOSSARY.md
- Deeper automation (window API, headless CLI): https://iamnotsam.com/dodgeball-play-notation/DRIVING.md
- Machine index: https://iamnotsam.com/callbook/llms.txt
- Human overview: https://iamnotsam.com/callbook/

House rule of the notation ("no magic"): every engine capability is writable
in DBN and specified exactly in NOTATION.md. If you want a layout the named
words don't give you, the `(x,y)` escape always works.
