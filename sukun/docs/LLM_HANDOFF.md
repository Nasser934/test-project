# Sukun — handoff prompt for the next coding LLM

Copy this whole file into the next LLM. It is the execution contract for continuing the app without re-litigating settled decisions.

## Role and outcome

You are the staff iOS engineer responsible for taking Sukun from a compiling product foundation to a signed TestFlight beta. Sukun is an Arabic-first, privacy-first iPhone app that shields user-selected distracting apps during Islamic prayer windows and removes the shield automatically afterward.

Do not replace the product with a generic habit tracker, prayer-content app, parental-control dashboard, or web wrapper. Preserve the existing native SwiftUI and Screen Time architecture.

## Repository and branch

- Repository: `Nasser934/test-project`
- Pull request: `#16`
- Branch: `project-sukun-ios`
- Product root inside repository: `sukun/`
- The root `main` React project is unrelated. Do not mix its source or committed `node_modules` into Sukun.

## Verified baseline

At commit `6b13e61470e7ba7611a51607f7875bbb4cf1937f`:

- `swift test --package-path sukun/Packages/SukunCore` passes.
- `xcodegen generate` passes.
- Xcode 26.3 / iOS Simulator 26.2 builds the app plus all three extensions.
- The product-design prototype passed QA at 390 × 844.
- Prototype core navigation and protection-test states pass with zero app-origin console errors.
- XML, JSON, YAML, and shell metadata validate.

Do not claim any physical-device Screen Time callback has passed yet. That requires the owner's Apple Developer signing and iPhone.

## Current targets

1. `Sukun` — SwiftUI app.
2. `SukunActivityMonitor` — `DeviceActivityMonitor` extension.
3. `SukunShieldConfiguration` — Arabic `ManagedSettingsUI` shield.
4. `SukunShieldAction` — closes a shielded application when the user acts.
5. `SukunCore` — Foundation-only package with prayer calculation, domain types, and schedule planning.

## Current architecture

- `Packages/SukunCore`: pure domain/calculation/planning code.
- `SukunApp/AppModel.swift`: application state and orchestration.
- `SukunApp/ScreenTimeCoordinator.swift`: Family Controls, immediate shield test, and Device Activity registration.
- `Shared/AppGroupStore.swift`: typed shared persistence for selection, preferences, and health.
- `Extensions/*`: scheduled shield execution and shield UI/actions.
- `Resources/Assets.xcassets`: final generated shield visual and app icon.
- `Configuration/*`: entitlements, extension plists, and privacy manifest.
- `project.yml`: XcodeGen source of truth. Never edit a generated `.xcodeproj` as the canonical project.

## Non-negotiable product decisions

1. Native Swift/SwiftUI, iOS 17 minimum, Swift 6.
2. Arabic RTL is the primary experience; English localization may follow without weakening Arabic.
3. Core prayer calculations work offline.
4. No account, backend, ads, analytics SDK, AI feature, social feed, or content catalog in V1.
5. Family Controls authorization is `.individual` and always follows a user action.
6. The user explicitly chooses apps/categories/sites with `FamilyActivityPicker`.
7. The app shields only its own named `ManagedSettingsStore` and schedules only its own Device Activity names.
8. Sunrise is display-only and must never create a protection window.
9. A cached boolean alone must never show “الحماية جاهزة”; readiness combines authorization, selection, valid scheduled windows, and no current error.
10. Simulator success does not prove Device Activity callbacks or distribution entitlements.
11. Never store raw app tokens, precise coordinates, certificates, signing secrets, or provisioning profiles in Git or logs.
12. Never introduce a server dependency for core prayer times.

## Phase A — Apple entitlement proof (next action)

Outcome: demonstrate one complete shield window while the host app is closed.

Owner inputs required:

- Apple Developer Team ID.
- Four explicit App IDs from `docs/APPLE_SETUP.md`.
- App Group `group.com.sukun.app`.
- Development Family Controls capability for every relevant target.
- Distribution entitlement approval before TestFlight.
- One physical iPhone running a supported iOS version.

Tasks:

1. Set `DEVELOPMENT_TEAM` without committing a personal provisioning profile.
2. Verify capabilities in the Apple portal and generated project.
3. Install a development build on iPhone.
4. Request authorization, choose a disposable test app, and run the immediate shield test.
5. Add an internal-only control that schedules a window two minutes in the future and ends five minutes later.
6. Force-close Sukun.
7. Confirm the monitor extension applies and clears the shield.
8. Confirm App Group health timestamps update.
9. Record the exact device/iOS/build and result in `docs/DEVICE_TEST_LOG.md`.

Acceptance:

- Authorization status is approved.
- Selection persists after process termination.
- Immediate test shields and clears only selected items.
- Scheduled monitor starts while Sukun is closed.
- Scheduled monitor ends and clears the named Sukun store.
- No unrelated Managed Settings values are changed.

If signing or entitlement prevents the test, stop and report the exact Apple error. Do not fake success with an in-app timer.

## Phase B — production-grade planner and reconciliation

The current planner is intentionally small. Upgrade it before external beta.

Required changes:

- Plan a rolling 72-hour horizon.
- Cap planned Device Activity windows at 15, reserving capacity for diagnostics/repair.
- Enforce a minimum 15-minute interval if Apple requires it for the target SDK.
- Deterministic name: `sukun.g{generation}.{yyyyMMdd}.{prayer}`.
- Persist current generation, pending generation, last-good generation, and a plan fingerprint.
- Replace `activityCenter.stopMonitoring()` with an explicit list of Sukun-owned activity names.
- Read back registered activity names after scheduling.
- Roll back to the last-good plan if any registration fails.
- Make reconciliation idempotent across repeated foreground launches.
- Recalculate on day change, timezone change, significant time change, location/settings change, and authorization change.

Add protocol adapters so failures can be unit-tested without Apple frameworks:

- `DeviceActivityScheduling`
- `ShieldManaging`
- `AuthorizationReading`
- `SharedStatePersisting`

Acceptance tests:

- five prayers × three days yields 15 valid intervals;
- sunrise never appears;
- disabled prayer never appears;
- repeated reconciliation creates no duplicates;
- simulated failure at every registration index restores the last-good generation;
- stop/remove operations contain only `sukun.` names;
- timezone/DST changes produce a new valid fingerprint.

## Phase C — prayer-time accuracy and location

Current status: a local solar calculator with Umm al-Qura defaults is implemented and tested for Riyadh ordering/noon tolerance.

Before multi-city launch:

- Add a `PrayerCalculating` protocol.
- Compare the local implementation with a pinned, reviewed release of `batoulapps/adhan-swift` or another audited offline implementation.
- Keep one implementation as production and the other as a golden comparison tool; do not silently average results.
- Add explicit method, madhab, high-latitude rule, and per-prayer integer offsets.
- Add Core Location with “while in use” permission, manual city fallback, and timezone resolution.
- Store rounded coordinates or a city identifier; do not log exact coordinates.
- Use Gregorian Calendar for schedules and Umm al-Qura Calendar only for Ramadan context/display.
- Recalculate Isha interval for Ramadan with manual override.

Golden test matrix:

- Riyadh, Makkah, Jeddah, Dubai, Cairo, Karachi, London, New York, Oslo/Helsinki, Kuala Lumpur, Sydney.
- DST start/end dates.
- First and fifteenth day of every month.
- Standard and Hanafi Asr.
- Friday Dhuhr display label.
- High-latitude rule choices.
- Manual offsets and chronological order.

Document the reference source and acceptable tolerance for every golden fixture.

## Phase D — UX completion

Preserve the selected visual language: deep navy, mint readiness, sand prayer emphasis, vertical timeline, calm surfaces, real shield asset, and Phosphor/SF Symbols consistency.

Add:

- three-screen onboarding: promise, privacy/limitations, permission setup;
- denied/revoked permission recovery with a Settings deep link;
- per-prayer toggles;
- calculation method, madhab, and offsets;
- a real local session ledger populated by monitor start/end callbacks;
- empty/loading/error states;
- Dynamic Type through accessibility sizes;
- VoiceOver labels and logical RTL order;
- reduced-motion behavior;
- Arabic and English string catalogs.

Do not add decorative dashboards or content unrelated to the core protection flow.

## Phase E — reliability and release

- Add structured, bounded, privacy-safe diagnostics in the App Group.
- Add a support export that excludes selection tokens and exact coordinates.
- Add `DEVICE_TEST_LOG.md`, `TEST_MATRIX.md`, and `DECISIONS.md`.
- Add UI tests for onboarding, denied permission copy, settings, and no-selection state.
- Run the physical-device matrix on at least two iPhone models and two iOS versions.
- Run seven-day internal TestFlight soak before external beta.
- Confirm App Store privacy answers match `PrivacyInfo.xcprivacy`.
- Publish privacy policy and support URLs.
- Use the release checklist in `docs/RELEASE_CHECKLIST.md` without skipping entitlement or callback gates.

## Working protocol

For every change:

1. Inspect current code first.
2. State the vertical-slice outcome and files to touch.
3. Implement the smallest coherent slice.
4. Run `swift test`, `xcodegen generate`, and simulator build when applicable.
5. Report what passed and what remains unproven on a real device.
6. Keep commits scoped and descriptive.
7. Keep PR #16 green.
8. Never rewrite `main` history or delete the unrelated React project.

## Commands

```bash
cd sukun
brew install xcodegen
swift test --package-path Packages/SukunCore
xcodegen generate
xcodebuild -project Sukun.xcodeproj -scheme Sukun \
  -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  CODE_SIGNING_ALLOWED=NO build
```

## Definition of beta-ready

Beta-ready means all of the following are true:

- PR CI is green.
- Apple signing and all four targets' entitlements are valid.
- Immediate shield test passes on device.
- Scheduled start/end passes while the host app is terminated.
- 72-hour planner and rollback tests pass.
- multi-city prayer-time golden tests pass.
- onboarding, recovery, accessibility, and local history are complete.
- seven-day TestFlight soak has no unexplained missed callback.
- privacy policy, App Store privacy answers, and support path are ready.

Anything less is an engineering build, not a production beta.
