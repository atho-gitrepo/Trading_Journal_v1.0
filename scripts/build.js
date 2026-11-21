const fs = require("node:fs");
const path = require("node:path");

const variableNames = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID"
];
const missing = variableNames.filter((name) => !process.env[name]);

if (missing.length) {
  throw new Error(`Missing Firebase build variables: ${missing.join(", ")}`);
}

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};
const configLiteral = JSON.stringify(config).replace(/</g, "\\u003c");
const replacements = [
  ["window.__FIREBASE_CONFIG__ = null;", `window.__FIREBASE_CONFIG__ = ${configLiteral};`],
  ["script-src 'unsafe-inline';", "script-src 'unsafe-inline' https://www.gstatic.com https://apis.google.com;"],
  [
    "connect-src 'none';",
    "connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebasestorage.googleapis.com https://firebaseinstallations.googleapis.com https://www.googleapis.com https://oauth2.googleapis.com https://accounts.google.com;"
  ],
  [
    "frame-src 'none';",
    "frame-src https://*.firebaseapp.com https://accounts.google.com https://*.google.com;"
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
