#!/usr/bin/env node
/**
 * relink-imports-ultra.js
 * Ultra version — enterprise-grade import fixer for front-end projects
 *
 * Usage:
 *   node relink-imports-ultra.js [--apply] [--root ./src] [--alias @=./src] [--dry]
 *
 * Features:
 *  - Scans project files (.js,.jsx,.ts,.tsx)
 *  - Detects missing/broken imports
 *  - Resolves imports via alias (reads vite.config.js if present)
 *  - Resolves imports by checking candidate files/folders and index files
 *  - Fuzzy matching to suggest fixes when exact file not found
 *  - Dry-run mode shows suggested fixes
 *  - --apply mode writes changes and creates backups (.bak)
 *  - Generates a detailed JSON report
 *
 * Notes:
 *  - This script is intentionally dependency-free (pure Node) to work out of the box.
 *  - For very large repos you may want to use a faster globbing library (globby/fast-glob).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// -------------------------
// Helpers & Config
// -------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_ROOT = process.cwd(); // fallback

const args = process.argv.slice(2);
const options = {
  apply: args.includes("--apply"),
  dry: args.includes("--dry") || !args.includes("--apply"),
  root: extractArgValue("--root") || path.join(process.cwd(), "src"),
  alias: parseAliasArg(extractArgValue("--alias")),
  report: extractArgValue("--report") || path.join(process.cwd(), "relink-report.json"),
};

function extractArgValue(flag) {
  const idx = args.findIndex((a) => a === flag);
  if (idx === -1) return null;
  return args[idx + 1] || null;
}

function parseAliasArg(aliasStr) {
  // format: @=./src,~=./src/components
  if (!aliasStr) return {};
  return aliasStr.split(",").reduce((acc, pair) => {
    const [k, v] = pair.split("=").map((s) => s && s.trim());
    if (k && v) acc[k] = path.resolve(process.cwd(), v);
    return acc;
  }, {});
}

// Try to read vite.config.js to auto-detect alias
function detectAliasFromVite() {
  const vitePathJs = path.resolve(process.cwd(), "vite.config.js");
  const vitePathTs = path.resolve(process.cwd(), "vite.config.ts");
  const alias = {};

  try {
    const p = fs.existsSync(vitePathJs) ? vitePathJs : fs.existsSync(vitePathTs) ? vitePathTs : null;
    if (!p) return alias;
    const content = fs.readFileSync(p, "utf-8");
    // naive parse: find @: path.resolve(__dirname, './src') or "@": path.resolve(__dirname, "./src")
    const match = content.match(/alias\s*:\s*\{([\s\S]*?)\}/m);
    if (!match) return alias;
    const inner = match[1];
    const lines = inner.split(/,\n|,\r\n|,/);
    lines.forEach((line) => {
      const m = line.match(/['\"](.+?)['\"]\s*:\s*path\.resolve\(([^,]+),\s*['\"](.+?)['\"]\)/);
      if (m) {
        const key = m[1];
        const rel = m[3];
        // compute dirname for vite config
        const dirname = path.dirname(p);
        alias[key] = path.resolve(dirname, rel);
      }
    });
  } catch (e) {
    // ignore
  }
  return alias;
}

// Merge aliases: CLI > detected
const detectedAlias = detectAliasFromVite();
options.alias = { ...(detectedAlias || {}), ...(options.alias || {}) };

const SUPPORTED_EXTS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];
const IGNORE_DIRS = ["node_modules", "dist", "build", ".git"];

// -------------------------
// File system utilities
// -------------------------
function isIgnored(p) {
  return IGNORE_DIRS.some((d) => p.split(path.sep).includes(d));
}

function walkDir(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (isIgnored(full)) continue;
    if (it.isDirectory()) results.push(...walkDir(full));
    else if (SUPPORTED_EXTS.includes(path.extname(it.name))) results.push(full);
  }
  return results;
}

function readFileSafe(file) {
  try {
    return fs.readFileSync(file, "utf-8");
  } catch (e) {
    return null;
  }
}

function writeBackup(file) {
  const bak = file + ".relinkbak";
  if (!fs.existsSync(bak)) fs.writeFileSync(bak, fs.readFileSync(file));
}

// -------------------------
// Build file map (path -> real file)
// -------------------------
function buildFileIndex(root) {
  const files = walkDir(root);
  const map = new Map();
  for (const f of files) {
    const rel = path.relative(root, f).replace(/\\/g, "/");
    map.set("/" + rel, f);
    // also register without extension and with index variants
    const noExt = f.replace(new RegExp(path.extname(f) + "$"), "");
    map.set("/" + path.relative(root, noExt).replace(/\\/g, "/"), f);
    // index.js registration if file is index
    const dirname = path.dirname(f);
    const base = path.basename(f, path.extname(f));
    if (base === "index") {
      map.set("/" + path.relative(root, dirname).replace(/\\/g, "/"), f);
    }
  }
  return map;
}

// fuzzy match utility (token inclusion + levenshtein-ish)
function similarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.9;
  const aTokens = a.split(/[\/.\\_-]/).filter(Boolean);
  const bTokens = b.split(/[\/.\\_-]/).filter(Boolean);
  const common = aTokens.filter((t) => bTokens.includes(t)).length;
  return Math.min(0.8, common / Math.max(aTokens.length, bTokens.length));
}

function findBestMatch(target, fileIndex) {
  // target is absolute or aliased path like '/features/contacts/actions/createContact'
  let best = null;
  let bestScore = 0;
  for (const [k, v] of fileIndex.entries()) {
    const sc = similarity(k, target);
    if (sc > bestScore) {
      bestScore = sc;
      best = { key: k, file: v, score: sc };
    }
  }
  return bestScore > 0 ? best : null;
}

// -------------------------
// Import parsing + resolution
// -------------------------
const IMPORT_RE = /import\s+(?:[^'\"]+from\s+)?['\"]([^'\"]+)['\"]/g;

function parseImports(fileContent) {
  const imports = [];
  let m;
  while ((m = IMPORT_RE.exec(fileContent)) !== null) {
    imports.push(m[1]);
  }
  return imports;
}

function resolveImportPath(importPath, filePath, root, fileIndex, aliases) {
  // returns { found: bool, resolved: string|null, reason }
  // 1) alias
  if (importPath.startsWith("/")) importPath = importPath; // already absolute
  if (importPath.startsWith("./") || importPath.startsWith("../")) {
    // relative resolve
    const absCandidate = path.resolve(path.dirname(filePath), importPath);
    // try with extensions
    for (const ext of SUPPORTED_EXTS) {
      const attempt = absCandidate + ext;
      if (fs.existsSync(attempt)) return { found: true, resolved: attempt, reason: "exact-relative" };
    }
    // try raw file (maybe included ext)
    const existsRaw = resolveRealFile(absCandidate);
    if (existsRaw) return { found: true, resolved: existsRaw, reason: "relative-resolve" };
    // try index in folder
    for (const ext of SUPPORTED_EXTS) {
      const attempt = path.join(absCandidate, "index" + ext);
      if (fs.existsSync(attempt)) return { found: true, resolved: attempt, reason: "relative-index" };
    }
    return { found: false, resolved: null, reason: "relative-not-found", candidate: absCandidate };
  }

  // alias handling
  for (const [aliasKey, aliasPath] of Object.entries(aliases || {})) {
    if (importPath === aliasKey || importPath.startsWith(aliasKey + "/")) {
      const rest = importPath.slice(aliasKey.length);
      const absCandidate = path.join(aliasPath, rest);
      const existsFile = resolveRealFile(absCandidate);
      if (existsFile) return { found: true, resolved: existsFile, reason: "alias-exact" };
      // try index
      for (const ext of SUPPORTED_EXTS) {
        const attempt = absCandidate + ext;
        if (fs.existsSync(attempt)) return { found: true, resolved: attempt, reason: "alias-ext" };
      }
      for (const ext of SUPPORTED_EXTS) {
        const attempt = path.join(absCandidate, "index" + ext);
        if (fs.existsSync(attempt)) return { found: true, resolved: attempt, reason: "alias-index" };
      }
      // fuzzy fallback using file index
      const targetKey = "/" + path.relative(root, absCandidate).replace(/\\/g, "/");
      const best = findBestMatch(targetKey, fileIndex);
      if (best) return { found: true, resolved: best.file, reason: "alias-fuzzy", suggestion: best };
      return { found: false, resolved: null, reason: "alias-not-found", candidate: absCandidate };
    }
  }

  // bare module import (like react) — skip
  if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
    // might be package; check node_modules
    const nm = path.join(process.cwd(), "node_modules", importPath);
    if (fs.existsSync(nm)) return { found: true, resolved: nm, reason: "node-module" };
    return { found: true, resolved: importPath, reason: "package" };
  }

  return { found: false, resolved: null, reason: "unknown" };
}

// -------------------------
// Main processing
// -------------------------
function run() {
  const root = path.resolve(options.root || DEFAULT_ROOT);
  if (!fs.existsSync(root)) {
    console.error(`ERROR: root not found: ${root}`);
    process.exit(1);
  }

  console.log(`Scanning project root: ${root}`);
  const fileIndex = buildFileIndex(root);
  const files = walkDir(root);

  const report = {
    scannedFiles: files.length,
    fixes: [],
    errors: [],
    changedFiles: [],
  };

  for (const f of files) {
    const content = readFileSafe(f);
    if (!content) continue;
    const imports = parseImports(content);
    if (imports.length === 0) continue;

    let updated = false;
    let newContent = content;

    for (const imp of imports) {
      const res = resolveImportPath(imp, f, root, fileIndex, options.alias);
      if (!res.found) {
        report.errors.push({ file: f, import: imp, reason: res.reason, candidate: res.candidate });
        continue;
      }

      // compute relative import to replace
      let replacement = null;
      if (res.reason === "node-module" || res.reason === "package") continue; // skip

      if (res.resolved.startsWith(process.cwd())) {
        // within project
        const rel = getRelativeImportPathForFile(f, res.resolved, root, options.alias);
        replacement = rel;
      } else {
        // external path
        continue;
      }

      if (!replacement) continue;
      if (replacement === imp) continue; // already correct

      // replace all occurrences of 'from "imp"'
      const escaped = imp.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`from\\s+([\\"'])${escaped}([\\"'])`, "g");
      newContent = newContent.replace(re, `from '${replacement}'`);

      // fallback simpler replace (when import syntax differs)
      if (newContent === content) {
        newContent = newContent.split(imp).join(replacement);
      }

      report.fixes.push({ file: f, from: imp, to: replacement, reason: res.reason });
      updated = true;
    }

    if (updated) {
      if (options.apply) {
        writeBackup(f);
        fs.writeFileSync(f, newContent, "utf-8");
        report.changedFiles.push(f);
      } else {
        report.changedFiles.push(f + " (dry-run)");
      }
    }
  }

  fs.writeFileSync(options.report, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Done. Report written to ${options.report}`);
  console.log(`${report.fixes.length} suggested fixes, ${report.errors.length} unresolved imports.`);
}

function getRelativeImportPathForFile(fromFile, resolvedFile, root, aliases) {
  // If resolvedFile is under an alias root, produce alias import
  for (const [key, aliasRoot] of Object.entries(aliases || {})) {
    const relToAlias = path.relative(aliasRoot, resolvedFile);
    if (!relToAlias.startsWith("..")) {
      // we can use alias
      const candidate = path.posix.join(key, relToAlias.replace(/\\/g, "/"));
      return candidate;
    }
  }

  // else make a relative path from fromFile
  let rel = path.relative(path.dirname(fromFile), resolvedFile).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  // remove file extension for common JS import style
  rel = rel.replace(new RegExp("(" + SUPPORTED_EXTS.map((s) => s.replace(".", "\\.")).join("|") + ")$"), "");
  return rel;
}

// Run
run();
