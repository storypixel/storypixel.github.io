# Utter Marketing Site — Brief

**Lane:** Feature
**Status:** Active
**Updated:** 2026-10-04

## Outcome

Utter has a polished public home on iamnotsam.com and stable URLs Sam can enter in Apple’s marketing, support, and privacy fields.

## Critical scenarios

1. A prospective Mac user understands what Utter does, sees the real interface, confirms compatibility and privacy, and downloads the current release.
2. An existing user or Apple reviewer can find setup help, contact support, and read an accurate privacy policy without signing in.

## In scope

- Marketing page at `/utter/` with real Utter screenshots and the public release download.
- Privacy policy at `/utter/privacy/`.
- Support page at `/utter/support/` with contact information and troubleshooting.
- Responsive, accessible presentation, page metadata, and an Utter-specific favicon.
- Verification against Apple’s current official URL and screenshot requirements.

## Out of scope

- Changing the Utter app or its release binary.
- App Store Connect submission, pricing, or review metadata entry.
- Changing unrelated iamnotsam.com pages or the in-progress Calcuweight work.

## Acceptance criteria

- [ ] All three public routes render independently and cross-link correctly.
- [ ] Marketing page uses real current-app imagery and links to the latest public Utter release.
- [ ] Privacy copy matches the app’s actual local processing, local voice profile, logs, model downloads, and update behavior.
- [ ] Support page exposes a working email contact plus setup and troubleshooting guidance.
- [ ] Pages work without JavaScript, at mobile and desktop widths, with keyboard-visible focus and reduced-motion support.
- [ ] Existing site production build passes with no new broken references.
- [ ] Published HTTPS URLs return successful responses.

## Constraints and existing assets

- iamnotsam.com is the existing Vite/GitHub Pages site in this repository.
- Utter is Apple Silicon software for macOS 14+; speech recognition is local, while model downloads and release checks require network access.
- Existing dirty Calcuweight files are user work and must remain untouched.
- Git commits and pushes still require their separate repository approvals.

## Risks and gates

- The site can be built and verified locally now. Publishing to iamnotsam.com requires the repository’s explicit push gate.
- Privacy claims must stay narrower than the code: do not claim the app makes no network connections.
