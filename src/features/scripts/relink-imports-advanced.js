

import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "src");
const ALIAS = "@"; // alias vite
const aliasPath = ROOT; // مسیر فیزیکی alias

const exts = [".js", ".jsx", ".ts", ".tsx"];

const ignoreDirs = ["node_modules", "dist", "build"];


function isIgnored(p) {
  return ignoreDirs.some((dir) => p.includes(`/${dir}`));
}

function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const full = path.join(dir, file);

    if (isIgnored(full)) return;

    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(full));
    } else if (exts.some((e) => file.endsWith(e))) {
      results.push(full);
    }
  });

  return results;
}


function resolveRealFile(basePath) {
  if (fs.existsSync(basePath)) return basePath;

  for (const ext of exts) {
    if (fs.existsSync(basePath + ext)) return basePath + ext;
  }

  return null;
}

function getRelativeImport(fromFile, targetFile) {
  let rel = path.relative(path.dirname(fromFile), targetFile);
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel.replace(/\\/g, "/");
}

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  let original = content;

  const lines = content.split("\n");
  const changedImports = [];

  const fixedLines = lines.map((line) => {
    if (!line.trim().startsWith("import")) return line;

    const match = line.match(/from\s+['"](.*)['"]/);
    if (!match) return line;

    let importPath = match[1];
    const originalPath = importPath;

    if (importPath.startsWith(ALIAS)) {
      const resolved = path.join(aliasPath, importPath.slice(1));
      importPath = getRelativeImport(filePath, resolved);
      changedImports.push({ originalPath, newPath: importPath });
      return line.replace(originalPath, importPath);
    }

    if (importPath.startsWith(".")) {
      const absTarget = path.resolve(path.dirname(filePath), importPath);

  
      const realFile = resolveRealFile(absTarget);
      if (!realFile) {
        changedImports.push({
          originalPath,
          newPath: "(not found!)",
        });
        return line; 
      }

     
      const correctRelative = getRelativeImport(filePath, realFile);

      if (correctRelative !== importPath) {
        changedImports.push({ originalPath, newPath: correctRelative });
        return line.replace(originalPath, correctRelative);
      }
    }

    return line;
  });

  content = fixedLines.join("\n");

 
  if (content === original) return;

 
  fs.writeFileSync(filePath + ".bak", original, "utf-8");

  fs.writeFileSync(filePath, content, "utf-8");

  console.log(`✨ اصلاح شد → ${filePath}`);
}

console.log("🔍 در حال اسکن پروژه...");

const allFiles = getAllFiles(ROOT);

console.log(`📁 تعداد فایل‌ها: ${allFiles.length}`);
console.log("⚙ شروع اصلاح مسیرها...\n");

allFiles.forEach(fixImportsInFile);

console.log("\n🎉 کار تمام شد! مسیرهای import با موفقیت اصلاح شدند.");
console.log("📝 اگر مشکلی رخ داد، نسخه بک‌آپ هر فایل موجود است (.bak)");
