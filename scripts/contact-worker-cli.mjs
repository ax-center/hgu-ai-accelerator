import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const runtimeRoot = path.join(projectRoot, ".sites-runtime", "contact-worker");

// Keep Wrangler's disposable logs and registries inside the checkout on every OS.
process.env.XDG_CONFIG_HOME = path.join(runtimeRoot, "xdg.config");
process.env.WRANGLER_SEND_METRICS ||= "false";
process.env.WRANGLER_WRITE_LOGS ||= "false";
process.env.WRANGLER_LOG_PATH = path.join(runtimeRoot, "logs", "wrangler.log");
process.env.WRANGLER_REGISTRY_PATH = path.join(runtimeRoot, "dev-registry");
process.env.MINIFLARE_REGISTRY_PATH = path.join(runtimeRoot, "registry");
process.env.CLOUDFLARE_CF_FETCH_ENABLED ||= "false";

const wranglerCli = fileURLToPath(new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url));
const result = spawnSync(process.execPath, [wranglerCli, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
