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

The 2.23.0 documentation candidate pins Qinglong commit `c1c32abb82906db6c88bb5b646e30078d17e249e` from [minimal dependency PR #3090](https://github.com/whyour/qinglong/pull/3090), based on develop `68ffa106f80a2080ddd9b48affe0d7a7489e4d05`. Its remote CLI registry contains 146 routes, including three script-history operations. History, scheduling, timeout, upgrade and backup documentation follows that source snapshot.

The release scope was narrowed on 2026-10-11 to six targeted dependency patches. Node/pnpm migration, runtime-tools packaging and npm publication restructuring from draft PR #3088 are deferred. Documentation no longer presents their Node 22/24, pnpm 10, Debian 13 or bundled npm installation behavior as part of this release. The default Debian Dockerfile still uses Node 20 and Bookworm; the default Alpine Dockerfile supplies Node through APK. CI and an independent dev window must validate the new minimal candidate; previous large-candidate results do not validate it.

The maintainer approved 2.23.0 as the final Python 3.10 compatibility release. After publication, those variants will no longer receive maintenance updates.

Local validation on 2026-10-11 passed the 33 bilingual-page/link checks and both 146-route CLI references against this exact minimal candidate. Its local panel regression passed 497 tests with zero failures and seven macOS platform skips; front/back builds passed. Image CI and the candidate-specific dev window remain pending.
