const fs = require("node:fs");
const path = require("node:path");

const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split(/\r?\n/).forEach(function(line){
    var match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2];
  });
}

const variableNames = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY"
];
const missing = variableNames.filter((name) => !process.env[name]);

if (missing.length) {
  throw new Error(`Missing Supabase build variables: ${missing.join(", ")}`);
}

const config = {
  url: process.env.SUPABASE_URL,
  anonKey: process.env.SUPABASE_ANON_KEY
};
const configLiteral = JSON.stringify(config).replace(/</g, "\\u003c");
const replacements = [
  ["window.__SUPABASE_CONFIG__ = null;", `window.__SUPABASE_CONFIG__ = ${configLiteral};`],
  ["script-src 'unsafe-inline';", "script-src 'unsafe-inline' https://cdn.jsdelivr.net;"],
  [
    "connect-src 'none';",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co;"
  ]
];

const sourcePath = path.join(__dirname, "..", "index.html");
const outputDir = path.join(__dirname, "..", "dist");
let html = fs.readFileSync(sourcePath, "utf8");

for (const [source, replacement] of replacements) {
  if (!html.includes(source)) {
    throw new Error(`Build placeholder not found: ${source}`);
  }
  html = html.replace(source, replacement);
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "index.html"), html);
