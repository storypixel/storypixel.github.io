# Utter — Apple Submission Website Checklist

## URLs to enter in App Store Connect

| Field | Final URL | Ready |
|---|---|---|
| Marketing URL | `https://iamnotsam.com/utter/` | Built; publication pending push approval |
| Support URL | `https://iamnotsam.com/utter/support/` | Built; publication pending push approval |
| Privacy Policy URL | `https://iamnotsam.com/utter/privacy/` | Built; publication pending push approval |

## Mac screenshots

Apple accepts Mac screenshots at 1440×900. Three finished screenshots are in:

- `public/utter/assets/app-store/utter-1.png`
- `public/utter/assets/app-store/utter-2.png`
- `public/utter/assets/app-store/utter-3.png`

Each image is 1440×900 and uses UI rendered from the current Utter codebase. The editable source is `app-store-screenshots.html` in this directory.

## App privacy answers supported by the current build

- **Data collection:** Data Not Collected
- **Tracking:** No
- **Account required:** No
- **Advertising or analytics SDKs:** None
- **Cloud transcription:** None
- **On-device processing:** Speech transcription, optional voice matching, and Apple Intelligence rewriting
- **Network use:** First-run model downloads and signed software update checks/downloads
- **Local data:** Downloaded models, preferences, an optional numerical voice profile, and operational logs that omit dictated or selected words

These answers must be revisited if the app adds analytics, accounts, cloud AI, crash-report upload, or any other new data flow.

## Website requirement coverage

- [x] Product name and clear description
- [x] Real screenshots of the current app
- [x] System requirements and current version
- [x] Download destination for the notarized release
- [x] Support page with setup, troubleshooting, updates, requirements, and direct contact
- [x] Privacy policy with processing, storage, permissions, network activity, deletion choices, and contact
- [x] Persistent navigation between marketing, support, and privacy pages
- [x] Responsive desktop and mobile layouts
- [x] Descriptive titles, descriptions, headings, link text, and image alternatives

## App review notes worth supplying

- Utter is a menu-bar app for Apple silicon Macs running macOS 14 or later.
- The first launch downloads a speech model of about 630 MB.
- Microphone permission is needed for dictation. Accessibility permission is needed to type, select, and replace text in other apps.
- Optional rewriting is available only when Apple Intelligence and Apple’s on-device Foundation Models are available on macOS 26 or later.
- No login or demo account is required.

## Official Apple references checked

- App privacy details: <https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy>
- Platform version fields, including Support URL and Marketing URL: <https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information>
- Screenshot specifications: <https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications?page_id=111069>
- Screenshot upload guidance: <https://developer.apple.com/help/app-store-connect/manage-app-information/upload-app-previews-and-screenshots/>

