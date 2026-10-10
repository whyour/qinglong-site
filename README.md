# Qinglong documentation

Documentation for [Qinglong](https://github.com/whyour/qinglong), built with Rspress. Chinese pages live in `docs/zh`; English pages live in `docs/en` with matching relative paths.

## Development

Use Node.js 22 and pnpm 8 (the CI environment):

```bash
pnpm install --frozen-lockfile
pnpm dev
```

## Validation

```bash
pnpm check:docs
pnpm check:api /absolute/path/to/qinglong
```

`check:docs` builds the site with Rspress's dead-link checker, then checks translation page parity, sidebar targets, code fences, interrupted shell continuations and localized metadata, rendered relative/root-relative link and image destinations, and HTML fragment targets. The generated shared `404.html` is excluded from the rendered-link pass because its locale switch has no separate generated English file. External links and API request/response schemas are not validated by this check.

`check:api` reads `cli/src/remote/api/openOperations.ts` from a Qinglong source checkout and compares registered HTTP methods, paths and command names with both API route tables. It does not execute upstream code, validate every backend route or check request schemas. For reproducible local checks, use the last audited source commit recorded below. If the registry format changes, review this checker as well as the documentation.

Pull requests run the documentation check and compare CLI routes with the immutable Qinglong source revision pinned in `.github/workflows/check-docs.yml`. Update this pin and the audit record together when documenting a newer source revision. The check is reproducible and does not automatically track later upstream changes. The workflow only reads upstream source and has no deployment permissions. Main-branch deployment runs the documentation check before uploading Pages artifacts.

Update both languages and their `_meta.json` navigation together. Keep source audit revisions in this maintenance README; user guides describe released functionality and version compatibility without branch-specific banners.

The footer year is computed at build time from the current year; rebuilding the site refreshes it automatically.

## Source audit record

An earlier detailed API/CLI audit used Qinglong commit `801a71d7402f5d4b582318ed88ad00633357a531`. CLI changes were subsequently merged into `master`, which is used by source links and source-build instructions. This historical record identifies that audited snapshot and does not imply that every later master change has been reviewed; the current CI revision is recorded below.

The CLI route table was additionally checked against master commit `6c487018c2e6b37ea1cfd5fabb383c8702e30426`: all 143 registered routes and command names match both language references.

The 2.23.0 documentation candidate pins Qinglong commit `011424ff7bea6fa56b49b13bfbb2b8ef8ea5e2f9` from [release-preparation PR #3090](https://github.com/whyour/qinglong/pull/3090), based on develop `b06cb72334e2cc3047a109e2b888d39c9d0373b4`. Panel metadata is prepared for 2.23.0 and remote CLI metadata for 0.1.2; neither package is published by these preparation PRs. The CLI registry contains 146 routes, including three script-history operations. History, scheduling, timeout, upgrade and backup documentation follows that source snapshot.

Six targeted dependency patches were committed separately to develop at `b06cb72334e2cc3047a109e2b888d39c9d0373b4`. Release PR #3090 now contains only version metadata, release notes and a build-only readiness workflow. It also includes the develop token-renewal/cache-serialization fix `89c6355635112574a7e1c368a527ac49e6582cd4`. Node/pnpm migration, runtime-tools packaging and npm publication restructuring from draft PR #3088 are deferred. Documentation no longer presents their Node 22/24, pnpm 10, Debian 13 or bundled npm installation behavior as part of this release. The default Debian Dockerfile still uses Node 20 and Bookworm; the default Alpine Dockerfile supplies Node through APK. The final minimal candidate has now passed its own image CI and independent dev acceptance window; previous large-candidate results were not used to validate it.

The maintainer approved 2.23.0 as the final Python 3.10 compatibility release. After publication, those variants will no longer receive maintenance updates.

Local validation on 2026-10-11 passed the 33 bilingual-page/link checks and both 146-route CLI references. The minimal dependency candidate passed 582 local panel tests with zero failures and seven macOS platform skips, plus front/back builds. CLI 0.1.2 was packaged offline after the metadata update; dependency lock contents were unchanged. [Final-candidate image CI](https://github.com/whyour/qinglong/actions/runs/38074739525) passed all four image variants and 24 platform combinations. [Documentation CI](https://github.com/whyour/qinglong-site/actions/runs/38074946191) passed at `4e6875d5657113bd6fb14debacc7bfe6f7a9e680`.

The same Qinglong candidate completed isolated dev acceptance on 2026-10-11 from 02:57:41 to 05:00:12 Asia/Shanghai: 7,328.19 active seconds after excluding 23.20 seconds of planned restart downtime, 405 health/CLI samples, seven functional cycles, 34 phases and two restart recoveries, with zero continuous-phase failures. JavaScript, Python and Shell tasks each produced 252 execution instances. Subscriptions, environment changes, script-history restore/conflicts, dependency installation/removal, system-token renewal/401 recovery and application-token revocation were exercised. Notification acceptance recorded 164 real SMTP messages, including 124 over TLS, and protocol acceptance passed 129 checks. Eleven supplemental task/subscription/script/application management API checks also passed.

Original preflight fixture errors and the supplemental bulk-stop exit-code assertion error remain preserved alongside corrected passing evidence. Bulk task stop retains the shell termination exit code 1; only the single-instance stop endpoint sets 143. These corrections changed QA expectations only, without changing the product image or restarting the acceptance clock. Frozen QA hashes, protected container identities and Docker daemon identities were checked at completion. Only the current test container and its unique image tag were removed; test data, logs and previous resources were retained. This acceptance exercises a fresh isolated instance through API/CLI, not every UI interaction or a real-user backup rollback. Formal publication and site deployment remain pending maintainer confirmation.
