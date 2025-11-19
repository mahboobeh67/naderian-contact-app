// src/scripts/relink-imports.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const projectRoot = path.resolve(__dirname, "../"); // ← root of project
const srcDir = path.join(__dirname, "../")

const oldSegments = ["/components/", "/context/", "/utils/"];
const newSegments = {
  "/components/": "/features/contacts/components/",
  "/context/": "/features/contacts/context/",
  "/utils/": "/features/contacts/utils/",
};

function walk(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, callback);
    else if (entry.isFile() && /\.(jsx?|tsx?)$/.test(entry.name))
      callback(fullPath);
  }
}

function fixImports(filePath) {
  let file = fs.readFileSync(filePath, "utf8");
  let updated = file;

  for (const oldPath of oldSegments) {
    const newPath = newSegments[oldPath];
    const regex = new RegExp(`(["'])\\.?${oldPath}`, "g");
    updated = updated.replace(regex, `$1${newPath}`);
  }

  if (updated !== file) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log("✅ Updated:", path.relative(srcDir, filePath));
  }
}

walk(srcDir, fixImports);

console.log("\n✨ All imports updated to feature-based structure!");

