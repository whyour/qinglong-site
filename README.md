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

Pull requests run the documentation check and compare CLI routes with upstream `master`. Upstream changes can therefore require documentation updates even when this repository has not changed. The workflow only reads upstream source and has no deployment permissions. Main-branch deployment runs the documentation check before uploading Pages artifacts.

Update both languages and their `_meta.json` navigation together. Keep source audit revisions in this maintenance README; user guides describe released functionality and version compatibility without branch-specific banners.

The footer year is computed at build time from the current year; rebuilding the site refreshes it automatically.

## Source audit record

The last detailed API/CLI audit used Qinglong commit `801a71d7402f5d4b582318ed88ad00633357a531`. CLI changes have since been merged into `master`; source links, source-build instructions and CI route checks now target `master`. This record identifies the audited snapshot and does not imply that every later master change has been reviewed.

The CLI route table was additionally checked against master commit `6c487018c2e6b37ea1cfd5fabb383c8702e30426`: all 143 registered routes and command names match both language references.
