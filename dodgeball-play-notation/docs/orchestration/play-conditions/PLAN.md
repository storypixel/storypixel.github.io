# Play conditions - Plan

1. Complete: specify and test condition parsing and explicit-state matching.
2. Complete: implement parser, checker, headless export and CLI descriptions.
3. Complete: document syntax, run regressions, review scoped diff and checkpoint.

Verification: focused Node tests first, then npm test for existing example parity,
CLI, formations, widget isolation, converter and presentation regressions.
No new UI is required. No browser, server, release or external service changes.
