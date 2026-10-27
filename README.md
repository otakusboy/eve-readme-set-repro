# Reproduction: obsolete model-setting command in eve's package README

The README shipped with `eve@0.84.0` documents:

```text
eve set [--model <model-id>] [--reasoning <effort>]
```

The released CLI rejects `eve set --model ...`. Its supported syntax is
`eve set model [model] [--reasoning <effort>]`.

## Reproduce

Use Node.js 24.x (the scaffold's declared engine) and npm:

```bash
npm ci
npm run reproduce
```

The script reads the installed package README, runs the documented command,
checks its `unknown option '--model'` failure, and prints the supported
`eve set model --help` syntax. The reproduction script exits successfully only
when it observes this discrepancy. The rejected eve command itself exits 1.

No credentials, agent startup, model requests, or deployment are required.
`npm ci` needs network access to download public dependencies. CLI telemetry is
disabled by the script. See `evidence.txt` for the captured verification output.

To inspect the same behavior manually after installation:

```bash
EVE_TELEMETRY_DISABLED=1 npx --no-install eve set --model openai/gpt-6-luna-fast
EVE_TELEMETRY_DISABLED=1 npx --no-install eve set model --help
```

## Provenance and scope

Created on October 27, 2026 using the official scaffold:

```bash
EVE_TELEMETRY_DISABLED=1 npx --yes eve@latest init eve-readme-set-repro --non-interactive
```

At creation, npm's `latest` release was `0.84.0`. The eve dependency was then
pinned to `0.84.0` in `package.json` and `package-lock.json`; `private: true`
prevents accidental npm publication. The default agent files are unchanged.
The reproduction-specific additions are this README, the `reproduce` script,
and its captured evidence. No upstream eve code was changed.

Verified on macOS 27.0.1 arm64 with Node.js 26.7.0; Node 24.x is recommended to
match the generated project's engine declaration. The verification Node version
satisfies eve's own `>=24` requirement.

Upstream evidence:

- [Obsolete README entry at the audited commit](https://github.com/vercel/eve/blob/a5328b4482812da9cf97e7ad90df363950627032/packages/eve/README.md#L154)
- [Current command registration](https://github.com/vercel/eve/blob/a5328b4482812da9cf97e7ad90df363950627032/packages/eve/src/cli/run.ts#L224-L239)
- [PR #3814, which intentionally changed the command syntax](https://github.com/vercel/eve/pull/3814)
