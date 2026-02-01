const fs = require("fs");

let content = fs.readFileSync("src/lib/questBank.ts", "utf8");

// Замена эмодзи-цифр
content = content.replace(/1️⃣/g, "1.");
content = content.replace(/2️⃣/g, "2.");
content = content.replace(/3️⃣/g, "3.");
content = content.replace(/4️⃣/g, "4.");
content = content.replace(/5️⃣/g, "5.");
content = content.replace(/6️⃣/g, "6.");
content = content.replace(/7️⃣/g, "7.");
content = content.replace(/8️⃣/g, "8.");
content = content.replace(/9️⃣/g, "9.");
content = content.replace(/🔟/g, "10.");

// Очистка thumbnail
content = content.replace(/thumbnail:\s*"[^"]*"/g, 'thumbnail: ""');

fs.writeFileSync("src/lib/questBank.ts", content, "utf8");
console.log("Done!");
