# Play conditions - Brief

**Lane:** Feature
**Status:** Complete locally
**Updated:** 2026-10-04

## Outcome

Make play prerequisites structured DBN language, separate from the illustrated
lineup: live players, held balls, player advantage, opponent state, burden,
remaining throw-clock time, blocking phase, ruleset and adaptation source.

## Scope

- Now: canonical parser, condition checker, headless/CLI access, spec and tests.
- Later: playbook filtering, automatic rule officiating, tournament profiles.
- Excluded: changing existing plays, website synchronization, commits and deploys.

## Acceptance criteria

- Old example JSON remains unchanged and all existing tests pass.
- Optional tags produce typed JSON; malformed or repeated conditions fail.
- Counts support exact, minimum and inclusive range values.
- A supplied game state returns match, mismatch, or unknown with field reasons.
- Ruleset labels do not change court geometry or certify tournament legality.
- CLI descriptions expose conditions; documentation includes a working example.

## Constraints

No runtime dependencies. The current canonical-source header in vendor/dbn.js
supersedes the older vendoring directions in README/CONTRIBUTING. Work in the
clean notation checkout; preserve existing examples and the other site repo.
