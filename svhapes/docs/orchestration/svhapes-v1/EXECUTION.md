# Svhapes v0.1 — Execution Runbook

## Resume sequence

1. Read applicable command-center and project instructions.
2. Read `BRIEF.md`, `DECISIONS.md`, `PLAN.md`, and `PROGRESS.md` in this folder.
3. Inspect both the Svhapes and `storypixel.github.io` worktrees.
4. Reconcile artifacts with repository evidence; repository state wins.
5. Select the next ready task and update the single active integration step.

## Coordination limits

- **Available concurrency:** Four total slots observed.
- **Isolation model:** Shared filesystem; Svhapes and iamnotsam are separate repositories.
- **Integration owner:** Main agent.
- **Parallel-safe work:** Read-only research, catalog critique, and final review.
- **Serialized work:** Generated contracts, public repo publication, submodule integration, and deployment.

## Agent handoff contract

Delegated tasks receive their task file, read-only ownership unless stated otherwise, validation expectations, explicit non-goals, and a prohibition on commits, pushes, deployments, or external mutation.

## Wave protocol

1. Confirm dependencies and approved gates.
2. Run bounded read-only research or review in parallel.
3. Integrate findings before changing shared contracts.
4. Execute engine, catalog, and demo work serially from their shared source definitions.
5. Validate locally, then perform the approved release sequence.
6. Update `PROGRESS.md` after each integration boundary.

## Failure protocol

1. Reduce failures to generator, catalog, demo, site build, or deployment layers.
2. Fix locally and rerun the narrowest relevant validation.
3. Revisit contracts rather than patching generated artifacts by hand.
4. Ask the user only if a new account, target, scope expansion, or irreversible action is required.

## Release gate

The current request authorizes creation/push of `storypixel/svhapes` and deployment of `/svhapes/` through `storypixel.github.io`. npm publication and unrelated production changes require separate authority.

## Completion

Complete only when tests and builds pass, independent review is addressed, the public repository is accessible, and the live iamnotsam demo is verified.
