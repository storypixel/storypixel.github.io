const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const url = process.env.CALLBOOK_URL || "http://127.0.0.1:8775/callbook/";
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [], badResponses = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => { if (r.status() >= 400) badResponses.push(r.url()); });
    await page.goto(url);
    await page.locator("#demo-court .dbp__stage").waitFor();
    assert.equal(await page.locator("#demo-error").innerText(), "");
    assert.equal(await page.locator("#demo-sequence li").count(), 4);
    const court = page.locator("#demo-court .dbp__stage");
    assert.ok(await court.locator("circle").count() >= 16);
    const before = await court.screenshot();
    await page.locator("#demo-court button").last().click();
    await page.waitForTimeout(500);
    const after = await court.screenshot();
    assert.notDeepEqual(before, after, "playback changes rendered court pixels");
    await page.locator("#demo-select").selectOption("counter");
    assert.equal(await page.locator("#demo-call").innerText(), "Counter the retreat");
    assert.equal(await page.locator("#demo-sequence li").count(), 3);
    assert.match(decodeURIComponent(await page.locator("#edit-demo").getAttribute("href")), /T3-back U4-deep U4@T3%/);
    await page.locator("#demo-select").selectOption("cover");
    for (const [width, height] of [[320,740],[390,844],[768,1024],[1440,1000],[1920,900]]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => { document.activeElement.blur(); scrollTo({ top: 0, behavior: "instant" }); });
      const metrics = await page.evaluate(() => {
        const hero = document.querySelector(".hero").getBoundingClientRect(), title = document.querySelector("h1").getBoundingClientRect();
        return { scroll: document.documentElement.scrollWidth, viewport: innerWidth, height: innerHeight, heroBottom: hero.bottom, titleX: title.x, titleRight: title.right };
      });
      assert.ok(metrics.scroll <= width, "no horizontal overflow at " + width);
      assert.ok(metrics.titleX >= 0 && metrics.titleRight <= width, "title fits at " + width);
      assert.ok(metrics.heroBottom < height, "next section visible at " + width);
      assert.equal(await page.locator(".hero .cta").isVisible(), true);
      await page.screenshot({ path: "/tmp/callbook-marketing-" + width + ".png", fullPage: true });
      await page.screenshot({ path: "/tmp/callbook-hero-" + width + ".png" });
    }
    const image = await page.request.get(new URL("court.png", url).href); assert.equal(image.ok(), true);
    if (process.env.CHECK_BUILDER) {
      await page.locator("#edit-demo").click();
      await page.waitForFunction(() => window.CallbookEditor?.getPlay()?.name === "Two throw, two cover");
      assert.equal(await page.locator("#share-play").isEnabled(), true);
    }
    assert.deepEqual(errors, []); assert.deepEqual(badResponses, []);
    console.log("Marketing PASS: live animation, both examples, editable link, actual artwork, 5 responsive widths, no browser errors.");
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
