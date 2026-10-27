import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const require = createRequire(import.meta.url);
const packageRoot = dirname(require.resolve("eve/package.json"));
const packageJson = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));
const readme = readFileSync(join(packageRoot, "README.md"), "utf8");
const entry = readme.split("\n").find((line) => line.startsWith("- `eve set ["));

assert.equal(packageJson.version, "0.84.0", "Use the pinned eve release.");
assert.ok(entry, "The installed README no longer contains the obsolete entry; recheck the report.");
console.log(`Node: ${process.version}; platform: ${process.platform} ${process.arch}`);
console.log(`eve: ${packageJson.version}`);
console.log(`\nInstalled package README:\n${entry}`);

function run(args) {
  console.log(`\n$ eve ${args.join(" ")}`);
  const result = spawnSync(process.execPath, [join(packageRoot, "bin/eve.js"), ...args], {
    cwd: process.cwd(),
    env: { ...process.env, EVE_TELEMETRY_DISABLED: "1", NO_COLOR: "1" },
    encoding: "utf8",
    timeout: 15_000,
  });
  if (result.error) throw result.error;
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  console.log(output.trimEnd());
  console.log(`Exit code: ${result.status}`);
  return { ...result, output };
}

const obsolete = run(["set", "--model", "openai/gpt-6-luna-fast"]);
assert.equal(obsolete.status, 1);
assert.match(obsolete.output, /unknown option '--model'/);
const help = run(["set", "model", "--help"]);
assert.equal(help.status, 0);
assert.match(help.output, /Usage: eve set model \[options\] \[model\]/);
assert.match(help.output, /--reasoning/);
console.log("\nReproduced: the packaged README documents an unsupported command.");
console.log("No agent server, model request, authentication, or deployment was needed.");
