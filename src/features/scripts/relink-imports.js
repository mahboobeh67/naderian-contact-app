/**
 * relink-imports.js
 * --------------------------------------------
 * این اسکریپت تمام import های اشتباه را پیدا کرده
 * و مسیر صحیح را مطابق ساختار جدید پروژه جایگزین می‌کند.
 */

import fs from "fs";
import path from "path";

const root = path.resolve(process.cwd(), "src");

// مسیرهای صحیح و رسمی پروژه
const pathMap = {
  // context
  "/context/actions": "/actions", // اشتباه رایج
  "/context/reducer": "/context",
  "/context/context": "/context",
  "/context/ContactsContext": "/context/ContactsContext",

  // reducer
  "/reducer/contactsReducer": "/context/contactsReducer",
  "/reducer/contactsInitialState": "/context/contactsInitialState",
  "/reducer/actionTypes": "/context/actionTypes",

  // actions
  "/actions/index": "/actions",
  "/actions/createContactAction": "/actions/createContact",

  // پاکسازی pathهای اشتباه
  "/context/index": "/context",
};

function fixImportLine(line) {
  if (!line.includes("import")) return line;

  let newLine = line;

  for (const wrong in pathMap) {
    if (newLine.includes(wrong)) {
      const correct = pathMap[wrong];
      newLine = newLine.replace(wrong, correct);
      console.log(`🔧 اصلاح مسیر: ${wrong}   →   ${correct}`);
    }
  }

  return newLine;
}

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    // داخل node_modules و build نرو
    if (fullPath.includes("node_modules") || fullPath.includes("dist")) continue;

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const original = content;

  const lines = content.split("\n");
  const fixedLines = lines.map((line) => fixImportLine(line));

  content = fixedLines.join("\n");

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✨ فایل اصلاح شد: ${filePath}`);
  }
}

console.log("🔍 در حال بررسی و اصلاح import ها...");
walk(root);
console.log("✅ همه‌ی مسیرهای import با موفقیت اصلاح شدند!");


