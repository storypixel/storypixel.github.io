const assert = require("assert");
const fs = require("fs");
const path = require("path");

const engine = fs.readFileSync(path.join(__dirname, "..", "vendor", "play-animator.js"), "utf8");
const source = engine.match(/const pumpShake = \(u, reps\) => \{([\s\S]*?)\n  \};/);

assert.ok(source, "engine defines a testable pumpShake motion function");
const pumpShake = new Function("u", "reps", source[1]);

assert.equal(pumpShake(0, 2), 0, "pump shake begins at the hand");
assert.ok(Math.abs(pumpShake(1, 2)) < 1e-12, "pump shake ends at the hand");
assert.ok(Math.abs(pumpShake(0.001, 2)) < 0.0001, "pump shake eases away from rest without a velocity jump");
assert.ok(Math.abs(pumpShake(0.25, 1) - 1) < 1e-12, "single fake reaches full travel in the first direction");
assert.ok(Math.abs(pumpShake(0.75, 1) + 1) < 1e-12, "single fake reaches equal travel in the opposite direction");
assert.ok(Math.abs(pumpShake(0.125, 2) - 1) < 1e-12, "first outward peak reaches full travel");
assert.ok(Math.abs(pumpShake(0.375, 2) + 1) < 1e-12, "first return peak reaches equal opposite travel");
assert.ok(Math.abs(pumpShake(0.625, 2) - 1) < 1e-12, "second outward peak reaches full travel");
assert.ok(Math.abs(pumpShake(0.875, 2) + 1) < 1e-12, "second return peak reaches equal opposite travel");

let positive = 0;
let negative = 0;
for (let i = 0; i <= 100; i += 1) {
  const u = i / 100;
  const value = pumpShake(u, 2);
  positive = Math.max(positive, value);
  negative = Math.min(negative, value);
  assert.ok(Math.abs(value + pumpShake(1 - u, 2)) < 1e-12, "motion is symmetric around the hand");
}

assert.ok(positive > 0.8, "shake reaches the positive side of the hand");
assert.ok(negative < -0.8, "shake reaches the negative side of the hand");
assert.ok(Math.abs(positive + negative) < 1e-12, "shake has no directional bias");

console.log("  ✓ pump-fake motion is symmetric and eases at both beat boundaries");
