# Temporary Tickerverse hosting

`public/tickerverse/` is a generated release from the independent private repository `storypixel/tickerverse`. Do not edit its bundled files by hand or reimplement the experience in this portfolio. Source revision is recorded in `public/tickerverse/release.json`.

The existing Pages workflow copies this directory unchanged and publishes `https://iamnotsam.com/tickerverse/`. `TickerverseEntry.jsx` sends client-side portfolio navigation into that separate document, preserving query/hash. Portfolio home and other routes are unchanged.

To update after approval: build/test the independent project with `npm run test:hosted`, replace only this generated directory from its `dist/`, exclude authoring/reference notes such as `FAVICON-SOURCE.md`, retain asset licenses, update release.json, and deploy through the normal master workflow. Preserve unrelated work. The release requires no private-repo credentials in this public repository or its workflow.

For a future dedicated domain, deploy the independent project's normal root-base `npm run build` to the chosen host and configure that domain there. Tickerverse does not import or depend on the portfolio.

Rollback: revert the scoped Tickerverse hosting commit; leave other public projects and the independent source repository intact.
